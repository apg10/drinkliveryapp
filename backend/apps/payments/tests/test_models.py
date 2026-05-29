from decimal import Decimal

from django.test import TestCase
from django.utils import timezone

from apps.delivery.models import DeliveryZone
from apps.orders.models import Address, Customer, Order
from apps.payments.models import PaymentRecord
from apps.tenants.models import Tenant


class PaymentRecordModelTest(TestCase):
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
            payment_method=Order.PaymentMethod.CASH,
        )

    def test_can_create_payment_record(self):
        payment = PaymentRecord.objects.create(
            order=self.order,
            method=PaymentRecord.PaymentMethod.CASH,
            status=PaymentRecord.Status.PENDING,
            amount=Decimal('35.00'),
        )
        self.assertIsNotNone(payment.id)
        self.assertEqual(payment.order, self.order)
        self.assertEqual(payment.method, PaymentRecord.PaymentMethod.CASH)
        self.assertEqual(payment.status, PaymentRecord.Status.PENDING)
        self.assertEqual(payment.amount, Decimal('35.00'))

    def test_payment_record_related_to_order(self):
        payment = PaymentRecord.objects.create(
            order=self.order,
            method=PaymentRecord.PaymentMethod.TRANSFER,
            amount=Decimal('100.00'),
        )
        self.assertEqual(payment.order, self.order)
        self.assertEqual(self.order.payment_records.first(), payment)

    def test_optional_reference_can_be_blank(self):
        payment = PaymentRecord.objects.create(
            order=self.order,
            method=PaymentRecord.PaymentMethod.CASH,
            amount=Decimal('25.00'),
            reference='',
        )
        self.assertEqual(payment.reference, '')

    def test_optional_notes_can_be_blank(self):
        payment = PaymentRecord.objects.create(
            order=self.order,
            method=PaymentRecord.PaymentMethod.OTHER_MANUAL,
            amount=Decimal('75.00'),
            notes='',
        )
        self.assertEqual(payment.notes, '')

    def test_string_representation_is_useful(self):
        payment = PaymentRecord.objects.create(
            order=self.order,
            method=PaymentRecord.PaymentMethod.YAPPY_MANUAL,
            status=PaymentRecord.Status.CONFIRMED,
            amount=Decimal('60.00'),
            reference='REF-12345',
            notes='Confirmed by operator',
        )
        self.assertIn('Payment', str(payment))
        self.assertIn(self.order.order_code, str(payment))
        self.assertIn('Yappy Manual', str(payment))
        self.assertIn('Confirmed', str(payment))

    def test_payment_status_choices(self):
        for status in PaymentRecord.Status:
            payment = PaymentRecord.objects.create(
                order=self.order,
                method=PaymentRecord.PaymentMethod.CASH,
                status=status,
                amount=Decimal('10.00'),
            )
            self.assertEqual(payment.status, status)

    def test_payment_method_choices(self):
        for method in PaymentRecord.PaymentMethod:
            payment = PaymentRecord.objects.create(
                order=self.order,
                method=method,
                amount=Decimal('10.00'),
            )
            self.assertEqual(payment.method, method)

    def test_confirmed_at_can_be_set(self):
        confirmed_time = timezone.now()
        payment = PaymentRecord.objects.create(
            order=self.order,
            method=PaymentRecord.PaymentMethod.TRANSFER,
            status=PaymentRecord.Status.CONFIRMED,
            amount=Decimal('200.00'),
            confirmed_at=confirmed_time,
        )
        payment.refresh_from_db()
        self.assertIsNotNone(payment.confirmed_at)

    def test_timestamps_are_set(self):
        payment = PaymentRecord.objects.create(
            order=self.order,
            method=PaymentRecord.PaymentMethod.CASH,
            amount=Decimal('35.00'),
        )
        self.assertIsNotNone(payment.created_at)
        self.assertIsNotNone(payment.updated_at)

    def test_default_status_is_pending(self):
        payment = PaymentRecord.objects.create(
            order=self.order,
            method=PaymentRecord.PaymentMethod.CASH,
            amount=Decimal('35.00'),
        )
        self.assertEqual(payment.status, PaymentRecord.Status.PENDING)
