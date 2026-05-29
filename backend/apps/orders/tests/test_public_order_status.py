from django.test import Client, TestCase

from apps.delivery.models import DeliveryZone
from apps.orders.models import Address, Customer, Order, OrderItem
from apps.orders.services import transition_order_status
from apps.products.models import Category, Product, ProductVariant
from apps.tenants.models import Tenant


class PublicOrderStatusAPITest(TestCase):
    def setUp(self):
        self.client = Client()
        self.tenant = Tenant.objects.create(
            name='Drinklivery Panama',
            slug='drinklivery-panama',
            country='PA',
            city='Panama City',
            currency='PAB',
        )
        self.other_tenant = Tenant.objects.create(
            name='Drinklivery Costa Rica',
            slug='drinklivery-costa-rica',
            country='CR',
            city='San Jose',
            currency='CRC',
        )
        self.zone = DeliveryZone.objects.create(
            tenant=self.tenant,
            name='Casco Viejo',
            city='Panama City',
            base_fee='5.00',
            minimum_order_amount='20.00',
        )
        self.category = Category.objects.create(
            tenant=self.tenant,
            name='Cocktail Packs',
            slug='cocktail-packs',
        )
        self.product = Product.objects.create(
            tenant=self.tenant,
            category=self.category,
            name='Mojito Pack x4',
            slug='mojito-pack-x4',
            base_price='28.00',
            is_alcoholic=True,
        )

    def _create_order(self, **overrides):
        customer = Customer.objects.create(
            full_name='Ana Perez',
            phone='+50760000000',
            email='ana@example.com',
        )
        address = Address.objects.create(
            customer=customer,
            address_line='Calle 50',
            building_details='Tower A, Apt 12B',
            city='Panama City',
        )
        order = Order.objects.create(
            tenant=self.tenant,
            customer=customer,
            address=address,
            status=Order.Status.PENDING,
            delivery_zone=self.zone,
            scheduled_date='2026-06-15',
            scheduled_time_window='18:00-20:00',
            payment_method=Order.PaymentMethod.YAPPY_MANUAL,
            subtotal='56.00',
            delivery_fee='5.00',
            total='61.00',
            terms_accepted=True,
            age_confirmed_by_customer=True,
        )
        OrderItem.objects.create(
            order=order,
            product=self.product,
            quantity=2,
            unit_price='28.00',
        )
        return order

    def test_active_order_status_returns_200(self):
        order = self._create_order(status=Order.Status.ACCEPTED)
        response = self.client.get(f'/api/public/{self.tenant.slug}/orders/{order.order_code}/status/')

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['order_code'], order.order_code)
        self.assertEqual(data['status'], order.status)
        self.assertEqual(data['scheduled_date'], str(order.scheduled_date))
        self.assertEqual(data['scheduled_time_window'], order.scheduled_time_window)
        self.assertEqual(data['total'], '61.00')

    def test_unknown_tenant_returns_404(self):
        order = self._create_order()
        response = self.client.get(f'/api/public/unknown-tenant/orders/{order.order_code}/status/')

        self.assertEqual(response.status_code, 404)

    def test_unknown_order_returns_404(self):
        response = self.client.get(f'/api/public/{self.tenant.slug}/orders/ORD-00000000/status/')

        self.assertEqual(response.status_code, 404)

    def test_order_from_another_tenant_returns_404(self):
        other_customer = Customer.objects.create(
            full_name='Carlos Rivera',
            phone='+50680000000',
        )
        other_address = Address.objects.create(
            customer=other_customer,
            address_line='Av Central',
            city='San Jose',
        )
        other_zone = DeliveryZone.objects.create(
            tenant=self.other_tenant,
            name='San Jose',
            city='San Jose',
            base_fee='4.00',
        )
        other_order = Order.objects.create(
            tenant=self.other_tenant,
            customer=other_customer,
            address=other_address,
            status=Order.Status.READY_FOR_DELIVERY,
            delivery_zone=other_zone,
            scheduled_date='2026-07-01',
            scheduled_time_window='10:00-12:00',
            subtotal='30.00',
            delivery_fee='4.00',
            total='34.00',
        )
        response = self.client.get(f'/api/public/{self.tenant.slug}/orders/{other_order.order_code}/status/')

        self.assertEqual(response.status_code, 404)

    def test_response_contains_safe_fields_only(self):
        order = self._create_order()
        response = self.client.get(f'/api/public/{self.tenant.slug}/orders/{order.order_code}/status/')

        data = response.json()
        safe_fields = {'order_code', 'status', 'scheduled_date', 'scheduled_time_window', 'total'}
        self.assertEqual(set(data.keys()), safe_fields)
        self.assertNotIn('customer', data)
        self.assertNotIn('address', data)
        self.assertNotIn('payment_method', data)
        self.assertNotIn('items', data)
        self.assertNotIn('customer_notes', data)
