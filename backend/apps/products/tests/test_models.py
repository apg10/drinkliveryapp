from django.db import IntegrityError, transaction
from django.test import TestCase
from django.core.exceptions import ValidationError

from apps.tenants.models import Tenant
from apps.products.models import Category, Product, ProductVariant


class CategoryModelTest(TestCase):

    def _create_tenant(self):
        return Tenant.objects.create(name='Drinklivery Panama', slug='drinklivery-panama', country='PA', city='Panama City', currency='PAB', is_active=True)

    def test_category_creation(self):
        tenant = self._create_tenant()
        category = Category.objects.create(
            tenant=tenant,
            name='Cocktail Packs',
            slug='cocktail-packs',
            description='Ready-to-serve cocktail packs',
            display_order=1,
            is_active=True,
        )
        self.assertEqual(category.name, 'Cocktail Packs')
        self.assertEqual(category.slug, 'cocktail-packs')
        self.assertEqual(category.tenant, tenant)
        self.assertTrue(category.is_active)
        self.assertEqual(category.display_order, 1)
        self.assertIsNotNone(category.created_at)
        self.assertIsNotNone(category.updated_at)

    def test_category_str(self):
        tenant = self._create_tenant()
        category = Category.objects.create(
            tenant=tenant,
            name='Mocktail Packs',
            slug='mocktail-packs',
        )
        self.assertEqual(str(category), 'Mocktail Packs (drinklivery-panama)')

    def test_category_slug_must_be_unique_per_tenant(self):
        tenant = self._create_tenant()
        Category.objects.create(tenant=tenant, name='Cocktail Packs', slug='cocktail-packs')

        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                Category.objects.create(tenant=tenant, name='Duplicate', slug='cocktail-packs')

    def test_category_slug_can_repeat_across_tenants(self):
        tenant_a = self._create_tenant()
        tenant_b = Tenant.objects.create(name='Drinklivery Costa Rica', slug='drinklivery-costa-rica', country='CR')

        Category.objects.create(tenant=tenant_a, name='Cocktail Packs', slug='cocktail-packs')
        category_b = Category.objects.create(tenant=tenant_b, name='Cocktail Packs', slug='cocktail-packs')

        self.assertEqual(category_b.slug, 'cocktail-packs')


class ProductModelTest(TestCase):

    def _create_tenant(self):
        return Tenant.objects.create(name='Drinklivery Panama', slug='drinklivery-panama', country='PA', city='Panama City', currency='PAB', is_active=True)

    def _create_category(self, tenant=None):
        if tenant is None:
            tenant = self._create_tenant()
        return Category.objects.create(
            tenant=tenant,
            name='Cocktail Packs',
            slug='cocktail-packs',
            display_order=1,
        )

    def test_product_creation(self):
        tenant = self._create_tenant()
        category = self._create_category(tenant)
        product = Product.objects.create(
            tenant=tenant,
            category=category,
            name='Amazonas Cocktail Kit',
            slug='amazonas-cocktail-kit',
            description='Premium cocktail kit for two',
            base_price='45.00',
            is_alcoholic=True,
            is_active=True,
            display_order=1,
        )
        self.assertEqual(product.name, 'Amazonas Cocktail Kit')
        self.assertEqual(product.slug, 'amazonas-cocktail-kit')
        self.assertEqual(product.tenant, tenant)
        self.assertEqual(product.category, category)
        self.assertEqual(str(product.base_price), '45.00')
        self.assertTrue(product.is_alcoholic)
        self.assertTrue(product.is_active)
        self.assertEqual(product.display_order, 1)
        self.assertIsNotNone(product.created_at)
        self.assertIsNotNone(product.updated_at)

    def test_product_str(self):
        tenant = self._create_tenant()
        category = self._create_category(tenant)
        product = Product.objects.create(
            tenant=tenant,
            category=category,
            name='Tropical Mocktail Pack',
            slug='tropical-mocktail-pack',
            base_price='20.00',
        )
        self.assertEqual(str(product), 'Tropical Mocktail Pack (drinklivery-panama)')

    def test_product_tenant_must_match_category_tenant(self):
        tenant_a = self._create_tenant()
        other_tenant = Tenant.objects.create(name='Other Tenant', slug='other-tenant', country='PA', is_active=True)
        other_category = Category.objects.create(
            tenant=other_tenant,
            name='Other Category',
            slug='other-category',
        )
        product = Product(
            tenant=tenant_a,
            category=other_category,
            name='Mismatched Product',
            slug='mismatched-product',
            base_price='10.00',
        )
        with self.assertRaises(ValidationError):
            product.full_clean()

    def test_inactive_product_flag(self):
        tenant = self._create_tenant()
        category = self._create_category(tenant)
        product = Product.objects.create(
            tenant=tenant,
            category=category,
            name='Old Product',
            slug='old-product',
            base_price='20.00',
            is_active=False,
            is_alcoholic=False,
        )
        self.assertFalse(product.is_active)

    def test_product_slug_must_be_unique_per_tenant(self):
        tenant = self._create_tenant()
        category = self._create_category(tenant)
        Product.objects.create(tenant=tenant, category=category, name='Mojito Pack', slug='mojito-pack', base_price='20.00')

        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                Product.objects.create(tenant=tenant, category=category, name='Duplicate Mojito', slug='mojito-pack', base_price='22.00')

    def test_product_slug_can_repeat_across_tenants(self):
        tenant_a = self._create_tenant()
        tenant_b = Tenant.objects.create(name='Drinklivery Costa Rica', slug='drinklivery-costa-rica', country='CR')
        category_a = self._create_category(tenant_a)
        category_b = Category.objects.create(tenant=tenant_b, name='Cocktail Packs', slug='cocktail-packs')

        Product.objects.create(tenant=tenant_a, category=category_a, name='Mojito Pack', slug='mojito-pack', base_price='20.00')
        product_b = Product.objects.create(tenant=tenant_b, category=category_b, name='Mojito Pack', slug='mojito-pack', base_price='24.00')

        self.assertEqual(product_b.slug, 'mojito-pack')


