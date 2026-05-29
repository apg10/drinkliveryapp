from django.urls import path

from . import views

app_name = 'orders'

urlpatterns = [
    path('public/<str:tenant_slug>/orders/<str:order_code>/status/', views.public_order_status, name='public-order-status'),
    path('public/<str:tenant_slug>/orders/', views.public_checkout, name='public-checkout'),
]
