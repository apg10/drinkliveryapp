from decimal import Decimal, InvalidOperation

from django.db.models import Sum
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser

from apps.orders.models import Order
from apps.orders.serializers import CheckoutSerializer
from apps.orders.services import checkout_create_order, transition_order_status
from apps.compliance.services import record_delivery_verification
from apps.payments.services import record_manual_payment


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


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_order_list(request):
    orders = (
        Order.objects.select_related('customer', 'address', 'tenant')
        .prefetch_related('items__product', 'items__variant')
        .order_by('-created_at')
    )
    data = [_serialize_admin_order(order, include_items=True) for order in orders]
    return JsonResponse({'orders': data, 'count': len(data)}, status=200)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_order_detail(request, id):
    try:
        order = (
            Order.objects.select_related('customer', 'address', 'tenant')
            .prefetch_related('items__product', 'items__variant')
            .get(id=id)
        )
    except Order.DoesNotExist:
        return JsonResponse({'error': 'Order not found.'}, status=404)

    return JsonResponse(_serialize_admin_order(order, include_items=True), status=200)


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def admin_order_status_update(request, id):
    try:
        order = Order.objects.get(id=id)
    except Order.DoesNotExist:
        return JsonResponse({'error': 'Order not found.'}, status=404)

    status = request.data.get('status')
    if not status:
        return JsonResponse({'error': 'status is required.'}, status=400)

    valid_statuses = [s[0] for s in Order.Status.choices]
    if status not in valid_statuses:
        return JsonResponse({'error': f'Invalid status. Must be one of: {valid_statuses}'}, status=400)

    changed_by = request.user.get_username() or request.user.email
    note = request.data.get('note', '')

    transition_order_status(order, status, changed_by, note)

    return JsonResponse({
        'id': order.id,
        'order_code': order.order_code,
        'status': order.status,
    }, status=200)


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def admin_order_payment_update(request, id):
    try:
        order = Order.objects.get(id=id)
    except Order.DoesNotExist:
        return JsonResponse({'error': 'Order not found.'}, status=404)

    method = request.data.get('method')
    status = request.data.get('status')
    amount = request.data.get('amount')

    if not method or not status or amount is None:
        return JsonResponse({'error': 'method, status, and amount are required.'}, status=400)

    try:
        payment_amount = Decimal(str(amount))
    except (InvalidOperation, TypeError, ValueError):
        return JsonResponse({'error': 'amount must be a valid decimal value.'}, status=400)
    if not payment_amount.is_finite():
        return JsonResponse({'error': 'amount must be a valid decimal value.'}, status=400)

    valid_methods = [m[0] for m in Order.PaymentMethod.choices]
    if method not in valid_methods:
        return JsonResponse({'error': f'Invalid method. Must be one of: {valid_methods}'}, status=400)

    valid_statuses = [s[0] for s in Order.PaymentStatus.choices]
    if status not in valid_statuses:
        return JsonResponse({'error': f'Invalid status. Must be one of: {valid_statuses}'}, status=400)

    reference = request.data.get('reference', '')
    notes = request.data.get('notes', '')

    record = record_manual_payment(order, method, status, payment_amount, reference, notes)

    return JsonResponse({
        'id': order.id,
        'order_code': order.order_code,
        'payment_status': order.payment_status,
        'payment_record_id': record.id,
    }, status=200)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_delivery_verification(request, id):
    try:
        order = Order.objects.get(id=id)
    except Order.DoesNotExist:
        return JsonResponse({'error': 'Order not found.'}, status=404)

    disallowed_fields = ('document_number', 'document_image')
    for field in disallowed_fields:
        if field in request.data:
            return JsonResponse({'error': f'{field} fields are not allowed.'}, status=400)

    receiver_name = str(request.data.get('receiver_name', '')).strip()
    receiver_document_checked = request.data.get('receiver_document_checked')
    receiver_is_adult = request.data.get('receiver_is_adult')
    verification_notes = request.data.get('verification_notes', '')

    if not receiver_name:
        return JsonResponse({'error': 'receiver_name is required.'}, status=400)

    if receiver_document_checked is None or receiver_is_adult is None:
        return JsonResponse({'error': 'receiver_document_checked and receiver_is_adult are required.'}, status=400)

    if not isinstance(receiver_document_checked, bool) or not isinstance(receiver_is_adult, bool):
        return JsonResponse({'error': 'receiver_document_checked and receiver_is_adult must be booleans.'}, status=400)

    verified_by = request.user.get_username() or request.user.email

    verification = record_delivery_verification(
        order=order,
        receiver_name=receiver_name,
        receiver_document_checked=receiver_document_checked,
        receiver_is_adult=receiver_is_adult,
        verified_by=verified_by,
        notes=verification_notes,
    )

    return JsonResponse({
        'order_id': order.id,
        'order_code': order.order_code,
        'status': order.status,
        'delivery_verification_id': verification.id,
    }, status=200)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard_summary(request):
    total_orders = Order.objects.count()

    pending_orders = Order.objects.filter(status=Order.Status.PENDING).count()

    orders_by_status = {
        status[0]: Order.objects.filter(status=status[0]).count()
        for status in Order.Status.choices
    }

    confirmed_revenue = Order.objects.filter(
        payment_status=Order.PaymentStatus.CONFIRMED
    ).aggregate(total=Sum('total'))['total'] or Decimal('0.00')

    return JsonResponse({
        'total_orders': total_orders,
        'pending_orders': pending_orders,
        'orders_by_status': orders_by_status,
        'confirmed_revenue': str(confirmed_revenue),
    }, status=200)


def _serialize_admin_order(order, include_items=False):
    data = {
        'id': order.id,
        'order_code': order.order_code,
        'status': order.status,
        'payment_status': order.payment_status,
        'payment_method': order.payment_method,
        'customer': {
            'id': order.customer.id,
            'full_name': order.customer.full_name,
            'phone': order.customer.phone,
            'email': order.customer.email,
        },
        'address': {
            'id': order.address.id,
            'address_line': order.address.address_line,
            'building_details': order.address.building_details,
            'city': order.address.city,
            'delivery_notes': order.address.delivery_notes,
        },
        'subtotal': str(order.subtotal),
        'delivery_fee': str(order.delivery_fee),
        'total': str(order.total),
        'scheduled_date': str(order.scheduled_date) if order.scheduled_date else None,
        'scheduled_time_window': order.scheduled_time_window,
        'created_at': order.created_at.isoformat(),
    }

    if include_items:
        data['items'] = _serialize_admin_order_items(order)

    return data


def _serialize_admin_order_items(order):
    items = []
    for item in order.items.all():
        items.append({
            'id': item.id,
            'product_id': item.product.id,
            'product_name': item.product.name,
            'variant_id': item.variant_id if item.variant else None,
            'variant_name': item.variant.name if item.variant else None,
            'quantity': item.quantity,
            'unit_price': str(item.unit_price),
            'total_price': str(item.total_price),
        })
    return items
