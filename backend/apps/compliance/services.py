from django.db import transaction
from django.utils import timezone

from apps.compliance.models import ComplianceEvent, DeliveryVerification
from apps.orders.models import Order
from apps.orders.services import transition_order_status


def record_delivery_verification(
    order,
    receiver_name,
    receiver_document_checked,
    receiver_is_adult,
    verified_by='',
    notes='',
):
    """Record a delivery verification and transition the order accordingly.

    If receiver_document_checked is True and receiver_is_adult is True:
        - Create DeliveryVerification with delivered_at set
        - Transition order to DELIVERED

    If document was not checked or receiver is not adult:
        - Create DeliveryVerification without delivered_at
        - Create ComplianceEvent (FAILED_AGE_VERIFICATION)
        - Transition order to FAILED_AGE_VERIFICATION
    """
    with transaction.atomic():
        verification = DeliveryVerification.objects.create(
            order=order,
            receiver_name=receiver_name,
            receiver_document_checked=receiver_document_checked,
            receiver_is_adult=receiver_is_adult,
            verified_by=verified_by,
            verification_notes=notes,
            delivered_at=timezone.now() if (receiver_document_checked and receiver_is_adult) else None,
        )

        if receiver_document_checked and receiver_is_adult:
            transition_order_status(order, Order.Status.DELIVERED, changed_by=verified_by, note=notes or 'Delivery verified successfully')
        else:
            ComplianceEvent.objects.create(
                order=order,
                event_type=ComplianceEvent.EventType.FAILED_AGE_VERIFICATION,
                notes=notes or 'Receiver failed age or document verification',
            )
            transition_order_status(order, Order.Status.FAILED_AGE_VERIFICATION, changed_by=verified_by, note=notes or 'Failed age or document verification')

    return verification
