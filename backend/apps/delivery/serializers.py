from rest_framework import serializers

from apps.delivery.models import DeliveryZone


class DeliveryZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryZone
        fields = [
            'id',
            'name',
            'city',
            'base_fee',
            'minimum_order_amount',
            'is_active',
        ]
