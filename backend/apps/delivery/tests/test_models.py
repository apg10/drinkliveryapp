from decimal import Decimal
from django.test import TestCase
from apps.tenants.models import Tenant
from apps.delivery.models import DeliveryZone


class DeliveryZoneModelTest(TestCase):

    def test_delivery_zone_creation(self):
        tenant = Tenant.objects.create(
            name='Drinklivery Panama',
            slug='drinklivery-panama',
            country='PA',
            city='Panama City',
            currency='PAB',
        )
        zone = DeliveryZone.objects.create(
            tenant=tenant,
            name='Casco Viejo',
            city='Panama City',
            base_fee='5.00',
            minimum_order_amount='20.00',
            is_active=True,
        )
        zone.refresh_from_db()
        self.assertEqual(zone.name, 'Casco Viejo')
        self.assertEqual(zone.city, 'Panama City')
        self.assertEqual(zone.base_fee, Decimal('5.00'))
        self.assertEqual(zone.minimum_order_amount, Decimal('20.00'))
        self.assertTrue(zone.is_active)
        self.assertIsNotNone(zone.created_at)
        self.assertIsNotNone(zone.updated_at)

    def test_delivery_zone_str(self):
        tenant = Tenant.objects.create(
            name='Drinklivery Panama',
            slug='drinklivery-panama',
        )
        zone = DeliveryZone.objects.create(
            tenant=tenant,
            name='Casco Viejo',
            city='Panama City',
            base_fee='5.00',
        )
        self.assertEqual(str(zone), 'Casco Viejo (Drinklivery Panama)')

    def test_delivery_zone_is_active_default(self):
        tenant = Tenant.objects.create(
            name='Drinklivery Panama',
            slug='drinklivery-panama',
        )
        zone = DeliveryZone.objects.create(
            tenant=tenant,
            name='Normal',
            city='Panama City',
            base_fee='5.00',
        )
        self.assertTrue(zone.is_active)

    def test_delivery_zone_inactivate_can_be_false(self):
        tenant = Tenant.objects.create(
            name='Drinklivery Panama',
            slug='drinklivery-panama',
        )
        zone = DeliveryZone.objects.create(
            tenant=tenant,
            name='Inactive Zone',
            city='Panama City',
            base_fee='5.00',
            is_active=False,
        )
        self.assertFalse(zone.is_active)

    def test_delivery_zone_minimum_order_amount_default(self):
        tenant = Tenant.objects.create(
            name='Drinklivery Panama',
            slug='drinklivery-panama',
        )
        zone = DeliveryZone.objects.create(
            tenant=tenant,
            name='Default Min',
            city='Panama City',
            base_fee='5.00',
        )
        zone.refresh_from_db()
        self.assertEqual(zone.minimum_order_amount, Decimal('0'))

    def test_delivery_zone_tenant_relation(self):
        tenant_a = Tenant.objects.create(
            name='Drinklivery Panama',
            slug='drinklivery-panama',
        )
        tenant_b = Tenant.objects.create(
            name='Drinklivery Costa Rica',
            slug='drinklivery-costa-rica',
        )
        zone_a = DeliveryZone.objects.create(
            tenant=tenant_a,
            name='Panama Zone',
            city='Panama City',
            base_fee='5.00',
        )
        zone_b = DeliveryZone.objects.create(
            tenant=tenant_b,
            name='CR Zone',
            city='San Jose',
            base_fee='3.00',
        )
        self.assertEqual(tenant_a.delivery_zones.count(), 1)
        self.assertEqual(tenant_a.delivery_zones.first(), zone_a)
        self.assertEqual(tenant_b.delivery_zones.count(), 1)
        self.assertEqual(tenant_b.delivery_zones.first(), zone_b)
