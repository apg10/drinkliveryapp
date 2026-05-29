from decimal import Decimal

from django.db import transaction
from django.utils import timezone

from apps.orders.models import Order
from apps.payments.models import PaymentRecord


def record_manual_payment(order, method, status, amount, reference='', notes='', confirmed_at=None):
    """Create a manual PaymentRecord for an order and update the order payment status."""
    with transaction.atomic():
        record = PaymentRecord.objects.create(
            order=order,
            method=method,
            status=status,
            amount=Decimal(str(amount)),
            reference=reference,
            notes=notes,
            confirmed_at=confirmed_at,
        )

        if status == Order.PaymentStatus.CONFIRMED and confirmed_at is None:
            record.confirmed_at = timezone.now()
            record.save(update_fields=['confirmed_at'])

        Order.objects.filter(pk=order.pk).update(
            payment_status=status,
        )
        order.refresh_from_db()

    return record
