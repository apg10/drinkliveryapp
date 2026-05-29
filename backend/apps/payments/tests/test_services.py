from decimal import Decimal

from django.test import Client, TestCase

from apps.delivery.models import DeliveryZone
from apps.orders.models import Address, Customer, Order
from apps.payments.models import PaymentRecord
from apps.payments.services import record_manual_payment
from apps.tenants.models import Tenant


class ManualPaymentServiceTest(TestCase):
    def setUp(self):
        self.client = Client()
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
        self.order = Order.objects.create(
            tenant=self.tenant,
            customer=self.customer,
            address=self.address,
            delivery_zone=self.delivery_zone,
            scheduled_date='2026-06-15',
            scheduled_time_window='18:00-20:00',
            subtotal=Decimal('30.00'),
            delivery_fee=Decimal('5.00'),
            total=Decimal('35.00'),
            payment_method=Order.PaymentMethod.YAPPY_MANUAL,
        )

    def test_service_creates_payment_record(self):
        payment = record_manual_payment(
            order=self.order,
            method=PaymentRecord.PaymentMethod.YAPPY_MANUAL,
            status=PaymentRecord.Status.CONFIRMED,
            amount=Decimal('35.00'),
        )

        self.assertEqual(PaymentRecord.objects.count(), 1)
        self.assertEqual(payment.order, self.order)
        self.assertEqual(payment.amount, Decimal('35.00'))

    def test_service_updates_order_payment_status(self):
        record_manual_payment(
            order=self.order,
            method=PaymentRecord.PaymentMethod.TRANSFER,
            status=PaymentRecord.Status.CONFIRMED,
            amount=Decimal('35.00'),
        )

        self.order.refresh_from_db()
        self.assertEqual(self.order.payment_status, Order.PaymentStatus.CONFIRMED)

    def test_service_stores_reference_and_notes(self):
        payment = record_manual_payment(
            order=self.order,
            method=PaymentRecord.PaymentMethod.TRANSFER,
            status=PaymentRecord.Status.CONFIRMED,
            amount=Decimal('35.00'),
            reference='BANK-123',
            notes='Confirmed manually by operator',
        )

        self.assertEqual(payment.reference, 'BANK-123')
        self.assertEqual(payment.notes, 'Confirmed manually by operator')

    def test_confirmed_payment_sets_confirmed_at_when_missing(self):
        payment = record_manual_payment(
            order=self.order,
            method=PaymentRecord.PaymentMethod.CASH,
            status=PaymentRecord.Status.CONFIRMED,
            amount=Decimal('35.00'),
        )

        payment.refresh_from_db()
        self.assertIsNotNone(payment.confirmed_at)

    def test_failed_payment_does_not_auto_set_confirmed_at(self):
        payment = record_manual_payment(
            order=self.order,
            method=PaymentRecord.PaymentMethod.CASH,
            status=PaymentRecord.Status.FAILED,
            amount=Decimal('35.00'),
        )

        payment.refresh_from_db()
        self.assertIsNone(payment.confirmed_at)

    def test_payment_records_are_not_exposed_publicly(self):
        record_manual_payment(
            order=self.order,
            method=PaymentRecord.PaymentMethod.TRANSFER,
            status=PaymentRecord.Status.CONFIRMED,
            amount=Decimal('35.00'),
            reference='PRIVATE-REF-123',
            notes='Internal payment note',
        )

        response = self.client.get(f'/api/public/{self.tenant.slug}/orders/{self.order.order_code}/status/')

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertNotIn('payment_records', data)
        self.assertNotIn('payment_reference', data)
        self.assertNotIn('reference', data)
        self.assertNotIn('notes', data)
        self.assertNotIn('PRIVATE-REF-123', str(data))
