from django.contrib import admin

from .models import ComplianceEvent, DeliveryVerification


@admin.register(DeliveryVerification)
class DeliveryVerificationAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'receiver_name', 'receiver_document_checked', 'receiver_is_adult', 'delivered_at']
    list_filter = ['receiver_document_checked', 'receiver_is_adult', 'delivered_at']
    search_fields = ['order__order_code', 'receiver_name', 'verified_by']
    readonly_fields = ['created_at']


@admin.register(ComplianceEvent)
class ComplianceEventAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'event_type', 'created_at']
    list_filter = ['event_type', 'created_at']
    search_fields = ['order__order_code', 'notes']
    readonly_fields = ['created_at']
