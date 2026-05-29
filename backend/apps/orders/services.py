from decimal import Decimal as D

from django.db import transaction

from apps.orders.models import Address, Customer, Order, OrderItem, OrderStatusHistory


def _create_customer(customer_data):
    return Customer.objects.create(
        full_name=customer_data['full_name'],
        phone=customer_data['phone'],
        email=customer_data.get('email', ''),
    )


def _create_address(customer, address_data):
    return Address.objects.create(
        customer=customer,
        address_line=address_data['address_line'],
        building_details=address_data.get('building_details', ''),
        city=address_data['city'],
        delivery_notes=address_data.get('delivery_notes', ''),
    )


def checkout_create_order(order_data):
    with transaction.atomic():
        tenant = order_data['_tenant']
        zone = order_data['_delivery_zone']

        customer = _create_customer(order_data['customer'])

        address = _create_address(customer, order_data['address'])

        order = Order.objects.create(
            tenant=tenant,
            customer=customer,
            address=address,
            status=Order.Status.PENDING,
            delivery_zone=zone,
            scheduled_date=order_data.get('scheduled_date'),
            scheduled_time_window=order_data.get('scheduled_time_window', ''),
            payment_method=order_data['payment_method'],
            customer_notes=order_data.get('customer_notes', ''),
            age_confirmed_by_customer=order_data.get('age_confirmed_by_customer', False),
            terms_accepted=order_data.get('terms_accepted', False),
            subtotal=D('0.00'),
            delivery_fee=zone.base_fee,
            total=D('0.00'),
        )

        subtotal = D('0.00')
        for item_data in order_data['_items']:
            item = OrderItem.objects.create(
                order=order,
                product=item_data['product'],
                variant=item_data['variant'],
                quantity=item_data['quantity'],
                unit_price=item_data['unit_price'],
                total_price=D('0.00'),
            )
            subtotal += item.total_price

        order.subtotal = subtotal
        order.total = subtotal + zone.base_fee
        order.save(update_fields=['subtotal', 'total'])

    return order


def transition_order_status(order, new_status, changed_by='', note=''):
    if order.status == new_status:
        return order

    previous_status = order.status

    OrderStatusHistory.objects.create(
        order=order,
        previous_status=previous_status,
        new_status=new_status,
        changed_by=changed_by,
        note=note,
    )

    order.status = new_status
    order.save(update_fields=['status'])

    return order
