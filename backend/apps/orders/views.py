from django.http import JsonResponse
from rest_framework.decorators import api_view

from apps.orders.models import Order
from apps.orders.serializers import CheckoutSerializer
from apps.orders.services import checkout_create_order


@api_view(['GET'])
def public_order_status(request, tenant_slug, order_code):
    try:
        from apps.tenants.models import Tenant
        tenant = Tenant.objects.get(slug=tenant_slug, is_active=True)
    except Tenant.DoesNotExist:
        return JsonResponse({'error': 'Tenant not found or inactive.'}, status=404)

    try:
        order = Order.objects.get(tenant=tenant, order_code=order_code)
    except Order.DoesNotExist:
        return JsonResponse({'error': 'Order not found.'}, status=404)

    return JsonResponse({
        'order_code': order.order_code,
        'status': order.status,
        'scheduled_date': str(order.scheduled_date) if order.scheduled_date else None,
        'scheduled_time_window': order.scheduled_time_window,
        'total': str(order.total),
    }, status=200)


@api_view(['POST'])
def public_checkout(request, tenant_slug):
    data = {
        **request.data,
    }

    serializer = CheckoutSerializer(data=data, context={'tenant_slug': tenant_slug})
    if not serializer.is_valid():
        if 'tenant_slug' in serializer.errors:
            return JsonResponse({'error': serializer.errors}, status=404)
        return JsonResponse({'error': serializer.errors}, status=400)

    validated = serializer.validated_data
    order = checkout_create_order(validated)

    return JsonResponse({
        'order_code': order.order_code,
        'status': order.status,
        'subtotal': str(order.subtotal),
        'delivery_fee': str(order.delivery_fee),
        'total': str(order.total),
        'customer': {
            'full_name': order.customer.full_name,
            'phone': order.customer.phone,
            'email': order.customer.email,
        },
        'address': {
            'address_line': order.address.address_line,
            'building_details': order.address.building_details,
            'city': order.address.city,
            'delivery_notes': order.address.delivery_notes,
        },
        'scheduled_date': str(order.scheduled_date) if order.scheduled_date else None,
        'scheduled_time_window': order.scheduled_time_window,
        'payment_method': order.payment_method,
        'items_count': order.items.count(),
    }, status=201)
