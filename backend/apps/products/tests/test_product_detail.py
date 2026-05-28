from django.test import TestCase, Client

from apps.tenants.models import Tenant
from apps.products.models import Category, Product, ProductVariant


class PublicProductDetailAPITest(TestCase):

    def setUp(self):
        self.client = Client()
        self.tenant_a = Tenant.objects.create(
            name='Drinklivery Panama',
            slug='drinklivery-panama',
            country='PA',
            city='Panama City',
            currency='PAB',
            is_active=True,
        )
        self.tenant_b = Tenant.objects.create(
            name='Drinklivery Costa Rica',
            slug='drinklivery-costa-rica',
            country='CR',
            city='San Jose',
            currency='CRC',
            is_active=True,
        )
        self.inactive_tenant = Tenant.objects.create(
            name='Inactive Tenant',
            slug='inactive-tenant',
            country='PA',
            is_active=False,
        )
        self.active_cat = Category.objects.create(
            tenant=self.tenant_a,
            name='Cocktail Packs',
            slug='cocktail-packs',
            display_order=1,
            is_active=True,
        )
        self.inactive_cat = Category.objects.create(
            tenant=self.tenant_a,
            name='Inactive Category',
            slug='inactive-category',
            display_order=2,
            is_active=False,
        )
        self.active_product = Product.objects.create(
            tenant=self.tenant_a,
            category=self.active_cat,
            name='Amazonas Cocktail Kit',
            slug='amazonas-cocktail-kit',
            description='Premium cocktail kit',
            base_price='45.00',
            is_alcoholic=True,
            is_active=True,
            display_order=1,
        )
        self.inactive_product = Product.objects.create(
            tenant=self.tenant_a,
            category=self.active_cat,
            name='Old Product',
            slug='old-product',
            description='No longer available',
            base_price='30.00',
            is_active=False,
            display_order=2,
        )
        self.inactive_cat_product = Product.objects.create(
            tenant=self.tenant_a,
            category=self.inactive_cat,
            name='Inactive Cat Product',
            slug='inactive-cat-product',
            description='Product under inactive category',
            base_price='25.00',
            is_active=True,
            display_order=3,
        )
        self.product_b_tenant = Product.objects.create(
            tenant=self.tenant_b,
            category=Category.objects.create(
                tenant=self.tenant_b,
                name='Cat B',
                slug='cat-b',
                display_order=1,
                is_active=True,
            ),
            name='Product B',
            slug='product-b',
            description='Another tenant product',
            base_price='20.00',
            is_active=True,
            display_order=1,
        )
        self.active_variant = ProductVariant.objects.create(
            product=self.active_product,
            name='For Two',
            price='50.00',
            is_active=True,
            display_order=1,
        )
        self.inactive_variant = ProductVariant.objects.create(
            product=self.active_product,
            name='Discontinued Size',
            price='30.00',
            is_active=False,
            display_order=2,
        )

    def test_active_product_detail_returns_200(self):
        response = self.client.get(f'/api/public/{self.tenant_a.slug}/products/amazonas-cocktail-kit/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['id'], self.active_product.id)
        self.assertEqual(data['name'], 'Amazonas Cocktail Kit')
        self.assertEqual(data['slug'], 'amazonas-cocktail-kit')
        self.assertEqual(data['is_alcoholic'], True)
        self.assertFalse(any(v['name'] == 'Discontinued Size' for v in data['variants']))
        self.assertTrue(any(v['name'] == 'For Two' for v in data['variants']))

    def test_inactive_product_returns_404(self):
        response = self.client.get(f'/api/public/{self.tenant_a.slug}/products/old-product/')
        self.assertEqual(response.status_code, 404)

    def test_product_under_inactive_category_returns_404(self):
        response = self.client.get(f'/api/public/{self.tenant_a.slug}/products/inactive-cat-product/')
        self.assertEqual(response.status_code, 404)

    def test_product_from_another_tenant_returns_404(self):
        response = self.client.get(f'/api/public/{self.tenant_a.slug}/products/product-b/')
        self.assertEqual(response.status_code, 404)

    def test_inactive_variant_is_excluded(self):
        response = self.client.get(f'/api/public/{self.tenant_a.slug}/products/amazonas-cocktail-kit/')
        data = response.json()
        variant_names = [v['name'] for v in data['variants']]
        self.assertNotIn('Discontinued Size', variant_names)
        self.assertIn('For Two', variant_names)

    def test_unknown_product_returns_404(self):
        response = self.client.get('/api/public/drinklivery-panama/products/nonexistent-product/')
        self.assertEqual(response.status_code, 404)

    def test_unknown_tenant_returns_404(self):
        response = self.client.get('/api/public/nonexistent-tenant/products/amazonas-cocktail-kit/')
        self.assertEqual(response.status_code, 404)

    def test_inactive_tenant_returns_404(self):
        response = self.client.get(f'/api/public/{self.inactive_tenant.slug}/products/amazonas-cocktail-kit/')
        self.assertEqual(response.status_code, 404)

    def test_product_detail_includes_active_variants_only(self):
        response = self.client.get(f'/api/public/{self.tenant_a.slug}/products/amazonas-cocktail-kit/')
        data = response.json()
        self.assertEqual(len(data['variants']), 1)
        self.assertEqual(data['variants'][0]['name'], 'For Two')
        self.assertTrue(data['variants'][0]['is_active'])

    def test_product_detail_has_required_fields(self):
        response = self.client.get(f'/api/public/{self.tenant_a.slug}/products/amazonas-cocktail-kit/')
        data = response.json()
        required_fields = [
            'id', 'name', 'slug', 'description',
            'base_price', 'image', 'alcohol_percentage_note',
            'servings', 'is_alcoholic', 'display_order', 'variants'
        ]
        for field in required_fields:
            self.assertIn(field, data)
