from django.db import models
from django.utils import timezone


class DeliveryVerification(models.Model):
    class Meta:
        db_table = 'compliance_deliveryverification'
        ordering = ['-delivered_at']

    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE, related_name='delivery_verifications')
    receiver_name = models.CharField(max_length=200, blank=True, default='')
    receiver_document_checked = models.BooleanField(default=False)
    receiver_is_adult = models.BooleanField(null=True, blank=True, default=None)
    verified_by = models.CharField(max_length=200, blank=True, default='')
    verification_notes = models.TextField(blank=True, default='')
    delivered_at = models.DateTimeField(null=True, blank=True, default=None)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'DeliveryVerification for {self.order.order_code} - {self.receiver_name}'


class ComplianceEvent(models.Model):
    class Meta:
        db_table = 'compliance_complianceevent'
        ordering = ['-created_at']

    class EventType(models.TextChoices):
        FAILED_AGE_VERIFICATION = 'FAILED_AGE_VERIFICATION', 'Failed Age Verification'
        DELIVERY_REFUSED = 'DELIVERY_REFUSED', 'Delivery Refused'
        RECEIVER_UNAVAILABLE = 'RECEIVER_UNAVAILABLE', 'Receiver Unavailable'
        VISIBLY_INTOXICATED = 'VISIBLY_INTOXICATED', 'Visibly Intoxicated'
        UNATTENDED_DELIVERY_ATTEMPT = 'UNATTENDED_DELIVERY_ATTEMPT', 'Unattended Delivery Attempt'
        HANDED_TO_MINOR = 'HANDED_TO_MINOR', 'Handed to Minor'
        ADMIN_REJECTION = 'ADMIN_REJECTION', 'Admin Rejection'
        OTHER = 'OTHER', 'Other'

    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE, related_name='compliance_events')
    event_type = models.CharField(max_length=40, choices=EventType.choices)
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'ComplianceEvent({self.event_type}) on {self.order.order_code}'