class ProductVariantModelTest(TestCase):

    def _create_tenant(self):
        return Tenant.objects.create(name='Drinklivery Panama', slug='drinklivery-panama', country='PA', city='Panama City', currency='PAB', is_active=True)

    def _create_product(self, tenant=None):
        if tenant is None:
            tenant = self._create_tenant()
        category = Category.objects.create(
            tenant=tenant,
            name='Cocktail Packs',
            slug='cocktail-packs',
        )
        return Product.objects.create(
            tenant=tenant,
            category=category,
            name='Cocktail Kit',
            slug='cocktail-kit',
            base_price='40.00',
        )

    def test_variant_creation(self):
        tenant = self._create_tenant()
        product = self._create_product(tenant)
        variant = ProductVariant.objects.create(
            product=product,
            name='For Two',
            servings=2,
            price='45.00',
            is_active=True,
            display_order=1,
        )
        self.assertEqual(variant.name, 'For Two')
        self.assertEqual(variant.servings, 2)
        self.assertEqual(str(variant.price), '45.00')
        self.assertTrue(variant.is_active)
        self.assertEqual(variant.display_order, 1)
        self.assertIsNotNone(variant.created_at)
        self.assertIsNotNone(variant.updated_at)

    def test_variant_str(self):
        product = self._create_product()
        variant = ProductVariant.objects.create(
            product=product,
            name='For Four',
            price='80.00',
        )
        self.assertEqual(str(variant), 'For Four (Cocktail Kit)')

    def test_inactive_variant_flag(self):
        product = self._create_product()
        variant = ProductVariant.objects.create(
            product=product,
            name='Discontinued Size',
            price='30.00',
            is_active=False,
        )
        self.assertFalse(variant.is_active)


class DisplayOrderTest(TestCase):

    def _create_tenant(self):
        return Tenant.objects.create(name='Drinklivery Panama', slug='drinklivery-panama', country='PA', is_active=True)

    def test_category_display_order_field_exists(self):
        tenant = self._create_tenant()
        cat1 = Category.objects.create(tenant=tenant, name='Cat 1', slug='cat-1', display_order=10)
        cat2 = Category.objects.create(tenant=tenant, name='Cat 2', slug='cat-2', display_order=5)
        self.assertEqual(Category.objects.filter(tenant=tenant).first().slug, 'cat-2')

    def test_product_display_order_field_exists(self):
        tenant = self._create_tenant()
        category = Category.objects.create(tenant=tenant, name='Cat', slug='cat')
        p1 = Product.objects.create(tenant=tenant, category=category, name='P 1', slug='p-1', base_price='10.00', display_order=10)
        p2 = Product.objects.create(tenant=tenant, category=category, name='P 2', slug='p-2', base_price='10.00', display_order=5)
        self.assertEqual(Product.objects.filter(tenant=tenant).first().slug, 'p-2')

    def test_variant_display_order_field_exists(self):
        product = self._create_product()
        v1 = ProductVariant.objects.create(product=product, name='V 1', price='10.00', display_order=10)
        v2 = ProductVariant.objects.create(product=product, name='V 2', price='10.00', display_order=5)
        self.assertEqual(ProductVariant.objects.filter(product=product).first().name, 'V 2')

    def _create_product(self):
        tenant = Tenant.objects.create(name='Drinklivery Panama', slug='drinklivery-panama', country='PA', is_active=True)
        category = Category.objects.create(tenant=tenant, name='Cat', slug='cat')
        return Product.objects.create(tenant=tenant, category=category, name='Product', slug='product', base_price='10.00')
