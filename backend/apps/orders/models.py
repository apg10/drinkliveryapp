import uuid
from decimal import Decimal

from django.db import models


class Customer(models.Model):
    class Meta:
        db_table = 'orders_customer'

    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=50)
    email = models.EmailField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.full_name} ({self.phone})'


class Address(models.Model):
    class Meta:
        db_table = 'orders_address'

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='addresses')
    address_line = models.TextField()
    building_details = models.TextField(blank=True, default='')
    city = models.CharField(max_length=100)
    delivery_notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.address_line} ({self.customer.full_name})'


class Order(models.Model):
    class Meta:
        db_table = 'orders_order'

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        ACCEPTED = 'ACCEPTED', 'Accepted'
        IN_PREPARATION = 'IN_PREPARATION', 'In Preparation'
        READY_FOR_DELIVERY = 'READY_FOR_DELIVERY', 'Ready for Delivery'
        OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY', 'Out for Delivery'
        DELIVERED = 'DELIVERED', 'Delivered'
        CANCELLED = 'CANCELLED', 'Cancelled'
        REJECTED = 'REJECTED', 'Rejected'
        FAILED_AGE_VERIFICATION = 'FAILED_AGE_VERIFICATION', 'Failed Age Verification'

    class PaymentMethod(models.TextChoices):
        CASH = 'CASH', 'Cash'
        TRANSFER = 'TRANSFER', 'Bank Transfer'
        YAPPY_MANUAL = 'YAPPY_MANUAL', 'Yappy Manual'
        OTHER_MANUAL = 'OTHER_MANUAL', 'Other Manual'

    class PaymentStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        CONFIRMED = 'CONFIRMED', 'Confirmed'
        FAILED = 'FAILED', 'Failed'
        REFUNDED = 'REFUNDED', 'Refunded'
        CANCELLED = 'CANCELLED', 'Cancelled'

    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='orders')
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='orders')
    address = models.ForeignKey(Address, on_delete=models.CASCADE, related_name='orders')
    order_code = models.CharField(max_length=20, unique=True, editable=False)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.PENDING)
    scheduled_date = models.DateField(null=True, blank=True)
    scheduled_time_window = models.CharField(max_length=100, blank=True, default='')
    delivery_zone = models.ForeignKey('delivery.DeliveryZone', on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_method = models.CharField(max_length=20, choices=PaymentMethod.choices, blank=True, default='')
    payment_status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    customer_notes = models.TextField(blank=True, default='')
    age_confirmed_by_customer = models.BooleanField(default=False)
    terms_accepted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.order_code:
            self.order_code = self._generate_order_code()
        super().save(*args, **kwargs)

    def _generate_order_code(self):
        code = f'ORD-{uuid.uuid4().hex[:8].upper()}'
        while Order.objects.filter(order_code=code).exists():
            code = f'ORD-{uuid.uuid4().hex[:8].upper()}'
        return code

    def __str__(self):
        return f'{self.order_code} - {self.customer.full_name}'


class OrderItem(models.Model):
    class Meta:
        db_table = 'orders_orderitem'

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('products.Product', on_delete=models.PROTECT, related_name='order_items')
    variant = models.ForeignKey('products.ProductVariant', on_delete=models.SET_NULL, null=True, blank=True, related_name='order_items')
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.variant:
            price = self.variant.price
        elif self.unit_price in (None, 0, Decimal('0.00')):
            price = self.product.base_price
        else:
            price = self.unit_price

        self.unit_price = Decimal(str(price))
        self.total_price = self.unit_price * Decimal(self.quantity)
        super().save(*args, **kwargs)

    def __str__(self):
        variant_part = f' - {self.variant.name}' if self.variant else ''
        return f'{self.order.order_code}: {self.product.name}{variant_part} x{self.quantity}'


class OrderStatusHistory(models.Model):
    class Meta:
        db_table = 'orders_orderstatushistory'
        ordering = ['-created_at']

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='status_history')
    previous_status = models.CharField(max_length=30, blank=True, default='')
    new_status = models.CharField(max_length=30)
    changed_by = models.CharField(max_length=200, blank=True, default='')
    note = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.order.order_code}: {self.previous_status} -> {self.new_status}'
