from django.urls import path
from .views import (
    CreateOrderAPIView,
    MyOrdersAPIView,
    OrderDetailAPIView,
    AdminOrderListAPIView,
    UpdateOrderStatusAPIView,
    CancelOrderView,
    ReOrderView,
    CreateOrderRatingView,
    GetOrderRatingView,
    OrderInvoiceView,
)

urlpatterns = [
    # User
    path("", MyOrdersAPIView.as_view()),                 # GET /api/orders/
    path("create/", CreateOrderAPIView.as_view()),       # POST /api/orders/create/
    path("<int:pk>/", OrderDetailAPIView.as_view()),     # GET /api/orders/1/
    path("<int:pk>/cancel/", CancelOrderView.as_view()), # PATCH

    # Admin
    path("admin/", AdminOrderListAPIView.as_view()),     # GET
    path("<int:pk>/status/", UpdateOrderStatusAPIView.as_view()),  # PATCH

    # Additional features
    path("<int:pk>/reorder/", ReOrderView.as_view()),    # POST
    path("<int:pk>/rate/", CreateOrderRatingView.as_view()),  # POST
    path("<int:pk>/rating/", GetOrderRatingView.as_view()),   # GET
    path("<int:pk>/invoice/", OrderInvoiceView.as_view()),     # GET
]
