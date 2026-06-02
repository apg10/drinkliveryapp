from django.http import JsonResponse
from rest_framework.decorators import api_view

from apps.tenants.models import Tenant
from apps.products.models import Category, Product, ProductVariant


@api_view(['GET'])
def public_catalog(request, tenant_slug):
    """Return active catalog for a public tenant endpoint."""
    try:
        tenant = Tenant.objects.get(slug=tenant_slug, is_active=True)
    except Tenant.DoesNotExist:
        return JsonResponse({'error': 'Tenant not found or inactive'}, status=404)

    categories_qs = Category.objects.filter(
        tenant=tenant,
        is_active=True
    ).order_by('display_order', 'id')

    categories_data = []
    for category in categories_qs:
        products_qs = Product.objects.filter(
            category=category,
            is_active=True
        ).order_by('display_order', 'id')

        products_data = []
        for product in products_qs:
            variants_qs = ProductVariant.objects.filter(
                product=product,
                is_active=True
            ).order_by('display_order', 'id')

            variants_data = [
                {
                    'id': variant.id,
                    'name': variant.name,
                    'servings': variant.servings,
                    'price': variant.price,
                    'is_active': variant.is_active,
                    'display_order': variant.display_order,
                }
                for variant in variants_qs
            ]
            products_data.append({
                'id': product.id,
                'name': product.name,
                'slug': product.slug,
                'description': product.description,
                'base_price': product.base_price,
                'image': product.image,
                'alcohol_percentage_note': product.alcohol_percentage_note,
                'servings': product.servings,
                'is_alcoholic': product.is_alcoholic,
                'display_order': product.display_order,
                'variants': variants_data,
            })
        categories_data.append({
            'id': category.id,
            'name': category.name,
            'slug': category.slug,
            'description': category.description,
            'display_order': category.display_order,
            'is_active': category.is_active,
            'products': products_data,
        })

    return JsonResponse({'categories': categories_data})


@api_view(['GET'])
def public_product_detail(request, tenant_slug, product_slug):
    """Return active product detail by tenant and product slug."""
    try:
        tenant = Tenant.objects.get(slug=tenant_slug, is_active=True)
    except Tenant.DoesNotExist:
        return JsonResponse({'error': 'Tenant not found or inactive'}, status=404)

    try:
        product = Product.objects.select_related('category').get(
            slug=product_slug,
            tenant=tenant,
            is_active=True,
        )
    except Product.DoesNotExist:
        return JsonResponse({'error': 'Product not found'}, status=404)

    if not product.category.is_active:
        return JsonResponse({'error': 'Product category is inactive'}, status=404)

    variants_qs = ProductVariant.objects.filter(
        product=product,
        is_active=True
    ).order_by('display_order', 'id')

    variants_data = [
        {
            'id': variant.id,
            'name': variant.name,
            'servings': variant.servings,
            'price': variant.price,
            'is_active': variant.is_active,
            'display_order': variant.display_order,
        }
        for variant in variants_qs
    ]

    return JsonResponse({
        'id': product.id,
        'name': product.name,
        'slug': product.slug,
        'description': product.description,
        'base_price': product.base_price,
        'image': product.image,
        'alcohol_percentage_note': product.alcohol_percentage_note,
        'servings': product.servings,
        'is_alcoholic': product.is_alcoholic,
        'display_order': product.display_order,
        'variants': variants_data,
    })
