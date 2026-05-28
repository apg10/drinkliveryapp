from django.http import JsonResponse
from rest_framework.decorators import api_view

from apps.tenants.models import Tenant
from apps.delivery.models import DeliveryZone
from apps.delivery.serializers import DeliveryZoneSerializer


@api_view(['GET'])
def public_delivery_zones(request, tenant_slug):
    """Return active delivery zones for a public tenant endpoint."""
    try:
        tenant = Tenant.objects.get(slug=tenant_slug, is_active=True)
    except Tenant.DoesNotExist:
        return JsonResponse({'error': 'Tenant not found or inactive'}, status=404)

    zones = DeliveryZone.objects.filter(
        tenant=tenant,
        is_active=True,
    ).order_by('id')

    return JsonResponse({'zones': DeliveryZoneSerializer(zones, many=True).data})
