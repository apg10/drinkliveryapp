from django.db import models


class DeliveryZone(models.Model):
    class Meta:
        db_table = 'delivery_deliveryzone'
        ordering = ['id']

    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='delivery_zones')
    name = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    base_fee = models.DecimalField(max_digits=10, decimal_places=2)
    minimum_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.name} ({self.tenant.name})'
