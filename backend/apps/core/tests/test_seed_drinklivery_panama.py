from django.core.management import call_command
from django.test import TestCase, TransactionTestCase
from decimal import Decimal

from apps.delivery.models import DeliveryZone
from apps.products.models import Category, Product, ProductVariant
from apps.tenants.models import OperatingSchedule, StorefrontSettings, Tenant


class SeedDrinkliveryPanamaModelCreateTest(TestCase):
    """Test the seed command creates records correctly."""

    def test_command_creates_tenant(self):
        call_command('seed_drinklivery_panama')
        tenant = Tenant.objects.get(slug='drinklivery-panama')
        self.assertEqual(tenant.name, 'Drinklivery Panama')
        self.assertEqual(tenant.country, 'PA')
        self.assertEqual(tenant.city, 'Panama City')
        self.assertEqual(tenant.currency, 'PAB')
        self.assertTrue(tenant.is_active)

    def test_command_creates_storefront_settings(self):
        call_command('seed_drinklivery_panama')
        tenant = Tenant.objects.get(slug='drinklivery-panama')
        storefront = StorefrontSettings.objects.get(tenant=tenant)
        self.assertEqual(storefront.brand_name, 'Drinklivery')
        self.assertEqual(
            storefront.tagline,
            'Ready-to-drink cocktails and event drinks in Panama City',
        )
        self.assertTrue(storefront.is_storefront_enabled)

    def test_command_creates_7_schedule_rows(self):
        call_command('seed_drinklivery_panama')
        tenant = Tenant.objects.get(slug='drinklivery-panama')
        schedules = tenant.operating_schedules.all()
        self.assertEqual(schedules.count(), 7)
        weekdays = set(schedules.values_list('weekday', flat=True))
        self.assertEqual(weekdays, {1, 2, 3, 4, 5, 6, 7})


class SeedDrinkliveryPanamaIdempotentTest(TransactionTestCase):
    """Test that running the command twice does not duplicate records."""

    def test_running_twice_does_not_duplicate_tenant(self):
        call_command('seed_drinklivery_panama')
        call_command('seed_drinklivery_panama')
        count = Tenant.objects.filter(slug='drinklivery-panama').count()
        self.assertEqual(count, 1)

    def test_running_twice_does_not_duplicate_storefront_settings(self):
        call_command('seed_drinklivery_panama')
        call_command('seed_drinklivery_panama')
        tenant = Tenant.objects.get(slug='drinklivery-panama')
        count = StorefrontSettings.objects.filter(tenant=tenant).count()
        self.assertEqual(count, 1)

    def test_running_twice_does_not_duplicate_schedules(self):
        call_command('seed_drinklivery_panama')
        call_command('seed_drinklivery_panama')
        tenant = Tenant.objects.get(slug='drinklivery-panama')
        count = tenant.operating_schedules.count()
        self.assertEqual(count, 7)


class SeedDrinkliveryPanamaCatalogTest(TestCase):
    """Test the seed command creates catalog records correctly."""

    def test_command_creates_categories(self):
        call_command('seed_drinklivery_panama')
        tenant = Tenant.objects.get(slug='drinklivery-panama')
        categories = tenant.categories.all()
        self.assertEqual(categories.count(), 2)
        slugs = set(categories.values_list('slug', flat=True))
        self.assertIn('cocktail-packs', slugs)
        self.assertIn('mocktails', slugs)

    def test_command_creates_products(self):
        call_command('seed_drinklivery_panama')
        tenant = Tenant.objects.get(slug='drinklivery-panama')
        products = tenant.products.all()
        self.assertEqual(products.count(), 3)
        slugs = set(products.values_list('slug', flat=True))
        self.assertIn('mojito-pack-x4', slugs)
        self.assertIn('margarita-pack-x4', slugs)
        self.assertIn('passion-fruit-mocktail-pack-x4', slugs)
        mojito = tenant.products.get(slug='mojito-pack-x4')
        self.assertTrue(mojito.is_alcoholic)
        self.assertEqual(mojito.base_price, Decimal('28.00'))
        self.assertEqual(mojito.servings, 4)
        self.assertEqual(mojito.image, '/catalog/mojito-pack-x4.webp')
        margarita = tenant.products.get(slug='margarita-pack-x4')
        self.assertTrue(margarita.is_alcoholic)
        self.assertEqual(margarita.base_price, Decimal('32.00'))
        self.assertEqual(margarita.servings, 4)
        self.assertEqual(margarita.image, '/catalog/margarita-pack-x4.webp')
        mocktail = tenant.products.get(slug='passion-fruit-mocktail-pack-x4')
        self.assertFalse(mocktail.is_alcoholic)
        self.assertEqual(mocktail.base_price, Decimal('22.00'))
        self.assertEqual(mocktail.servings, 4)
        self.assertEqual(mocktail.image, '/catalog/passion-fruit-mocktail-pack-x4.webp')

    def test_command_creates_variants(self):
        call_command('seed_drinklivery_panama')
        tenant = Tenant.objects.get(slug='drinklivery-panama')
        mojito = tenant.products.get(slug='mojito-pack-x4')
        variants = mojito.variants.all()
        self.assertEqual(variants.count(), 1)
        mojito_var = variants.first()
        self.assertEqual(mojito_var.name, 'Mojito Pack x8')
        self.assertEqual(mojito_var.servings, 8)
        self.assertEqual(mojito_var.price, Decimal('50.00'))
        margarita = tenant.products.get(slug='margarita-pack-x4')
        variants = margarita.variants.all()
        self.assertEqual(variants.count(), 1)
        margarita_var = variants.first()
        self.assertEqual(margarita_var.name, 'Margarita Pack x8')
        self.assertEqual(margarita_var.servings, 8)
        self.assertEqual(margarita_var.price, Decimal('58.00'))

    def test_command_creates_delivery_zones(self):
        call_command('seed_drinklivery_panama')
        tenant = Tenant.objects.get(slug='drinklivery-panama')
        zones = tenant.delivery_zones.all()
        self.assertEqual(zones.count(), 3)
        zone_map = {z.name: z for z in zones}
        self.assertIn('Casco Viejo', zone_map)
        self.assertIn('San Francisco', zone_map)
        self.assertIn('Costa del Este', zone_map)
        self.assertEqual(zone_map['Casco Viejo'].base_fee, Decimal('5.00'))
        self.assertEqual(zone_map['Casco Viejo'].minimum_order_amount, Decimal('20.00'))
        self.assertEqual(zone_map['San Francisco'].base_fee, Decimal('4.00'))
        self.assertEqual(zone_map['San Francisco'].minimum_order_amount, Decimal('20.00'))
        self.assertEqual(zone_map['Costa del Este'].base_fee, Decimal('6.00'))
        self.assertEqual(zone_map['Costa del Este'].minimum_order_amount, Decimal('25.00'))


