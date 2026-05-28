from django.urls import path

from . import views

app_name = 'products'

urlpatterns = [
    path('public/<str:tenant_slug>/catalog/', views.public_catalog, name='public-catalog'),
    path('public/<str:tenant_slug>/products/<str:product_slug>/', views.public_product_detail, name='public-product-detail'),
]
