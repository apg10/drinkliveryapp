from django.test import TestCase, Client
from apps.tenants.models import Tenant
from apps.delivery.models import DeliveryZone


class DeliveryZonesAPITest(TestCase):

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
        self.zone_active_a = DeliveryZone.objects.create(
            tenant=self.tenant_a,
            name='Casco Viejo',
            city='Panama City',
            base_fee='5.00',
            is_active=True,
        )
        self.zone_inactive_a = DeliveryZone.objects.create(
            tenant=self.tenant_a,
            name='Inactive Zone',
            city='Panama City',
            base_fee='3.00',
            is_active=False,
        )
        self.zone_active_b = DeliveryZone.objects.create(
            tenant=self.tenant_b,
            name='San Jose Zone',
            city='San Jose',
            base_fee='4.00',
            is_active=True,
        )

    def test_active_zones_endpoint_returns_200(self):
        response = self.client.get(f'/api/public/{self.tenant_a.slug}/delivery-zones/')
        self.assertEqual(response.status_code, 200)

    def test_active_zones_endpoint_returns_zones(self):
        response = self.client.get(f'/api/public/{self.tenant_a.slug}/delivery-zones/')
        data = response.json()
        self.assertIn('zones', data)
        self.assertEqual(len(data['zones']), 1)
        self.assertEqual(data['zones'][0]['name'], 'Casco Viejo')

    def test_inactive_zones_are_excluded(self):
        response = self.client.get(f'/api/public/{self.tenant_a.slug}/delivery-zones/')
        data = response.json()
        zone_names = [z['name'] for z in data['zones']]
        self.assertIn('Casco Viejo', zone_names)
        self.assertNotIn('Inactive Zone', zone_names)

    def test_tenant_isolation_zones_not_shared(self):
        response = self.client.get(f'/api/public/{self.tenant_a.slug}/delivery-zones/')
        data = response.json()
        zone_names = [z['name'] for z in data['zones']]
        self.assertIn('Casco Viejo', zone_names)
        self.assertNotIn('San Jose Zone', zone_names)

    def test_unknown_tenant_returns_404(self):
        response = self.client.get('/api/public/nonexistent-tenant/delivery-zones/')
        self.assertEqual(response.status_code, 404)

    def test_inactive_tenant_returns_404(self):
        response = self.client.get(f'/api/public/{self.inactive_tenant.slug}/delivery-zones/')
        self.assertEqual(response.status_code, 404)

    def test_zones_include_all_required_fields(self):
        response = self.client.get(f'/api/public/{self.tenant_a.slug}/delivery-zones/')
        data = response.json()
        zone = data['zones'][0]
        self.assertIn('id', zone)
        self.assertIn('name', zone)
        self.assertIn('city', zone)
        self.assertIn('base_fee', zone)
        self.assertIn('minimum_order_amount', zone)
        self.assertIn('is_active', zone)
