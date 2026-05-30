from django.contrib.auth.models import User
from decimal import Decimal
from django.test import TestCase
from rest_framework.test import APIClient

from apps.delivery.models import DeliveryZone
from apps.orders.models import Address, Customer, Order, OrderItem, OrderStatusHistory
from apps.products.models import Category, Product, ProductVariant
from apps.tenants.models import Tenant


class AdminOrderListAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tenant = Tenant.objects.create(
            name='Drinklivery Panama',
            slug='drinklivery-panama',
            country='PA',
            city='Panama City',
            currency='PAB',
        )
        self.zone = DeliveryZone.objects.create(
            tenant=self.tenant,
            name='Casco Viejo',
            city='Panama City',
            base_fee='5.00',
            minimum_order_amount='20.00',
        )
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@drinklivery.local',
            password='adminpass',
        )
        self.normal_user = User.objects.create_user(
            username='driver1',
            email='driver1@drinklivery.local',
            password='driverpass',
        )

    def _create_order(self, **overrides):
        category, _ = Category.objects.get_or_create(
            tenant=self.tenant,
            slug='cocktail-packs',
            defaults={'name': 'Cocktail Packs'},
        )
        product, _ = Product.objects.get_or_create(
            tenant=self.tenant,
            category=category,
            slug='mojito-pack-x4',
            defaults={
                'name': 'Mojito Pack x4',
                'base_price': '28.00',
                'is_alcoholic': True,
            },
        )
        customer, _ = Customer.objects.get_or_create(
            email='ana@example.com',
            defaults={
                'full_name': 'Ana Perez',
                'phone': '+50760000000',
            },
        )
        address, _ = Address.objects.get_or_create(
            customer=customer,
            address_line='Calle 50',
            building_details='Tower A, Apt 12B',
            city='Panama City',
        )
        order = Order.objects.create(
            tenant=self.tenant,
            customer=customer,
            address=address,
            delivery_zone=self.zone,
            **overrides
        )
        OrderItem.objects.create(
            order=order,
            product=product,
            quantity=2,
            unit_price='28.00',
        )
        return order

    def test_unauthenticated_access_rejected(self):
        self._create_order()
        response = self.client.get('/api/admin/orders/')

        self.assertEqual(response.status_code, 403)

    def test_non_admin_access_rejected(self):
        self._create_order()
        self.client.force_authenticate(user=self.normal_user)
        response = self.client.get('/api/admin/orders/')

        self.assertEqual(response.status_code, 403)

    def test_admin_user_can_list_orders(self):
        order1 = self._create_order(
            status=Order.Status.PENDING,
            payment_status=Order.PaymentStatus.PENDING,
            payment_method=Order.PaymentMethod.CASH,
            subtotal='56.00',
            delivery_fee='5.00',
            total='61.00',
        )
        order2 = self._create_order(
            status=Order.Status.ACCEPTED,
            payment_status=Order.PaymentStatus.CONFIRMED,
            payment_method=Order.PaymentMethod.TRANSFER,
            scheduled_date='2026-07-01',
            scheduled_time_window='10:00-12:00',
            subtotal='35.00',
            delivery_fee='5.00',
            total='40.00',
        )
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/admin/orders/')

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['count'], 2)
        self.assertEqual(len(data['orders']), 2)
        self.assertEqual(data['orders'][0]['status'], order2.status)
        self.assertEqual(data['orders'][1]['status'], order1.status)
        self.assertEqual(len(data['orders'][0]['items']), 1)
        self.assertEqual(data['orders'][0]['items'][0]['product_name'], 'Mojito Pack x4')

    def test_list_response_contains_required_fields(self):
        order = self._create_order(
            status=Order.Status.IN_PREPARATION,
            payment_status=Order.PaymentStatus.CONFIRMED,
            payment_method=Order.PaymentMethod.YAPPY_MANUAL,
            subtotal='56.00',
            delivery_fee='5.00',
            total='61.00',
            scheduled_date='2026-08-15',
            scheduled_time_window='18:00-20:00',
        )
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/admin/orders/')

        self.assertEqual(response.status_code, 200)
        data = response.json()
        order_data = data['orders'][0]
        self.assertEqual(order_data['id'], order.id)
        self.assertEqual(order_data['order_code'], order.order_code)
        self.assertEqual(order_data['status'], order.status)
        self.assertEqual(order_data['payment_status'], order.payment_status)
        self.assertEqual(order_data['payment_method'], order.payment_method)
        self.assertEqual(order_data['subtotal'], '56.00')
        self.assertEqual(order_data['delivery_fee'], '5.00')
        self.assertEqual(order_data['total'], '61.00')
        self.assertEqual(order_data['scheduled_date'], '2026-08-15')
        self.assertEqual(order_data['scheduled_time_window'], '18:00-20:00')
        self.assertIn('created_at', order_data)
        customer = order_data['customer']
        self.assertEqual(customer['id'], order.customer.id)
        self.assertEqual(customer['full_name'], order.customer.full_name)
        self.assertEqual(customer['phone'], order.customer.phone)
        self.assertEqual(customer['email'], order.customer.email)
        address = order_data['address']
        self.assertEqual(address['id'], order.address.id)
        self.assertEqual(address['address_line'], order.address.address_line)
        self.assertEqual(address['city'], order.address.city)


class AdminOrderDetailAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tenant = Tenant.objects.create(
            name='Drinklivery Panama',
            slug='drinklivery-panama',
            country='PA',
            city='Panama City',
            currency='PAB',
        )
        self.zone = DeliveryZone.objects.create(
            tenant=self.tenant,
            name='Casco Viejo',
            city='Panama City',
            base_fee='5.00',
            minimum_order_amount='20.00',
        )
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@drinklivery.local',
            password='adminpass',
        )
        self.normal_user = User.objects.create_user(
            username='driver1',
            email='driver1@drinklivery.local',
            password='driverpass',
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
            name='Mojito Pack x6',
            price='38.00',
        )

    def _create_order_with_items(self, **overrides):
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
            delivery_zone=self.zone,
            subtotal='56.00',
            delivery_fee='5.00',
            total='61.00',
            **overrides
        )
        OrderItem.objects.create(
            order=order,
            product=self.product,
            variant=None,
            quantity=2,
            unit_price='28.00',
        )
        second_item = OrderItem.objects.create(
            order=order,
            product=self.product,
            variant=self.variant,
            quantity=1,
            unit_price='38.00',
        )
        return order

    def test_unauthenticated_access_rejected(self):
        order = self._create_order_with_items()
        response = self.client.get(f'/api/admin/orders/{order.id}/')

        self.assertEqual(response.status_code, 403)

    def test_non_admin_access_rejected(self):
        order = self._create_order_with_items()
        self.client.force_authenticate(user=self.normal_user)
        response = self.client.get(f'/api/admin/orders/{order.id}/')

        self.assertEqual(response.status_code, 403)

    def test_admin_user_can_retrieve_order_detail(self):
        order = self._create_order_with_items()
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(f'/api/admin/orders/{order.id}/')

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['id'], order.id)
        self.assertEqual(data['order_code'], order.order_code)
        self.assertEqual(data['status'], order.status)
        self.assertEqual(data['payment_status'], str(order.payment_status))
        self.assertEqual(data['payment_method'], order.payment_method)
        self.assertEqual(data['subtotal'], '56.00')
        self.assertEqual(data['delivery_fee'], '5.00')
        self.assertEqual(data['total'], '61.00')
        self.assertEqual(data['customer']['id'], order.customer.id)
        self.assertEqual(data['customer']['full_name'], order.customer.full_name)
        self.assertEqual(data['address']['id'], order.address.id)
        self.assertEqual(data['address']['address_line'], order.address.address_line)
        self.assertIn('items', data)
        self.assertIn('created_at', data)

    def test_detail_includes_items(self):
        order = self._create_order_with_items()
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(f'/api/admin/orders/{order.id}/')

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data['items']), 2)
        item = data['items'][0]
        self.assertEqual(item['product_id'], self.product.id)
        self.assertEqual(item['quantity'], 2)
        self.assertEqual(item['unit_price'], '28.00')
        self.assertEqual(item['variant_id'], None)
        second_item = data['items'][1]
        self.assertEqual(second_item['product_id'], self.product.id)
        self.assertEqual(second_item['variant_id'], self.variant.id)
        self.assertEqual(second_item['unit_price'], '38.00')

    def test_unknown_order_returns_404(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/admin/orders/99999/')

        self.assertEqual(response.status_code, 404)

    def test_detail_includes_scheduled_fields(self):
        order = self._create_order_with_items(
            scheduled_date='2026-09-20',
            scheduled_time_window='14:00-16:00',
        )
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(f'/api/admin/orders/{order.id}/')

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['scheduled_date'], '2026-09-20')
        self.assertEqual(data['scheduled_time_window'], '14:00-16:00')

    def test_detail_without_scheduled_fields(self):
        order = self._create_order_with_items(
            scheduled_date=None,
            scheduled_time_window='',
        )
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(f'/api/admin/orders/{order.id}/')

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['scheduled_date'], None)
        self.assertEqual(data['scheduled_time_window'], '')


class AdminOrderStatusUpdateAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tenant = Tenant.objects.create(
            name='Drinklivery Panama',
            slug='drinklivery-panama',
            country='PA',
            city='Panama City',
            currency='PAB',
        )
        self.zone = DeliveryZone.objects.create(
            tenant=self.tenant,
            name='Casco Viejo',
            city='Panama City',
            base_fee='5.00',
            minimum_order_amount='20.00',
        )
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@drinklivery.local',
            password='adminpass',
        )
        self.normal_user = User.objects.create_user(
            username='driver1',
            email='driver1@drinklivery.local',
            password='driverpass',
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
        )

    def _create_order(self, **overrides):
        return Order.objects.create(
            tenant=self.tenant,
            customer=self.customer,
            address=self.address,
            delivery_zone=self.zone,
            status=Order.Status.PENDING,
            **overrides
        )

    def test_unauthenticated_status_update_rejected(self):
        order = self._create_order()

        response = self.client.patch(
            f'/api/admin/orders/{order.id}/status/',
            data={'status': Order.Status.ACCEPTED},
            format='json',
        )

        self.assertEqual(response.status_code, 403)

    def test_non_admin_status_update_rejected(self):
        order = self._create_order()
        self.client.force_authenticate(user=self.normal_user)

        response = self.client.patch(
            f'/api/admin/orders/{order.id}/status/',
            data={'status': Order.Status.ACCEPTED},
            format='json',
        )

        self.assertEqual(response.status_code, 403)

    def test_admin_can_update_status(self):
        order = self._create_order()
        self.client.force_authenticate(user=self.admin_user)

        response = self.client.patch(
            f'/api/admin/orders/{order.id}/status/',
            data={'status': Order.Status.ACCEPTED},
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['id'], order.id)
        self.assertEqual(data['order_code'], order.order_code)
        self.assertEqual(data['status'], Order.Status.ACCEPTED)
        order.refresh_from_db()
        self.assertEqual(order.status, Order.Status.ACCEPTED)

    def test_status_update_creates_history(self):
        order = self._create_order()
        self.client.force_authenticate(user=self.admin_user)

        response = self.client.patch(
            f'/api/admin/orders/{order.id}/status/',
            data={'status': Order.Status.IN_PREPARATION, 'note': 'Started mixing'},
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        history = OrderStatusHistory.objects.get(order=order)
        self.assertEqual(history.previous_status, Order.Status.PENDING)
        self.assertEqual(history.new_status, Order.Status.IN_PREPARATION)
        self.assertEqual(history.changed_by, 'admin')
        self.assertEqual(history.note, 'Started mixing')

    def test_invalid_status_returns_400(self):
        order = self._create_order()
        self.client.force_authenticate(user=self.admin_user)

        response = self.client.patch(
            f'/api/admin/orders/{order.id}/status/',
            data={'status': 'NOT_A_STATUS'},
            format='json',
        )

        self.assertEqual(response.status_code, 400)

    def test_invalid_amount_returns_400(self):
        order = self._create_order()
        self.client.force_authenticate(user=self.admin_user)

        response = self.client.patch(
            f'/api/admin/orders/{order.id}/payment/',
            data={
                'method': Order.PaymentMethod.CASH,
                'status': Order.PaymentStatus.CONFIRMED,
                'amount': 'not-a-decimal',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 400)

    def test_non_finite_amount_returns_400(self):
        order = self._create_order()
        self.client.force_authenticate(user=self.admin_user)

        response = self.client.patch(
            f'/api/admin/orders/{order.id}/payment/',
            data={
                'method': Order.PaymentMethod.CASH,
                'status': Order.PaymentStatus.CONFIRMED,
                'amount': 'NaN',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 400)

    def test_unknown_order_status_update_returns_404(self):
        self.client.force_authenticate(user=self.admin_user)

        response = self.client.patch(
            '/api/admin/orders/99999/status/',
            data={'status': Order.Status.ACCEPTED},
            format='json',
        )

        self.assertEqual(response.status_code, 404)


class AdminOrderPaymentUpdateAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tenant = Tenant.objects.create(
            name='Drinklivery Panama',
            slug='drinklivery-panama',
            country='PA',
            city='Panama City',
            currency='PAB',
        )
        self.zone = DeliveryZone.objects.create(
            tenant=self.tenant,
            name='Casco Viejo',
            city='Panama City',
            base_fee='5.00',
            minimum_order_amount='20.00',
        )
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@drinklivery.local',
            password='adminpass',
        )
        self.normal_user = User.objects.create_user(
            username='driver1',
            email='driver1@drinklivery.local',
            password='driverpass',
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
        )

    def _create_order(self, **overrides):
        return Order.objects.create(
            tenant=self.tenant,
            customer=self.customer,
            address=self.address,
            delivery_zone=self.zone,
            status=Order.Status.PENDING,
            payment_status=Order.PaymentStatus.PENDING,
            **overrides
        )

    def test_unauthenticated_payment_update_rejected(self):
        order = self._create_order()

        response = self.client.patch(
            f'/api/admin/orders/{order.id}/payment/',
            data={
                'method': Order.PaymentMethod.CASH,
                'status': Order.PaymentStatus.CONFIRMED,
                'amount': '61.00',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 403)

    def test_non_admin_payment_update_rejected(self):
        order = self._create_order()
        self.client.force_authenticate(user=self.normal_user)

        response = self.client.patch(
            f'/api/admin/orders/{order.id}/payment/',
            data={
                'method': Order.PaymentMethod.CASH,
                'status': Order.PaymentStatus.CONFIRMED,
                'amount': '61.00',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 403)

    def test_admin_creates_payment_record(self):
        order = self._create_order()
        self.client.force_authenticate(user=self.admin_user)

        response = self.client.patch(
            f'/api/admin/orders/{order.id}/payment/',
            data={
                'method': Order.PaymentMethod.CASH,
                'status': Order.PaymentStatus.CONFIRMED,
                'amount': '61.00',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['id'], order.id)
        self.assertEqual(data['order_code'], order.order_code)
        self.assertEqual(data['payment_status'], Order.PaymentStatus.CONFIRMED)
        self.assertIn('payment_record_id', data)

        from apps.payments.models import PaymentRecord
        record = PaymentRecord.objects.get(pk=data['payment_record_id'])
        self.assertEqual(record.method, Order.PaymentMethod.CASH)
        self.assertEqual(record.status, Order.PaymentStatus.CONFIRMED)
        self.assertEqual(record.amount, Decimal('61.00'))
        self.assertEqual(record.order, order)

    def test_order_payment_status_updates(self):
        order = self._create_order()
        self.client.force_authenticate(user=self.admin_user)

        self.assertEqual(order.payment_status, Order.PaymentStatus.PENDING)

        response = self.client.patch(
            f'/api/admin/orders/{order.id}/payment/',
            data={
                'method': Order.PaymentMethod.TRANSFER,
                'status': Order.PaymentStatus.CONFIRMED,
                'amount': '61.00',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        order.refresh_from_db()
        self.assertEqual(order.payment_status, Order.PaymentStatus.CONFIRMED)

    def test_reference_and_notes_stored(self):
        order = self._create_order()
        self.client.force_authenticate(user=self.admin_user)

        response = self.client.patch(
            f'/api/admin/orders/{order.id}/payment/',
            data={
                'method': Order.PaymentMethod.YAPPY_MANUAL,
                'status': Order.PaymentStatus.CONFIRMED,
                'amount': '120.50',
                'reference': 'REF-12345',
                'notes': 'Customer paid via Yappy',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        from apps.payments.models import PaymentRecord
        record = PaymentRecord.objects.get(order=order)
        self.assertEqual(record.reference, 'REF-12345')
        self.assertEqual(record.notes, 'Customer paid via Yappy')

    def test_invalid_method_returns_400(self):
        order = self._create_order()
        self.client.force_authenticate(user=self.admin_user)

        response = self.client.patch(
            f'/api/admin/orders/{order.id}/payment/',
            data={
                'method': 'INVALID_METHOD',
                'status': Order.PaymentStatus.CONFIRMED,
                'amount': '61.00',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 400)

    def test_invalid_status_returns_400(self):
        order = self._create_order()
        self.client.force_authenticate(user=self.admin_user)

        response = self.client.patch(
            f'/api/admin/orders/{order.id}/payment/',
            data={
                'method': Order.PaymentMethod.CASH,
                'status': 'INVALID_STATUS',
                'amount': '61.00',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 400)

    def test_unknown_order_returns_404(self):
        self.client.force_authenticate(user=self.admin_user)

        response = self.client.patch(
            '/api/admin/orders/99999/payment/',
            data={
                'method': Order.PaymentMethod.CASH,
                'status': Order.PaymentStatus.CONFIRMED,
                'amount': '61.00',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 404)


class DeliveryVerificationAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tenant = Tenant.objects.create(
            name='Drinklivery Panama',
            slug='drinklivery-panama',
            country='PA',
            city='Panama City',
            currency='PAB',
        )
        self.zone = DeliveryZone.objects.create(
            tenant=self.tenant,
            name='Casco Viejo',
            city='Panama City',
            base_fee='5.00',
            minimum_order_amount='20.00',
        )
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@drinklivery.local',
            password='adminpass',
        )
        self.normal_user = User.objects.create_user(
            username='driver1',
            email='driver1@drinklivery.local',
            password='driverpass',
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
        )

    def _create_order(self, **overrides):
        return Order.objects.create(
            tenant=self.tenant,
            customer=self.customer,
            address=self.address,
            delivery_zone=self.zone,
            status=Order.Status.OUT_FOR_DELIVERY,
            **overrides
        )

    def test_unauthenticated_access_rejected(self):
        order = self._create_order()

        response = self.client.post(
            f'/api/admin/orders/{order.id}/delivery-verification/',
            data={
                'receiver_name': 'Ana Perez',
                'receiver_document_checked': True,
                'receiver_is_adult': True,
            },
            format='json',
        )

        self.assertEqual(response.status_code, 403)

    def test_non_admin_access_rejected(self):
        order = self._create_order()
        self.client.force_authenticate(user=self.normal_user)

        response = self.client.post(
            f'/api/admin/orders/{order.id}/delivery-verification/',
            data={
                'receiver_name': 'Ana Perez',
                'receiver_document_checked': True,
                'receiver_is_adult': True,
            },
            format='json',
        )

        self.assertEqual(response.status_code, 403)

    def test_successful_verification_marks_delivered(self):
        order = self._create_order()
        self.client.force_authenticate(user=self.admin_user)

        response = self.client.post(
            f'/api/admin/orders/{order.id}/delivery-verification/',
            data={
                'receiver_name': 'Ana Perez',
                'receiver_document_checked': True,
                'receiver_is_adult': True,
                'verification_notes': 'ID checked, all good',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['order_id'], order.id)
        self.assertEqual(data['order_code'], order.order_code)
        self.assertEqual(data['status'], Order.Status.DELIVERED)
        self.assertIn('delivery_verification_id', data)

        order.refresh_from_db()
        self.assertEqual(order.status, Order.Status.DELIVERED)

        from apps.compliance.models import DeliveryVerification
        verification = DeliveryVerification.objects.get(order=order)
        self.assertEqual(verification.receiver_name, 'Ana Perez')
        self.assertTrue(verification.receiver_document_checked)
        self.assertTrue(verification.receiver_is_adult)
        self.assertEqual(verification.verified_by, 'admin')
        self.assertEqual(verification.verification_notes, 'ID checked, all good')
        self.assertIsNotNone(verification.delivered_at)

    def test_failed_verification_marks_failed_age_verification(self):
        order = self._create_order()
        self.client.force_authenticate(user=self.admin_user)

        response = self.client.post(
            f'/api/admin/orders/{order.id}/delivery-verification/',
            data={
                'receiver_name': 'Juan Garcia',
                'receiver_document_checked': True,
                'receiver_is_adult': False,
                'verification_notes': 'Underage, rejected',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['order_id'], order.id)
        self.assertEqual(data['status'], Order.Status.FAILED_AGE_VERIFICATION)
        self.assertIn('delivery_verification_id', data)

        order.refresh_from_db()
        self.assertEqual(order.status, Order.Status.FAILED_AGE_VERIFICATION)

    def test_failed_verification_creates_compliance_event(self):
        from apps.compliance.models import ComplianceEvent

        order = self._create_order()
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post(
            f'/api/admin/orders/{order.id}/delivery-verification/',
            data={
                'receiver_name': 'Juan Garcia',
                'receiver_document_checked': True,
                'receiver_is_adult': False,
            },
            format='json',
        )
        self.assertEqual(response.status_code, 200)

        event = ComplianceEvent.objects.filter(order=order).first()
        self.assertIsNotNone(event)
        self.assertEqual(event.event_type, ComplianceEvent.EventType.FAILED_AGE_VERIFICATION)

    def test_document_number_field_rejected(self):
        order = self._create_order()
        self.client.force_authenticate(user=self.admin_user)

        response = self.client.post(
            f'/api/admin/orders/{order.id}/delivery-verification/',
            data={
                'receiver_name': 'Ana Perez',
                'receiver_document_checked': True,
                'receiver_is_adult': True,
                'document_number': '1234567890',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn('document_number', response.json()['error'])

    def test_document_image_field_rejected(self):
        order = self._create_order()
        self.client.force_authenticate(user=self.admin_user)

        response = self.client.post(
            f'/api/admin/orders/{order.id}/delivery-verification/',
            data={
                'receiver_name': 'Ana Perez',
                'receiver_document_checked': True,
                'receiver_is_adult': True,
                'document_image': 'base64data',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn('document_image', response.json()['error'])

    def test_receiver_name_required(self):
        order = self._create_order()
        self.client.force_authenticate(user=self.admin_user)

        response = self.client.post(
            f'/api/admin/orders/{order.id}/delivery-verification/',
            data={
                'receiver_document_checked': True,
                'receiver_is_adult': True,
            },
            format='json',
        )

        self.assertEqual(response.status_code, 400)

    def test_verification_booleans_must_be_booleans(self):
        order = self._create_order()
        self.client.force_authenticate(user=self.admin_user)

        response = self.client.post(
            f'/api/admin/orders/{order.id}/delivery-verification/',
            data={
                'receiver_name': 'Ana Perez',
                'receiver_document_checked': 'false',
                'receiver_is_adult': 'false',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 400)

    def test_unknown_order_returns_404(self):
        self.client.force_authenticate(user=self.admin_user)

        response = self.client.post(
            '/api/admin/orders/99999/delivery-verification/',
            data={
                'receiver_name': 'Ana Perez',
                'receiver_document_checked': True,
                'receiver_is_adult': True,
            },
            format='json',
        )

        self.assertEqual(response.status_code, 404)


class AdminDashboardSummaryAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tenant = Tenant.objects.create(
            name='Drinklivery Panama',
            slug='drinklivery-panama',
            country='PA',
            city='Panama City',
            currency='PAB',
        )
        self.zone = DeliveryZone.objects.create(
            tenant=self.tenant,
            name='Casco Viejo',
            city='Panama City',
            base_fee='5.00',
            minimum_order_amount='20.00',
        )
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@drinklivery.local',
            password='adminpass',
        )
        self.normal_user = User.objects.create_user(
            username='driver1',
            email='driver1@drinklivery.local',
            password='driverpass',
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
        return Order.objects.create(
            tenant=self.tenant,
            customer=customer,
            address=address,
            delivery_zone=self.zone,
            **overrides
        )

    def test_unauthenticated_access_rejected(self):
        self._create_order(
            status=Order.Status.PENDING,
            payment_status=Order.PaymentStatus.PENDING,
            total='61.00',
        )
        response = self.client.get('/api/admin/dashboard/summary/')

        self.assertEqual(response.status_code, 403)

    def test_non_admin_access_rejected(self):
        self._create_order(
            status=Order.Status.PENDING,
            payment_status=Order.PaymentStatus.PENDING,
            total='61.00',
        )
        self.client.force_authenticate(user=self.normal_user)
        response = self.client.get('/api/admin/dashboard/summary/')

        self.assertEqual(response.status_code, 403)

    def test_admin_can_retrieve_summary(self):
        self._create_order(
            status=Order.Status.PENDING,
            payment_status=Order.PaymentStatus.PENDING,
            total='61.00',
        )
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/admin/dashboard/summary/')

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('total_orders', data)
        self.assertIn('pending_orders', data)
        self.assertIn('orders_by_status', data)
        self.assertIn('confirmed_revenue', data)

    def test_total_orders_correct(self):
        self._create_order(
            status=Order.Status.PENDING,
            payment_status=Order.PaymentStatus.PENDING,
            total='61.00',
        )
        self._create_order(
            status=Order.Status.ACCEPTED,
            payment_status=Order.PaymentStatus.CONFIRMED,
            total='40.00',
        )
        self._create_order(
            status=Order.Status.DELIVERED,
            payment_status=Order.PaymentStatus.CONFIRMED,
            total='80.00',
        )
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/admin/dashboard/summary/')

        self.assertEqual(response.json()['total_orders'], 3)

    def test_pending_orders_correct(self):
        self._create_order(
            status=Order.Status.PENDING,
            payment_status=Order.PaymentStatus.PENDING,
            total='61.00',
        )
        self._create_order(
            status=Order.Status.PENDING,
            payment_status=Order.PaymentStatus.PENDING,
            total='35.00',
        )
        self._create_order(
            status=Order.Status.ACCEPTED,
            payment_status=Order.PaymentStatus.CONFIRMED,
            total='50.00',
        )
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/admin/dashboard/summary/')

        self.assertEqual(response.json()['pending_orders'], 2)

    def test_orders_by_status_correct(self):
        self._create_order(
            status=Order.Status.PENDING,
            payment_status=Order.PaymentStatus.PENDING,
            total='61.00',
        )
        self._create_order(
            status=Order.Status.ACCEPTED,
            payment_status=Order.PaymentStatus.CONFIRMED,
            total='40.00',
        )
        self._create_order(
            status=Order.Status.ACCEPTED,
            payment_status=Order.PaymentStatus.PENDING,
            total='55.00',
        )
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/admin/dashboard/summary/')

        data = response.json()
        self.assertEqual(data['orders_by_status']['PENDING'], 1)
        self.assertEqual(data['orders_by_status']['ACCEPTED'], 2)

    def test_confirmed_revenue_correct(self):
        self._create_order(
            status=Order.Status.ACCEPTED,
            payment_status=Order.PaymentStatus.CONFIRMED,
            total='61.00',
        )
        self._create_order(
            status=Order.Status.PENDING,
            payment_status=Order.PaymentStatus.CONFIRMED,
            total='40.00',
        )
        self._create_order(
            status=Order.Status.ACCEPTED,
            payment_status=Order.PaymentStatus.PENDING,
            total='55.00',
        )
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/admin/dashboard/summary/')

        data = response.json()
        self.assertEqual(Decimal(data['confirmed_revenue']), Decimal('101.00'))

    def test_confirmed_revenue_zero_when_none_confirmed(self):
        self._create_order(
            status=Order.Status.PENDING,
            payment_status=Order.PaymentStatus.PENDING,
            total='61.00',
        )
        self._create_order(
            status=Order.Status.ACCEPTED,
            payment_status=Order.PaymentStatus.PENDING,
            total='40.00',
        )
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/admin/dashboard/summary/')

        self.assertEqual(response.json()['confirmed_revenue'], '0.00')

    def test_empty_database_returns_zero(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/admin/dashboard/summary/')

        data = response.json()
        self.assertEqual(data['total_orders'], 0)
        self.assertEqual(data['pending_orders'], 0)
        self.assertEqual(data['confirmed_revenue'], '0.00')
        self.assertIn('PENDING', data['orders_by_status'])
