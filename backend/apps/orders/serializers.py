from rest_framework import serializers

from apps.delivery.models import DeliveryZone
from apps.products.models import Product, ProductVariant
from apps.tenants.models import Tenant


class CheckoutCustomerSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=200)
    phone = serializers.CharField(max_length=50)
    email = serializers.EmailField(required=False, allow_blank=True, default='')


class CheckoutAddressSerializer(serializers.Serializer):
    address_line = serializers.CharField()
    building_details = serializers.CharField(required=False, allow_blank=True, default='')
    city = serializers.CharField(max_length=100)
    delivery_notes = serializers.CharField(required=False, allow_blank=True, default='')


class CheckoutItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(min_value=1)
    variant_id = serializers.IntegerField(min_value=1, required=False)
    quantity = serializers.IntegerField(min_value=1)


class CheckoutSerializer(serializers.Serializer):
    customer = CheckoutCustomerSerializer()
    address = CheckoutAddressSerializer()
    delivery_zone_id = serializers.IntegerField(min_value=1)
    scheduled_date = serializers.DateField(required=False)
    scheduled_time_window = serializers.CharField(max_length=100, required=False, allow_blank=True, default='')
    payment_method = serializers.ChoiceField(
        choices=[
            'CASH',
            'TRANSFER',
            'YAPPY_MANUAL',
            'OTHER_MANUAL',
        ]
    )
    customer_notes = serializers.CharField(required=False, allow_blank=True, default='')
    age_confirmed_by_customer = serializers.BooleanField(default=False)
    terms_accepted = serializers.BooleanField(required=True)
    items = CheckoutItemSerializer(many=True)

    def validate(self, data):
        tenant_slug = self.context.get('tenant_slug')
        try:
            tenant = Tenant.objects.get(slug=tenant_slug, is_active=True)
        except Tenant.DoesNotExist:
            raise serializers.ValidationError({'tenant_slug': 'Tenant not found or inactive.'})
        data['_tenant'] = tenant

        if not data.get('terms_accepted'):
            raise serializers.ValidationError({'terms_accepted': 'Terms acceptance is required.'})

        try:
            zone = DeliveryZone.objects.get(id=data['delivery_zone_id'], is_active=True)
        except DeliveryZone.DoesNotExist:
            raise serializers.ValidationError({'delivery_zone_id': 'Delivery zone not found or inactive.'})
        if zone.tenant_id != tenant.id:
            raise serializers.ValidationError({'delivery_zone_id': 'Delivery zone does not belong to this tenant.'})
        data['_delivery_zone'] = zone

        if not data['items']:
            raise serializers.ValidationError({'items': 'Cart must have at least one item.'})

        validated_items = []
        for item in data['items']:
            try:
                product = Product.objects.get(id=item['product_id'], tenant=tenant, is_active=True)
            except Product.DoesNotExist:
                raise serializers.ValidationError({'product_id': f'Product {item["product_id"]} not found or inactive.'})

            variant = None
            unit_price = product.base_price
            if item.get('variant_id'):
                try:
                    variant = ProductVariant.objects.get(id=item['variant_id'], product=product, is_active=True)
                except ProductVariant.DoesNotExist:
                    raise serializers.ValidationError({'variant_id': f'Variant {item["variant_id"]} not found, inactive, or invalid for product.'})
                unit_price = variant.price

            validated_items.append({
                'product': product,
                'variant': variant,
                'quantity': item['quantity'],
                'unit_price': unit_price,
            })

        # Enforce age confirmation when cart contains alcoholic products.
        has_alcoholic = any(item_data['product'].is_alcoholic for item_data in validated_items)
        if has_alcoholic and not data.get('age_confirmed_by_customer', False):
            raise serializers.ValidationError({'age_confirmed_by_customer': 'Age confirmation is required for alcoholic products.'})

        data['_items'] = validated_items

        return data
