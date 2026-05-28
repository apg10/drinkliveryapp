from django.contrib import admin
from .models import OperatingSchedule, StorefrontSettings, Tenant


@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'country', 'city', 'is_active', 'created_at']
    list_filter = ['is_active', 'country', 'city']
    search_fields = ['name', 'slug']


@admin.register(StorefrontSettings)
class StorefrontSettingsAdmin(admin.ModelAdmin):
    list_display = ['tenant', 'brand_name', 'is_storefront_enabled', 'created_at']
    list_filter = ['is_storefront_enabled']
    search_fields = ['brand_name', 'tenant__name']


@admin.register(OperatingSchedule)
class OperatingScheduleAdmin(admin.ModelAdmin):
    list_display = ['tenant', 'weekday', 'opens_at', 'closes_at', 'accepts_orders']
    list_filter = ['weekday', 'accepts_orders', 'tenant']
    search_fields = ['tenant__name']
