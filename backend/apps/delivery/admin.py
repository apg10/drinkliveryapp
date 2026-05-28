from django.contrib import admin
from .models import DeliveryZone


@admin.register(DeliveryZone)
class DeliveryZoneAdmin(admin.ModelAdmin):
    list_display = ['name', 'tenant', 'city', 'base_fee', 'is_active']
    list_filter = ['is_active', 'city', 'tenant']
    search_fields = ['name', 'city', 'tenant__name']
