from decimal import Decimal

from django.test import TestCase, Client

from apps.tenants.models import Tenant
from apps.products.models import Category, Product, ProductVariant


class PublicCatalogAPITest(TestCase):

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
        self.cat_a = Category.objects.create(
            tenant=self.tenant_a,
            name='Cocktail Packs',
            slug='cocktail-packs',
            display_order=1,
            is_active=True,
        )
        self.cat_inactive = Category.objects.create(
            tenant=self.tenant_a,
            name='Inactive Category',
            slug='inactive-category',
            display_order=2,
            is_active=False,
        )
        self.product_a = Product.objects.create(
            tenant=self.tenant_a,
            category=self.cat_a,
            name='Amazonas Cocktail Kit',
            slug='amazonas-cocktail-kit',
            base_price='45.00',
            is_alcoholic=True,
            is_active=True,
            display_order=1,
        )
        self.product_inactive = Product.objects.create(
            tenant=self.tenant_a,
            category=self.cat_a,
            name='Old Product',
            slug='old-product',
            base_price='30.00',
            is_active=False,
            display_order=2,
        )
        self.variant_a = ProductVariant.objects.create(
            product=self.product_a,
            name='For Two',
            price='50.00',
            is_active=True,
            display_order=1,
        )
        self.variant_inactive = ProductVariant.objects.create(
            product=self.product_a,
            name='Discontinued',
            price='20.00',
            is_active=False,
            display_order=2,
        )
        self.cat_b = Category.objects.create(
            tenant=self.tenant_b,
            name='Cat B',
            slug='cat-b',
            display_order=1,
            is_active=True,
        )
        self.product_b = Product.objects.create(
            tenant=self.tenant_b,
            category=self.cat_b,
            name='Product B',
            slug='product-b',
            base_price='25.00',
            is_active=True,
            display_order=1,
        )

    def test_catalog_returns_200_for_active_tenant(self):
        response = self.client.get(f'/api/public/{self.tenant_a.slug}/catalog/')
        self.assertEqual(response.status_code, 200)

    def test_catalog_excludes_inactive_categories(self):
        response = self.client.get(f'/api/public/{self.tenant_a.slug}/catalog/')
        data = response.json()
        category_slugs = [cat['slug'] for cat in data['categories']]
        self.assertIn('cocktail-packs', category_slugs)
        self.assertNotIn('inactive-category', category_slugs)

    def test_catalog_excludes_inactive_products(self):
        response = self.client.get(f'/api/public/{self.tenant_a.slug}/catalog/')
        data = response.json()
        product_slugs = []
        for cat in data['categories']:
            product_slugs.extend([p['slug'] for p in cat['products']])
        self.assertIn('amazonas-cocktail-kit', product_slugs)
        self.assertNotIn('old-product', product_slugs)

    def test_catalog_excludes_inactive_variants(self):
        response = self.client.get(f'/api/public/{self.tenant_a.slug}/catalog/')
        data = response.json()
        variants = []
        for cat in data['categories']:
            for p in cat['products']:
                variants.extend([v['name'] for v in p['variants']])
        self.assertIn('For Two', variants)
        self.assertNotIn('Discontinued', variants)

    def test_tenant_isolation_products_not_shared(self):
        response = self.client.get(f'/api/public/{self.tenant_a.slug}/catalog/')
        data = response.json()
        product_slugs = []
        for cat in data['categories']:
            product_slugs.extend([p['slug'] for p in cat['products']])
        self.assertIn('amazonas-cocktail-kit', product_slugs)
        self.assertNotIn('product-b', product_slugs)

    def test_unknown_tenant_returns_404(self):
        response = self.client.get('/api/public/nonexistent-tenant/catalog/')
        self.assertEqual(response.status_code, 404)

    def test_inactive_tenant_returns_404(self):
        response = self.client.get(f'/api/public/{self.inactive_tenant.slug}/catalog/')
        self.assertEqual(response.status_code, 404)

    def test_catalog_orders_by_display_order(self):
        cat_2 = Category.objects.create(
            tenant=self.tenant_a,
            name='Z Category',
            slug='z-category',
            display_order=100,
            is_active=True,
        )
        cat_1 = Category.objects.create(
            tenant=self.tenant_a,
            name='A Category',
            slug='a-category',
            display_order=0,
            is_active=True,
        )
        response = self.client.get(f'/api/public/{self.tenant_a.slug}/catalog/')
        data = response.json()
        category_slugs = [cat['slug'] for cat in data['categories']]
        self.assertEqual(category_slugs[0], 'a-category')
        self.assertEqual(category_slugs[1], 'cocktail-packs')
        self.assertEqual(category_slugs[2], 'z-category')
