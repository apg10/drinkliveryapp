from django.test import TestCase

from apps.compliance.models import ComplianceEvent, DeliveryVerification
from apps.delivery.models import DeliveryZone
from apps.orders.models import Address, Customer, Order
from apps.tenants.models import Tenant


class DeliveryVerificationModelTest(TestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(name='Test Tenant', slug='test-slug', country='PA', city='Panama', currency='PAB')
        self.customer = Customer.objects.create(full_name='Jane Doe', phone='5076000000')
        self.address = Address.objects.create(customer=self.customer, address_line='123 Main St', city='Panama')
        self.order = Order.objects.create(tenant=self.tenant, customer=self.customer, address=self.address)

    def test_create_delivery_verification(self):
        verification = DeliveryVerification.objects.create(
            order=self.order,
            receiver_name='Juan Perez',
            receiver_document_checked=True,
            receiver_is_adult=True,
            verified_by='driver-1',
            verification_notes='ID checked successfully',
        )

        self.assertEqual(verification.receiver_name, 'Juan Perez')
        self.assertTrue(verification.receiver_document_checked)
        self.assertTrue(verification.receiver_is_adult)
        self.assertEqual(verification.verified_by, 'driver-1')
        self.assertEqual(verification.verification_notes, 'ID checked successfully')
        self.assertIsNone(verification.delivered_at)
        self.assertIsNotNone(verification.created_at)
        self.assertEqual(verification.order, self.order)

    def test_delivery_verification_order_is_required(self):
        order_field = DeliveryVerification._meta.get_field('order')
        self.assertFalse(order_field.null)
        self.assertFalse(order_field.blank)

    def test_delivery_verification_str_with_order(self):
        verification = DeliveryVerification.objects.create(
            order=self.order,
            receiver_name='Jane Doe',
            receiver_document_checked=True,
            receiver_is_adult=True,
            verified_by='driver-1',
        )

        self.assertEqual(verification.order, self.order)
        self.assertEqual(self.order.delivery_verifications.first(), verification)
        self.assertIn(self.order.order_code, str(verification))
        self.assertIn('Jane Doe', str(verification))

    def test_delivery_verification_defaults(self):
        verification = DeliveryVerification.objects.create(order=self.order)
        self.assertEqual(verification.receiver_name, '')
        self.assertFalse(verification.receiver_document_checked)
        self.assertIsNone(verification.receiver_is_adult)
        self.assertEqual(verification.verified_by, '')
        self.assertEqual(verification.verification_notes, '')
        self.assertIsNone(verification.delivered_at)


class ComplianceEventModelTest(TestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(name='Test Tenant Event', slug='test-slug-event', country='PA', city='Panama', currency='PAB')
        self.customer = Customer.objects.create(full_name='John Doe', phone='5076000001')
        self.address = Address.objects.create(customer=self.customer, address_line='456 Oak Ave', city='Panama')
        self.order = Order.objects.create(tenant=self.tenant, customer=self.customer, address=self.address)

    def test_create_compliance_event(self):
        event = ComplianceEvent.objects.create(
            order=self.order,
            event_type=ComplianceEvent.EventType.FAILED_AGE_VERIFICATION,
            notes='Receiver showed no ID and appears underage',
        )

        self.assertEqual(event.event_type, 'FAILED_AGE_VERIFICATION')
        self.assertEqual(event.notes, 'Receiver showed no ID and appears underage')
        self.assertIsNotNone(event.created_at)
        self.assertIn('FAILED_AGE_VERIFICATION', str(event))
        self.assertEqual(event.order, self.order)

    def test_compliance_event_order_is_required(self):
        order_field = ComplianceEvent._meta.get_field('order')
        self.assertFalse(order_field.null)
        self.assertFalse(order_field.blank)

    def test_compliance_event_str_with_order(self):
        event = ComplianceEvent.objects.create(
            order=self.order,
            event_type=ComplianceEvent.EventType.DELIVERY_REFUSED,
            notes='Receiver refused to show ID',
        )

        self.assertEqual(event.order, self.order)
        self.assertEqual(self.order.compliance_events.first(), event)
        self.assertIn('DELIVERY_REFUSED', str(event))

    def test_compliance_event_all_event_types(self):
        for event_type in ComplianceEvent.EventType:
            event = ComplianceEvent.objects.create(order=self.order, event_type=event_type.value)
            self.assertEqual(event.event_type, event_type.value)

    def test_compliance_event_defaults(self):
        event = ComplianceEvent.objects.create(order=self.order, event_type=ComplianceEvent.EventType.OTHER)
        self.assertEqual(event.notes, '')


class ComplianceEventOrderRelationTest(TestCase):
    def test_delivery_verification_relates_to_order(self):
        tenant = Tenant.objects.create(name='Test Tenant', slug='test-slug', country='PA', city='Panama', currency='PAB')
        customer = Customer.objects.create(full_name='Jane Doe', phone='5076000000', email='jane@test.com')
        address = Address.objects.create(customer=customer, address_line='123 Main St', city='Panama')
        zone = DeliveryZone.objects.create(tenant=tenant, name='Zone A', city='Panama', base_fee='10.00')
        order = Order.objects.create(tenant=tenant, customer=customer, address=address, delivery_zone=zone)

        verification = DeliveryVerification.objects.create(
            order=order,
            receiver_name='Jane Doe',
            receiver_document_checked=True,
            receiver_is_adult=True,
            verified_by='driver-1',
        )

        self.assertEqual(verification.order, order)
        self.assertIn(verification, order.delivery_verifications.all())

    def test_compliance_event_relates_to_order(self):
        tenant = Tenant.objects.create(name='Test Tenant', slug='test-slug2', country='PA', city='Panama', currency='PAB')
        customer = Customer.objects.create(full_name='John Doe', phone='5076000001', email='john@test.com')
        address = Address.objects.create(customer=customer, address_line='456 Oak Ave', city='Panama')
        zone = DeliveryZone.objects.create(tenant=tenant, name='Zone B', city='Panama', base_fee='15.00')
        order = Order.objects.create(tenant=tenant, customer=customer, address=address, delivery_zone=zone)

        event = ComplianceEvent.objects.create(
            order=order,
            event_type=ComplianceEvent.EventType.DELIVERY_REFUSED,
            notes='Receiver refused to show ID',
        )

        self.assertEqual(event.order, order)
        self.assertIn(event, order.compliance_events.all())


class NoImageFieldTest(TestCase):
    def test_no_image_or_document_fields_on_delivery_verification(self):
        fields = [f.name for f in DeliveryVerification._meta.get_fields()]
        for sensitive in ['id_image', 'passport_image', 'id_scan', 'document_image', 'document_number', 'id_number', 'id_image_url', 'document_url']:
            self.assertNotIn(sensitive, fields, f'DeliveryVerification should not have {sensitive}')

    def test_no_image_or_document_fields_on_compliance_event(self):
        fields = [f.name for f in ComplianceEvent._meta.get_fields()]
        for sensitive in ['id_image', 'passport_image', 'id_scan', 'document_image', 'document_number', 'id_number', 'id_image_url', 'document_url']:
            self.assertNotIn(sensitive, fields, f'ComplianceEvent should not have {sensitive}')
