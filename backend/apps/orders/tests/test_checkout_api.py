from decimal import Decimal

from django.test import Client, TestCase

from apps.delivery.models import DeliveryZone
from apps.orders.models import Customer, Order, OrderItem
from apps.products.models import Category, Product, ProductVariant
from apps.tenants.models import Tenant


class PublicCheckoutAPITest(TestCase):
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
        self.other_zone = DeliveryZone.objects.create(
            tenant=self.other_tenant,
            name='San Jose',
            city='San Jose',
            base_fee='4.00',
        )
        self.inactive_zone = DeliveryZone.objects.create(
            tenant=self.tenant,
            name='Inactive Zone',
            city='Panama City',
            base_fee='3.00',
            is_active=False,
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
        self.variant = ProductVariant.objects.create(
            product=self.product,
            name='Pack x8',
            price='50.00',
        )
        self.inactive_product = Product.objects.create(
            tenant=self.tenant,
            category=self.category,
            name='Inactive Pack',
            slug='inactive-pack',
            base_price='20.00',
            is_active=False,
        )
        other_category = Category.objects.create(
            tenant=self.other_tenant,
            name='Cocktail Packs',
            slug='cocktail-packs',
        )
        self.other_product = Product.objects.create(
            tenant=self.other_tenant,
            category=other_category,
            name='Other Pack',
            slug='other-pack',
            base_price='25.00',
        )

    def payload(self, **overrides):
        data = {
            'customer': {
                'full_name': 'Ana Perez',
                'phone': '+50760000000',
                'email': 'ana@example.com',
            },
            'address': {
                'address_line': 'Calle 50',
                'building_details': 'Tower A, Apt 12B',
                'city': 'Panama City',
                'delivery_notes': 'Call on arrival',
            },
            'delivery_zone_id': self.zone.id,
            'scheduled_date': '2026-06-15',
            'scheduled_time_window': '18:00-20:00',
            'payment_method': Order.PaymentMethod.YAPPY_MANUAL,
            'customer_notes': 'Birthday plan',
            'terms_accepted': True,
            'age_confirmed_by_customer': True,
            'items': [
                {
                    'product_id': self.product.id,
                    'quantity': 2,
                }
            ],
        }
        data.update(overrides)
        return data

    def post_checkout(self, payload):
        return self.client.post(
            f'/api/public/{self.tenant.slug}/orders/',
            data=payload,
            content_type='application/json',
        )

    def test_successful_checkout_creates_order(self):
        response = self.post_checkout(self.payload())

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Order.objects.count(), 1)
        self.assertEqual(Customer.objects.count(), 1)
        self.assertEqual(OrderItem.objects.count(), 1)
        order = Order.objects.get()
        self.assertEqual(order.status, Order.Status.PENDING)
        self.assertEqual(order.customer.full_name, 'Ana Perez')

    def test_subtotal_delivery_fee_and_total_are_calculated(self):
        response = self.post_checkout(self.payload())

        self.assertEqual(response.status_code, 201)
        order = Order.objects.get()
        self.assertEqual(order.subtotal, Decimal('56.00'))
        self.assertEqual(order.delivery_fee, Decimal('5.00'))
        self.assertEqual(order.total, Decimal('61.00'))

    def test_variant_price_is_used_when_variant_is_supplied(self):
        payload = self.payload(items=[{'product_id': self.product.id, 'variant_id': self.variant.id, 'quantity': 1}])

        response = self.post_checkout(payload)

        self.assertEqual(response.status_code, 201)
        order = Order.objects.get()
        self.assertEqual(order.subtotal, Decimal('50.00'))
        self.assertEqual(order.total, Decimal('55.00'))

    def test_empty_cart_is_rejected(self):
        response = self.post_checkout(self.payload(items=[]))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(Order.objects.count(), 0)

    def test_inactive_product_is_rejected(self):
        response = self.post_checkout(self.payload(items=[{'product_id': self.inactive_product.id, 'quantity': 1}]))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(Order.objects.count(), 0)

    def test_product_from_another_tenant_is_rejected(self):
        response = self.post_checkout(self.payload(items=[{'product_id': self.other_product.id, 'quantity': 1}]))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(Order.objects.count(), 0)

    def test_invalid_variant_is_rejected(self):
        other_product = Product.objects.create(
            tenant=self.tenant,
            category=self.category,
            name='Margarita Pack',
            slug='margarita-pack',
            base_price='30.00',
        )
        response = self.post_checkout(self.payload(items=[{'product_id': other_product.id, 'variant_id': self.variant.id, 'quantity': 1}]))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(Order.objects.count(), 0)

    def test_delivery_zone_from_another_tenant_is_rejected(self):
        response = self.post_checkout(self.payload(delivery_zone_id=self.other_zone.id))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(Order.objects.count(), 0)

    def test_inactive_delivery_zone_is_rejected(self):
        response = self.post_checkout(self.payload(delivery_zone_id=self.inactive_zone.id))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(Order.objects.count(), 0)

    def test_unknown_tenant_returns_404(self):
        response = self.client.post(
            '/api/public/unknown-tenant/orders/',
            data=self.payload(),
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 404)
        self.assertEqual(Order.objects.count(), 0)

    def test_terms_accepted_is_required_for_all_orders(self):
        response = self.post_checkout(self.payload(terms_accepted=False))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(Order.objects.count(), 0)

    def test_terms_accepted_true_allows_checkout(self):
        response = self.post_checkout(self.payload(terms_accepted=True))

        self.assertEqual(response.status_code, 201)
        order = Order.objects.get()
        self.assertTrue(order.terms_accepted)

    def test_alcoholic_order_without_age_confirmation_is_rejected(self):
        payload = self.payload(terms_accepted=True, age_confirmed_by_customer=False)
        response = self.post_checkout(payload)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(Order.objects.count(), 0)

    def test_alcoholic_order_with_age_confirmation_succeeds(self):
        payload = self.payload(terms_accepted=True, age_confirmed_by_customer=True)
        response = self.post_checkout(payload)

        self.assertEqual(response.status_code, 201)
        order = Order.objects.get()
        self.assertTrue(order.age_confirmed_by_customer)

    def test_mocktail_only_order_does_not_require_age_confirmation(self):
        mocktail_category = Category.objects.create(
            tenant=self.tenant,
            name='Mocktail Packs',
            slug='mocktail-packs',
        )
        mocktail_product = Product.objects.create(
            tenant=self.tenant,
            category=mocktail_category,
            name='Virgin Mojito Pack',
            slug='virgin-mojito-pack',
            base_price='22.00',
            is_alcoholic=False,
        )
        payload = {
            'customer': {
                'full_name': 'Ana Perez',
                'phone': '+50760000000',
                'email': 'ana@example.com',
            },
            'address': {
                'address_line': 'Calle 50',
                'building_details': 'Tower A, Apt 12B',
                'city': 'Panama City',
                'delivery_notes': 'Call on arrival',
            },
            'delivery_zone_id': self.zone.id,
            'scheduled_date': '2026-06-15',
            'scheduled_time_window': '18:00-20:00',
            'payment_method': Order.PaymentMethod.YAPPY_MANUAL,
            'customer_notes': 'Birthday plan',
            'terms_accepted': True,
            'items': [{'product_id': mocktail_product.id, 'quantity': 1}],
        }
        response = self.post_checkout(payload)

        self.assertEqual(response.status_code, 201)
        order = Order.objects.get()
        self.assertFalse(order.age_confirmed_by_customer)

    def test_mixed_cart_alcoholic_and_mocktail_requires_age_confirmation(self):
        mocktail_category = Category.objects.create(
            tenant=self.tenant,
            name='Mocktail Packs',
            slug='mocktail-packs',
        )
        mocktail_product = Product.objects.create(
            tenant=self.tenant,
            category=mocktail_category,
            name='Virgin Mojito Pack',
            slug='virgin-mojito-pack',
            base_price='22.00',
            is_alcoholic=False,
        )
        payload = {
            'customer': {
                'full_name': 'Ana Perez',
                'phone': '+50760000000',
                'email': 'ana@example.com',
            },
            'address': {
                'address_line': 'Calle 50',
                'building_details': 'Tower A, Apt 12B',
                'city': 'Panama City',
                'delivery_notes': 'Call on arrival',
            },
            'delivery_zone_id': self.zone.id,
            'scheduled_date': '2026-06-15',
            'scheduled_time_window': '18:00-20:00',
            'payment_method': Order.PaymentMethod.YAPPY_MANUAL,
            'customer_notes': 'Birthday plan',
            'terms_accepted': True,
            'items': [
                {'product_id': self.product.id, 'quantity': 1},
                {'product_id': mocktail_product.id, 'quantity': 1},
            ],
        }
        response = self.post_checkout(payload)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(Order.objects.count(), 0)

    def test_mixed_cart_with_age_confirmation_succeeds(self):
        mocktail_category = Category.objects.create(
            tenant=self.tenant,
            name='Mocktail Packs',
            slug='mocktail-packs-2',
        )
        mocktail_product = Product.objects.create(
            tenant=self.tenant,
            category=mocktail_category,
            name='Virgin Daiiri',
            slug='virgin-daiquiri',
            base_price='20.00',
            is_alcoholic=False,
        )
        payload = self.payload(
            terms_accepted=True,
            age_confirmed_by_customer=True,
            items=[
                {'product_id': self.product.id, 'quantity': 1},
                {'product_id': mocktail_product.id, 'quantity': 1},
            ],
        )
        response = self.post_checkout(payload)

        self.assertEqual(response.status_code, 201)
        order = Order.objects.get()
        self.assertTrue(order.age_confirmed_by_customer)
