from decimal import Decimal

from django.core.management.base import BaseCommand

from apps.delivery.models import DeliveryZone
from apps.products.models import Category, Product, ProductVariant
from apps.tenants.models import OperatingSchedule, StorefrontSettings, Tenant


class Command(BaseCommand):
    help = 'Seed Drinklivery Panama tenant foundation data (idempotent)'

    def handle(self, *args, **options):
        tenant, created = Tenant.objects.get_or_create(
            slug='drinklivery-panama',
            defaults={
                'name': 'Drinklivery Panama',
                'country': 'PA',
                'city': 'Panama City',
                'currency': 'PAB',
                'is_active': True,
            },
        )
        if not created:
            tenant.name = 'Drinklivery Panama'
            tenant.country = 'PA'
            tenant.city = 'Panama City'
            tenant.currency = 'PAB'
            tenant.is_active = True
            tenant.save(update_fields=['name', 'country', 'city', 'currency', 'is_active', 'updated_at'])

        self.stdout.write(self.style.SUCCESS(f"Tenant {'created' if created else 'updated'}: {tenant}"))

        storefront, sf_created = StorefrontSettings.objects.get_or_create(
            tenant=tenant,
            defaults={
                'brand_name': 'Drinklivery',
                'tagline': 'Ready-to-drink cocktails and event drinks in Panama City',
                'is_storefront_enabled': True,
            },
        )
        if not sf_created:
            storefront.brand_name = 'Drinklivery'
            storefront.tagline = 'Ready-to-drink cocktails and event drinks in Panama City'
            storefront.is_storefront_enabled = True
            storefront.save(update_fields=['brand_name', 'tagline', 'is_storefront_enabled', 'updated_at'])

        self.stdout.write(self.style.SUCCESS(f"StorefrontSettings {'created' if sf_created else 'updated'}: {storefront}"))

        weekdays = [
            (OperatingSchedule.Weekday.MONDAY, '09:00:00', '23:00:00'),
            (OperatingSchedule.Weekday.TUESDAY, '09:00:00', '23:00:00'),
            (OperatingSchedule.Weekday.WEDNESDAY, '09:00:00', '23:00:00'),
            (OperatingSchedule.Weekday.THURSDAY, '09:00:00', '00:00:00'),
            (OperatingSchedule.Weekday.FRIDAY, '09:00:00', '02:00:00'),
            (OperatingSchedule.Weekday.SATURDAY, '10:00:00', '02:00:00'),
            (OperatingSchedule.Weekday.SUNDAY, '10:00:00', '23:00:00'),
        ]

        created_count = 0
        for weekday, opens_at, closes_at in weekdays:
            obj, s_created = OperatingSchedule.objects.get_or_create(
                tenant=tenant,
                weekday=weekday,
                defaults={
                    'opens_at': opens_at,
                    'closes_at': closes_at,
                    'accepts_orders': True,
                },
            )
            if s_created:
                created_count += 1
            else:
                obj.opens_at = opens_at
                obj.closes_at = closes_at
                obj.accepts_orders = True
                obj.save(update_fields=['opens_at', 'closes_at', 'accepts_orders', 'updated_at'])

        self.stdout.write(
            self.style.SUCCESS(f"OperatingSchedule: {created_count} rows for {tenant.slug}")
        )

        categories_data = [
            {
                'name': 'Cocktail Packs',
                'slug': 'cocktail-packs',
                'description': 'Ready-to-drink alcoholic cocktail packs',
            },
            {
                'name': 'Mocktails',
                'slug': 'mocktails',
                'description': 'Non-alcoholic cocktail packs',
            },
        ]

        created_categories = {}
        for cat_data in categories_data:
            cat, c_created = Category.objects.get_or_create(
                tenant=tenant,
                slug=cat_data['slug'],
                defaults=cat_data,
            )
            if not c_created:
                cat.name = cat_data['name']
                cat.description = cat_data['description']
                cat.is_active = True
                cat.save(update_fields=['name', 'description', 'is_active', 'updated_at'])
            created_categories[cat_data['slug']] = cat

        self.stdout.write(
            self.style.SUCCESS(
                f"Category: {len(created_categories)} rows for {tenant.slug}"
            )
        )

        products_data = [
            {
                'name': 'Mojito Pack x4',
                'slug': 'mojito-pack-x4',
                'category': created_categories['cocktail-packs'],
                'description': 'Classic mojito cocktail pack, serves 4',
                'base_price': Decimal('28.00'),
                'is_alcoholic': True,
                'servings': 4,
                'image': '/catalog/mojito-pack-x4.webp',
            },
            {
                'name': 'Margarita Pack x4',
                'slug': 'margarita-pack-x4',
                'category': created_categories['cocktail-packs'],
                'description': 'Classic margarita cocktail pack, serves 4',
                'base_price': Decimal('32.00'),
                'is_alcoholic': True,
                'servings': 4,
                'image': '/catalog/margarita-pack-x4.webp',
            },
            {
                'name': 'Passion Fruit Mocktail Pack x4',
                'slug': 'passion-fruit-mocktail-pack-x4',
                'category': created_categories['mocktails'],
                'description': 'Tropical passion fruit mocktail pack, serves 4',
                'base_price': Decimal('22.00'),
                'is_alcoholic': False,
                'servings': 4,
                'image': '/catalog/passion-fruit-mocktail-pack-x4.webp',
            },
        ]

        created_products = {}
        for prod_data in products_data:
            prod, p_created = Product.objects.get_or_create(
                tenant=tenant,
                slug=prod_data['slug'],
                defaults={
                    'name': prod_data['name'],
                    'description': prod_data['description'],
                    'category': prod_data['category'],
                    'base_price': prod_data['base_price'],
                    'is_alcoholic': prod_data['is_alcoholic'],
                    'servings': prod_data['servings'],
                    'image': prod_data.get('image', ''),
                    'is_active': True,
                    'display_order': 0,
                },
            )
            if not p_created:
                prod.name = prod_data['name']
                prod.description = prod_data['description']
                prod.category = prod_data['category']
                prod.base_price = prod_data['base_price']
                prod.is_alcoholic = prod_data['is_alcoholic']
                prod.servings = prod_data['servings']
                prod.image = prod_data.get('image', '')
                prod.is_active = True
                prod.save(
                    update_fields=[
                        'name', 'description', 'category', 'base_price',
                        'is_alcoholic', 'servings', 'image',
                        'is_active', 'updated_at',
                    ]
                )
            created_products[prod_data['slug']] = prod

        self.stdout.write(
            self.style.SUCCESS(
                f"Product: {len(created_products)} rows for {tenant.slug}"
            )
        )

        variants_data = [
            {
                'product': created_products['mojito-pack-x4'],
                'name': 'Mojito Pack x8',
                'servings': 8,
                'price': Decimal('50.00'),
            },
            {
                'product': created_products['margarita-pack-x4'],
                'name': 'Margarita Pack x8',
                'servings': 8,
                'price': Decimal('58.00'),
            },
        ]

        created_variants = 0
        for var_data in variants_data:
            variant, v_created = ProductVariant.objects.get_or_create(
                product=var_data['product'],
                name=var_data['name'],
                defaults={
                    'servings': var_data['servings'],
                    'price': var_data['price'],
                    'is_active': True,
                    'display_order': 0,
                },
            )
            if v_created:
                created_variants += 1
            else:
                variant.servings = var_data['servings']
                variant.price = var_data['price']
                variant.is_active = True
                variant.save(update_fields=['servings', 'price', 'is_active', 'updated_at'])

        self.stdout.write(
            self.style.SUCCESS(
                f"Variant: {created_variants} rows for {tenant.slug}"
            )
        )

        zones_data = [
            {
                'name': 'Casco Viejo',
                'city': 'Panama City',
                'base_fee': Decimal('5.00'),
                'minimum_order_amount': Decimal('20.00'),
            },
            {
                'name': 'San Francisco',
                'city': 'Panama City',
                'base_fee': Decimal('4.00'),
                'minimum_order_amount': Decimal('20.00'),
            },
            {
                'name': 'Costa del Este',
                'city': 'Panama City',
                'base_fee': Decimal('6.00'),
                'minimum_order_amount': Decimal('25.00'),
            },
        ]

        created_zones = 0
        for zone_data in zones_data:
            zone, z_created = DeliveryZone.objects.get_or_create(
                tenant=tenant,
                name=zone_data['name'],
                defaults=zone_data,
            )
            if z_created:
                created_zones += 1
            else:
                zone.city = zone_data['city']
                zone.base_fee = zone_data['base_fee']
                zone.minimum_order_amount = zone_data['minimum_order_amount']
                zone.is_active = True
                zone.save(update_fields=['city', 'base_fee', 'minimum_order_amount', 'is_active', 'updated_at'])

        self.stdout.write(
            self.style.SUCCESS(
                f"DeliveryZone: {created_zones} rows for {tenant.slug}"
            )
        )
