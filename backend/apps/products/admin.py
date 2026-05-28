from django.contrib import admin

from .models import Category, Product, ProductVariant


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'tenant', 'display_order', 'is_active')
    list_filter = ('is_active', 'tenant')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'tenant', 'category', 'base_price', 'is_alcoholic', 'is_active', 'display_order')
    list_filter = ('is_active', 'is_alcoholic', 'tenant', 'category')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ('name', 'product', 'price', 'is_active', 'display_order')
    list_filter = ('is_active', 'product')