class SeedDrinkliveryPanamaCatalogIdempotentTest(TransactionTestCase):
    """Test that running the command twice does not duplicate catalog or zones."""

    def test_running_twice_does_not_duplicate_categories(self):
        call_command('seed_drinklivery_panama')
        call_command('seed_drinklivery_panama')
        tenant = Tenant.objects.get(slug='drinklivery-panama')
        count = tenant.categories.count()
        self.assertEqual(count, 2)

    def test_running_twice_does_not_duplicate_products(self):
        call_command('seed_drinklivery_panama')
        call_command('seed_drinklivery_panama')
        tenant = Tenant.objects.get(slug='drinklivery-panama')
        count = tenant.products.count()
        self.assertEqual(count, 3)

    def test_running_twice_does_not_duplicate_variants(self):
        call_command('seed_drinklivery_panama')
        call_command('seed_drinklivery_panama')
        mojito = Tenant.objects.get(slug='drinklivery-panama').products.get(slug='mojito-pack-x4')
        count = mojito.variants.count()
        self.assertEqual(count, 1)

    def test_running_twice_does_not_duplicate_zones(self):
        call_command('seed_drinklivery_panama')
        call_command('seed_drinklivery_panama')
        tenant = Tenant.objects.get(slug='drinklivery-panama')
        count = tenant.delivery_zones.count()
        self.assertEqual(count, 3)


class SeedDrinkliveryPanamaUpdateExistingTest(TestCase):
    """Test that the seed command refreshes existing seed records."""

    def setUp(self):
        call_command('seed_drinklivery_panama')
        self.tenant = Tenant.objects.get(slug='drinklivery-panama')

    def test_running_again_updates_existing_schedule(self):
        monday = self.tenant.operating_schedules.get(weekday=OperatingSchedule.Weekday.MONDAY)
        monday.opens_at = '01:00:00'
        monday.closes_at = '02:00:00'
        monday.accepts_orders = False
        monday.save(update_fields=['opens_at', 'closes_at', 'accepts_orders'])

        call_command('seed_drinklivery_panama')

        monday.refresh_from_db()
        self.assertEqual(str(monday.opens_at), '09:00:00')
        self.assertEqual(str(monday.closes_at), '23:00:00')
        self.assertTrue(monday.accepts_orders)

    def test_running_again_updates_existing_product(self):
        mojito = self.tenant.products.get(slug='mojito-pack-x4')
        mojito.base_price = Decimal('1.00')
        mojito.servings = 1
        mojito.is_active = False
        mojito.save(update_fields=['base_price', 'servings', 'is_active'])

        call_command('seed_drinklivery_panama')

        mojito.refresh_from_db()
        self.assertEqual(mojito.base_price, Decimal('28.00'))
        self.assertEqual(mojito.servings, 4)
        self.assertTrue(mojito.is_active)
        self.assertEqual(mojito.image, '/catalog/mojito-pack-x4.webp')

    def test_running_again_updates_existing_variant(self):
        mojito = self.tenant.products.get(slug='mojito-pack-x4')
        variant = mojito.variants.get(name='Mojito Pack x8')
        variant.price = Decimal('1.00')
        variant.servings = 1
        variant.is_active = False
        variant.save(update_fields=['price', 'servings', 'is_active'])

        call_command('seed_drinklivery_panama')

        variant.refresh_from_db()
        self.assertEqual(variant.price, Decimal('50.00'))
        self.assertEqual(variant.servings, 8)
        self.assertTrue(variant.is_active)

    def test_running_again_updates_existing_delivery_zone(self):
        zone = self.tenant.delivery_zones.get(name='Casco Viejo')
        zone.base_fee = Decimal('99.00')
        zone.minimum_order_amount = Decimal('99.00')
        zone.is_active = False
        zone.save(update_fields=['base_fee', 'minimum_order_amount', 'is_active'])

        call_command('seed_drinklivery_panama')

        zone.refresh_from_db()
        self.assertEqual(zone.base_fee, Decimal('5.00'))
        self.assertEqual(zone.minimum_order_amount, Decimal('20.00'))
        self.assertTrue(zone.is_active)
