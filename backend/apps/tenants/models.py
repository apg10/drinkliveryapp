from django.db import models


class Tenant(models.Model):
    class Meta:
        db_table = 'tenants_tenant'

    class Country(models.TextChoices):
        PA = 'PA', 'Panama'
        CR = 'CR', 'Costa Rica'
        CO = 'CO', 'Colombia'
        MX = 'MX', 'Mexico'
        US = 'US', 'United States'
        OTHER = 'OT', 'Other'

    class City(models.TextChoices):
        PA_CITY = 'Panama City', 'Panama City'
        CR_CITY = 'San Jose', 'San Jose'
        CO_CITY = 'Bogota', 'Bogota'
        MX_CITY = 'Mexico City', 'Mexico City'
        OTHER_CITY = 'OTHER_CITY', 'Other City'

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=100, unique=True)
    country = models.CharField(max_length=2, choices=Country.choices, default=Country.PA)
    city = models.CharField(max_length=100, default='Panama City')
    currency = models.CharField(max_length=3, default='PAB')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.name} ({self.slug})'


class StorefrontSettings(models.Model):
    class Meta:
        db_table = 'tenants_storefront_settings'

    tenant = models.OneToOneField(Tenant, on_delete=models.CASCADE, related_name='storefront_settings')
    brand_name = models.CharField(max_length=200)
    tagline = models.TextField(blank=True, default='')
    primary_phone = models.CharField(max_length=50, blank=True, default='')
    whatsapp_phone = models.CharField(max_length=50, blank=True, default='')
    is_storefront_enabled = models.BooleanField(default=False)
    responsible_drinking_message = models.TextField(
        blank=True,
        default='Please drink responsibly. Must be of legal drinking age in your jurisdiction.',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Storefront for {self.tenant.name}'


class OperatingSchedule(models.Model):
    class Weekday(models.IntegerChoices):
        MONDAY = 1, 'Monday'
        TUESDAY = 2, 'Tuesday'
        WEDNESDAY = 3, 'Wednesday'
        THURSDAY = 4, 'Thursday'
        FRIDAY = 5, 'Friday'
        SATURDAY = 6, 'Saturday'
        SUNDAY = 7, 'Sunday'

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='operating_schedules')
    weekday = models.IntegerField(choices=Weekday.choices)
    opens_at = models.TimeField()
    closes_at = models.TimeField()
    accepts_orders = models.BooleanField(default=True)
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tenants_operating_schedule'
        ordering = ['weekday']

    def __str__(self):
        return f'{self.get_weekday_display()}: {self.opens_at} - {self.closes_at} ({self.tenant.name})'
