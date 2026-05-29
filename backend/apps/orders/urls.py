from django.urls import path

from . import views

app_name = 'orders'

urlpatterns = [
    path('public/<str:tenant_slug>/orders/', views.public_checkout, name='public-checkout'),
]
