from django.urls import path

from . import views

app_name = 'orders'

urlpatterns = [
    path('public/<str:tenant_slug>/orders/<str:order_code>/status/', views.public_order_status, name='public-order-status'),
    path('public/<str:tenant_slug>/orders/', views.public_checkout, name='public-checkout'),
    path('admin/orders/', views.admin_order_list, name='admin-order-list'),
    path('admin/orders/<int:id>/', views.admin_order_detail, name='admin-order-detail'),
    path('admin/orders/<int:id>/status/', views.admin_order_status_update, name='admin-order-status-update'),
    path('admin/orders/<int:id>/payment/', views.admin_order_payment_update, name='admin-order-payment-update'),
    path('admin/orders/<int:id>/delivery-verification/', views.admin_delivery_verification, name='admin-delivery-verification'),
    path('admin/dashboard/summary/', views.admin_dashboard_summary, name='admin-dashboard-summary'),
]
