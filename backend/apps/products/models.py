from django.core.exceptions import ValidationError
from django.db import models


class Category(models.Model):
    class Meta:
        db_table = 'products_category'
        ordering = ['display_order', 'id']
        constraints = [
            models.UniqueConstraint(fields=['tenant', 'slug'], name='unique_category_slug_per_tenant'),
        ]

    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200)
    description = models.TextField(blank=True, default='')
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.name} ({self.tenant.slug})'


class Product(models.Model):
    class Meta:
        db_table = 'products_product'
        ordering = ['display_order', 'id']
        constraints = [
            models.UniqueConstraint(fields=['tenant', 'slug'], name='unique_product_slug_per_tenant'),
        ]

    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='products')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200)
    description = models.TextField(blank=True, default='')
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.CharField(max_length=500, blank=True, default='')
    alcohol_percentage_note = models.CharField(max_length=200, blank=True, default='')
    servings = models.IntegerField(blank=True, null=True, default=None)
    is_alcoholic = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.name} ({self.tenant.slug})'

    def clean(self):
        super().clean()
        if self.category_id and self.tenant_id:
            if self.category.tenant_id != self.tenant_id:
                raise ValidationError({'tenant': 'Product tenant must match category tenant'})


class ProductVariant(models.Model):
    class Meta:
        db_table = 'products_productvariant'
        ordering = ['display_order', 'id']

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    name = models.CharField(max_length=200)
    servings = models.IntegerField(blank=True, null=True, default=None)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.name} ({self.product.name})'
