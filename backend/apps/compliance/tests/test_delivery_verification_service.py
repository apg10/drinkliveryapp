from django.test import TestCase
from django.utils import timezone

from apps.compliance.models import ComplianceEvent, DeliveryVerification
from apps.compliance.services import record_delivery_verification
from apps.delivery.models import DeliveryZone
from apps.orders.models import Address, Customer, Order
from apps.tenants.models import Tenant


class record_delivery_verification_test(TestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(name='Test Tenant', slug='test-slug', country='PA', city='Panama', currency='PAB')
        self.customer = Customer.objects.create(full_name='John Doe', phone='5076000000')
        self.address = Address.objects.create(customer=self.customer, address_line='123 Main St', city='Panama')
        self.zone = DeliveryZone.objects.create(tenant=self.tenant, name='Zone A', city='Panama', base_fee='10.00')
        self.order = Order.objects.create(
            tenant=self.tenant,
            customer=self.customer,
            address=self.address,
            delivery_zone=self.zone,
            status=Order.Status.OUT_FOR_DELIVERY,
        )

    def test_adult_verified_delivery_marks_order_delivered(self):
        result = record_delivery_verification(
            order=self.order,
            receiver_name='John Doe',
            receiver_document_checked=True,
            receiver_is_adult=True,
            verified_by='driver-1',
            notes='ID checked and receiver is 25 years old',
        )

        self.order.refresh_from_db()
        self.assertEqual(self.order.status, Order.Status.DELIVERED)
        self.assertIsNotNone(result.delivered_at)
        self.assertIsInstance(result.delivered_at, timezone.datetime)

    def test_adult_verified_delivery_stores_fields(self):
        record_delivery_verification(
            order=self.order,
            receiver_name='John Doe',
            receiver_document_checked=True,
            receiver_is_adult=True,
            verified_by='driver-2',
            notes='All good',
        )

        self.order.refresh_from_db()
        verification = self.order.delivery_verifications.first()
        self.assertEqual(verification.receiver_name, 'John Doe')
        self.assertTrue(verification.receiver_document_checked)
        self.assertTrue(verification.receiver_is_adult)
        self.assertEqual(verification.verified_by, 'driver-2')
        self.assertEqual(verification.verification_notes, 'All good')
        self.assertIsNotNone(verification.delivered_at)
        self.assertIsNotNone(verification.created_at)

    def test_failed_age_verification_marks_order_failed_age_verification(self):
        result = record_delivery_verification(
            order=self.order,
            receiver_name='Underage Receiver',
            receiver_document_checked=True,
            receiver_is_adult=False,
            verified_by='driver-1',
            notes='Receiver is 19 years old',
        )

        self.order.refresh_from_db()
        self.assertEqual(self.order.status, Order.Status.FAILED_AGE_VERIFICATION)
        self.assertIsNone(result.delivered_at)
        self.assertEqual(self.order.compliance_events.count(), 1)
        compliance_event = self.order.compliance_events.first()
        self.assertEqual(compliance_event.event_type, ComplianceEvent.EventType.FAILED_AGE_VERIFICATION)

    def test_unchecked_document_creates_compliance_event(self):
        record_delivery_verification(
            order=self.order,
            receiver_name='Anonymous',
            receiver_document_checked=False,
            receiver_is_adult=None,
            verified_by='driver-3',
            notes='Receiver refused to show ID',
        )

        self.order.refresh_from_db()
        self.assertEqual(self.order.status, Order.Status.FAILED_AGE_VERIFICATION)
        self.assertEqual(self.order.compliance_events.count(), 1)
        self.assertIsNone(DeliveryVerification.objects.latest('pk').delivered_at)

    def test_no_document_image_or_document_number_fields_on_verification(self):
        fields = [f.name for f in DeliveryVerification._meta.get_fields()]
        for sensitive in ['id_image', 'passport_image', 'id_scan', 'document_image', 'document_number', 'id_number', 'id_image_url', 'document_url']:
            self.assertNotIn(sensitive, fields, f'DeliveryVerification should not have {sensitive}')

    def test_no_document_image_or_document_number_fields_on_compliance_event(self):
        fields = [f.name for f in ComplianceEvent._meta.get_fields()]
        for sensitive in ['id_image', 'passport_image', 'id_scan', 'document_image', 'document_number', 'id_number', 'id_image_url', 'document_url']:
            self.assertNotIn(sensitive, fields, f'ComplianceEvent should not have {sensitive}')

    def test_compliance_event_created_for_failed_verification(self):
        record_delivery_verification(
            order=self.order,
            receiver_name='No ID',
            receiver_document_checked=False,
            receiver_is_adult=False,
            verified_by='driver-4',
            notes='No documents shown',
        )

        self.assertEqual(self.order.compliance_events.count(), 1)
        event = self.order.compliance_events.first()
        self.assertEqual(event.event_type, ComplianceEvent.EventType.FAILED_AGE_VERIFICATION)
        self.assertEqual(event.notes, 'No documents shown')
        self.assertEqual(event.order, self.order)
        self.assertIsNotNone(event.created_at)

    def test_receiver_is_adult_false_without_document_check(self):
        record_delivery_verification(
            order=self.order,
            receiver_name='Unverified',
            receiver_document_checked=False,
            receiver_is_adult=False,
            verified_by='driver-5',
            notes='Minor, no ID',
        )

        self.order.refresh_from_db()
        self.assertEqual(self.order.status, Order.Status.FAILED_AGE_VERIFICATION)
        self.assertEqual(self.order.compliance_events.count(), 1)
        self.assertIsNone(DeliveryVerification.objects.latest('pk').delivered_at)
