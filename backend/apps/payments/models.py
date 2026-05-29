from django.db import models
from django.utils import timezone


class PaymentRecord(models.Model):
    class Meta:
        db_table = 'payments_paymentrecord'
        ordering = ['-created_at']

    class PaymentMethod(models.TextChoices):
        CASH = 'CASH', 'Cash'
        TRANSFER = 'TRANSFER', 'Bank Transfer'
        YAPPY_MANUAL = 'YAPPY_MANUAL', 'Yappy Manual'
        OTHER_MANUAL = 'OTHER_MANUAL', 'Other Manual'

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        CONFIRMED = 'CONFIRMED', 'Confirmed'
        FAILED = 'FAILED', 'Failed'
        REFUNDED = 'REFUNDED', 'Refunded'
        CANCELLED = 'CANCELLED', 'Cancelled'

    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE, related_name='payment_records')
    method = models.CharField(max_length=20, choices=PaymentMethod.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    reference = models.CharField(max_length=200, blank=True, default='')
    notes = models.TextField(blank=True, default='')
    confirmed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Payment {self.order.order_code} - {self.get_method_display()} ({self.get_status_display()})'
