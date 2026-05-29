from django.contrib import admin

from .models import Address, Customer, Order, OrderItem, OrderStatusHistory


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'phone', 'email', 'created_at']
    list_filter = ['created_at']
    search_fields = ['full_name', 'phone', 'email']


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ['address_line', 'customer', 'city', 'created_at']
    list_filter = ['city']
    search_fields = ['address_line', 'customer__full_name']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_code', 'tenant', 'customer', 'status', 'total', 'created_at']
    list_filter = ['status', 'payment_status', 'payment_method', 'tenant']
    search_fields = ['order_code', 'customer__full_name', 'customer__phone']
    readonly_fields = ['order_code', 'created_at', 'updated_at']


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product', 'variant', 'quantity', 'unit_price', 'total_price']
    list_filter = ['product__is_active', 'product__is_alcoholic']


@admin.register(OrderStatusHistory)
class OrderStatusHistoryAdmin(admin.ModelAdmin):
    list_display = ['order', 'previous_status', 'new_status', 'changed_by', 'created_at']
    list_filter = ['new_status', 'created_at']
    search_fields = ['order__order_code', 'note']
    readonly_fields = ['created_at']
