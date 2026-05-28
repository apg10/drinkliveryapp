from rest_framework import serializers

from apps.products.models import Category, Product, ProductVariant


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'name', 'servings', 'price', 'is_active', 'display_order']

    price = serializers.DecimalField(max_digits=10, decimal_places=2)


class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'description', 'base_price', 'image', 'alcohol_percentage_note', 'servings', 'is_alcoholic', 'display_order', 'variants']

    base_price = serializers.DecimalField(max_digits=10, decimal_places=2)


class CategorySerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'display_order', 'is_active', 'products']


class CatalogSerializer(serializers.Serializer):
    categories = CategorySerializer(many=True, read_only=True)
