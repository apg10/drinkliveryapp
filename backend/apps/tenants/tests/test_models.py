from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.test import TestCase
from apps.tenants.models import OperatingSchedule, StorefrontSettings, Tenant


class TenantModelTest(TestCase):
    def test_tenant_creation(self):
        tenant = Tenant.objects.create(
            name='Drinklivery Panama',
            slug='drinklivery-panama',
            country='PA',
            city='Panama City',
            currency='PAB',
        )
        self.assertEqual(tenant.name, 'Drinklivery Panama')
        self.assertEqual(tenant.slug, 'drinklivery-panama')
        self.assertEqual(tenant.is_active, True)
        self.assertIsNotNone(tenant.created_at)
        self.assertIsNotNone(tenant.updated_at)

    def test_tenant_str(self):
        tenant = Tenant.objects.create(
            name='Drinklivery Panama',
            slug='drinklivery-panama',
        )
        self.assertEqual(str(tenant), 'Drinklivery Panama (drinklivery-panama)')

    def test_tenant_slug_unique(self):
        Tenant.objects.create(
            name='Drinklivery Panama',
            slug='drinklivery-panama',
        )
        with self.assertRaises(IntegrityError):
            Tenant.objects.create(
                name='Another Tenant',
                slug='drinklivery-panama',
            )

    def test_tenant_is_active_default(self):
        tenant = Tenant.objects.create(
            name='Test',
            slug='test',
        )
        self.assertTrue(tenant.is_active)

    def test_tenant_is_active_can_be_false(self):
        tenant = Tenant.objects.create(
            name='Inactive Tenant',
            slug='inactive-tenant',
            is_active=False,
        )
        self.assertFalse(tenant.is_active)


class StorefrontSettingsModelTest(TestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(
            name='Drinklivery Panama',
            slug='drinklivery-panama',
        )

    def test_storefront_settings_creation(self):
        settings = StorefrontSettings.objects.create(
            tenant=self.tenant,
            brand_name='Drinklivery',
            tagline='Premium cocktail delivery',
            is_storefront_enabled=True,
        )
        self.assertEqual(settings.tenant, self.tenant)
        self.assertEqual(settings.brand_name, 'Drinklivery')
        self.assertTrue(settings.is_storefront_enabled)
        self.assertIsNotNone(settings.created_at)
        self.assertIsNotNone(settings.updated_at)

    def test_storefront_settings_str(self):
        settings = StorefrontSettings.objects.create(
            tenant=self.tenant,
            brand_name='Drinklivery',
        )
        self.assertEqual(str(settings), 'Storefront for Drinklivery Panama')

    def test_storefront_settings_one_to_one(self):
        settings1 = StorefrontSettings.objects.create(
            tenant=self.tenant,
            brand_name='Drinklivery',
        )
        self.assertEqual(settings1.tenant.slug, 'drinklivery-panama')

    def test_storefront_settings_cascade_delete(self):
        settings = StorefrontSettings.objects.create(
            tenant=self.tenant,
            brand_name='Drinklivery',
        )
        settings_id = settings.id
        self.tenant.delete()
        self.assertFalse(StorefrontSettings.objects.filter(id=settings_id).exists())


class OperatingScheduleModelTest(TestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(
            name='Drinklivery Panama',
            slug='drinklivery-panama',
        )

    def test_operating_schedule_creation(self):
        schedule = OperatingSchedule.objects.create(
            tenant=self.tenant,
            weekday=OperatingSchedule.Weekday.MONDAY,
            opens_at='09:00:00',
            closes_at='22:00:00',
            accepts_orders=True,
        )
        self.assertEqual(schedule.tenant, self.tenant)
        self.assertEqual(schedule.weekday, 1)
        self.assertTrue(schedule.accepts_orders)
        self.assertIsNotNone(schedule.created_at)
        self.assertIsNotNone(schedule.updated_at)

    def test_operating_schedule_str(self):
        schedule = OperatingSchedule.objects.create(
            tenant=self.tenant,
            weekday=OperatingSchedule.Weekday.MONDAY,
            opens_at='09:00:00',
            closes_at='22:00:00',
        )
        self.assertIn('Monday', str(schedule))
        self.assertIn('Drinklivery Panama', str(schedule))

    def test_operating_schedule_many_days(self):
        for weekday in [1, 2, 3, 4, 5, 6, 7]:
            OperatingSchedule.objects.create(
                tenant=self.tenant,
                weekday=weekday,
                opens_at='09:00:00',
                closes_at='22:00:00',
            )
        self.assertEqual(self.tenant.operating_schedules.count(), 7)

    def test_operating_schedule_rejects_orders(self):
        schedule = OperatingSchedule.objects.create(
            tenant=self.tenant,
            weekday=OperatingSchedule.Weekday.SUNDAY,
            opens_at='09:00:00',
            closes_at='22:00:00',
            accepts_orders=False,
        )
        self.assertFalse(schedule.accepts_orders)
