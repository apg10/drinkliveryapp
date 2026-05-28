from django.urls import path

from . import views

app_name = 'delivery'

urlpatterns = [
    path('public/<str:tenant_slug>/delivery-zones/', views.public_delivery_zones, name='public-delivery-zones'),
]
