from decimal import Decimal

from django.test import TestCase

from apps.delivery.models import DeliveryZone
from apps.orders.models import Address, Customer, Order, OrderItem, OrderStatusHistory
from apps.products.models import Category, Product, ProductVariant
from apps.tenants.models import Tenant


class OrderModelTestCase(TestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(
            name='Drinklivery Panama',
            slug='drinklivery-panama',
            country='PA',
            city='Panama City',
            currency='PAB',
        )
        self.customer = Customer.objects.create(
            full_name='Ana Perez',
            phone='+50760000000',
            email='ana@example.com',
        )
        self.address = Address.objects.create(
            customer=self.customer,
            address_line='Calle 50',
            building_details='Tower A, Apt 12B',
            city='Panama City',
            delivery_notes='Call on arrival',
        )
        self.delivery_zone = DeliveryZone.objects.create(
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

    def create_order(self, **overrides):
        data = {
            'tenant': self.tenant,
            'customer': self.customer,
            'address': self.address,
            'delivery_zone': self.delivery_zone,
            'scheduled_date': '2026-06-15',
            'scheduled_time_window': '18:00-20:00',
            'subtotal': Decimal('28.00'),
            'delivery_fee': Decimal('5.00'),
            'total': Decimal('33.00'),
            'payment_method': Order.PaymentMethod.YAPPY_MANUAL,
        }
        data.update(overrides)
        return Order.objects.create(**data)


class CustomerAndAddressModelTest(OrderModelTestCase):
    def test_customer_creation(self):
        self.assertEqual(self.customer.full_name, 'Ana Perez')
        self.assertEqual(self.customer.phone, '+50760000000')
        self.assertEqual(self.customer.email, 'ana@example.com')
        self.assertIsNotNone(self.customer.created_at)
        self.assertIsNotNone(self.customer.updated_at)

    def test_customer_str(self):
        self.assertEqual(str(self.customer), 'Ana Perez (+50760000000)')

    def test_address_creation(self):
        self.assertEqual(self.address.customer, self.customer)
        self.assertEqual(self.address.address_line, 'Calle 50')
        self.assertEqual(self.address.city, 'Panama City')
        self.assertIsNotNone(self.address.created_at)
        self.assertIsNotNone(self.address.updated_at)

    def test_address_str(self):
        self.assertEqual(str(self.address), 'Calle 50 (Ana Perez)')


class OrderModelTest(OrderModelTestCase):
    def test_order_creation_defaults_to_pending(self):
        order = self.create_order()

        self.assertEqual(order.status, Order.Status.PENDING)
        self.assertEqual(order.payment_status, Order.PaymentStatus.PENDING)
        self.assertEqual(order.tenant, self.tenant)
        self.assertEqual(order.customer, self.customer)
        self.assertEqual(order.address, self.address)
        self.assertEqual(order.delivery_zone, self.delivery_zone)

    def test_order_code_is_generated(self):
        order = self.create_order()

        self.assertTrue(order.order_code.startswith('ORD-'))
        self.assertEqual(len(order.order_code), 12)

    def test_order_code_is_unique(self):
        first_order = self.create_order()
        second_order = self.create_order(scheduled_time_window='20:00-22:00')

        self.assertNotEqual(first_order.order_code, second_order.order_code)

    def test_order_str(self):
        order = self.create_order()

        self.assertEqual(str(order), f'{order.order_code} - Ana Perez')


class OrderItemModelTest(OrderModelTestCase):
    def test_order_item_calculates_total_from_product_price(self):
        order = self.create_order()
        item = OrderItem.objects.create(
            order=order,
            product=self.product,
            quantity=2,
            unit_price=Decimal('0.00'),
            total_price=Decimal('0.00'),
        )

        self.assertEqual(item.unit_price, Decimal('28.00'))
        self.assertEqual(item.total_price, Decimal('56.00'))
        self.assertIsNotNone(item.created_at)

    def test_order_item_calculates_total_from_variant_price(self):
        variant = ProductVariant.objects.create(
            product=self.product,
            name='Pack x8',
            price='50.00',
        )
        order = self.create_order()
        item = OrderItem.objects.create(
            order=order,
            product=self.product,
            variant=variant,
            quantity=3,
            unit_price=Decimal('0.00'),
            total_price=Decimal('0.00'),
        )

        self.assertEqual(item.unit_price, Decimal('50.00'))
        self.assertEqual(item.total_price, Decimal('150.00'))

    def test_order_item_str(self):
        order = self.create_order()
        item = OrderItem.objects.create(
            order=order,
            product=self.product,
            quantity=1,
            unit_price=Decimal('28.00'),
            total_price=Decimal('28.00'),
        )

        self.assertEqual(str(item), f'{order.order_code}: Mojito Pack x4 x1')


class OrderStatusHistoryModelTest(OrderModelTestCase):
    def test_order_status_history_creation(self):
        order = self.create_order()
        history = OrderStatusHistory.objects.create(
            order=order,
            previous_status=Order.Status.PENDING,
            new_status=Order.Status.ACCEPTED,
            changed_by='operator@example.com',
            note='Accepted by operator',
        )

        self.assertEqual(history.order, order)
        self.assertEqual(history.previous_status, Order.Status.PENDING)
        self.assertEqual(history.new_status, Order.Status.ACCEPTED)
        self.assertEqual(history.changed_by, 'operator@example.com')
        self.assertEqual(history.note, 'Accepted by operator')
        self.assertIsNotNone(history.created_at)

    def test_order_status_history_str(self):
        order = self.create_order()
        history = OrderStatusHistory.objects.create(
            order=order,
            previous_status=Order.Status.PENDING,
            new_status=Order.Status.ACCEPTED,
        )

        self.assertEqual(str(history), f'{order.order_code}: PENDING -> ACCEPTED')
