from django.contrib import admin
from datetime import datetime
from .utils import send_order_html_email
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('menu', 'variation', 'quantity', 'price', 'total_price')

    def total_price(self, obj):
        return obj.total_price


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'user', 'status', 'total_amount',
        'payment_method', 'is_paid', 'created_at'
    )

    list_filter = ('status', 'payment_method', 'is_paid')
    readonly_fields = ('total_amount', 'created_at', 'updated_at')
    inlines = [OrderItemInline]

    actions = ['mark_confirmed', 'mark_preparing', 'mark_ready', 'mark_delivered', 'mark_cancelled']

    # ✅ IMPORTANT: LOOP + save()
    def mark_confirmed(self, request, queryset):
        for order in queryset:
            order.status = 'confirmed'
            order.save()   # 🔥 post_save → email
            send_order_html_email(
                "✅ Order Confirmed",
                "emails/order_confirmed.html",
                {
                    "order": order,
                    "user": order.user,
                    "frontend_url": "http://localhost:5173/orders",
                    "year": datetime.now().year
                },
                order.user.email
            )

    def mark_preparing(self, request, queryset):
        for order in queryset:
            order.status = 'preparing'
            order.save()

    def mark_ready(self, request, queryset):
        for order in queryset:
            order.status = 'ready'
            order.save()

    def mark_delivered(self, request, queryset):
        for order in queryset:
            order.status = 'delivered'
            order.is_paid = True
            order.save()   # 🔥 post_save → email
            send_order_html_email(
                "🍽️ Order Delivered",
                "emails/order_delivered.html",
                {
                    "order": order,
                    "user": order.user,
                    "frontend_url": "http://localhost:5173/orders",
                    "year": datetime.now().year
                },
                order.user.email
            )
    
    def mark_cancelled(self, request, queryset):
        for order in queryset:
            order.status = 'cancelled'
            order.save()   # 🔥 post_save → email
            send_order_html_email(
                "❌ Order Cancelled",
                "emails/order_cancelled.html",
                {
                    "order": order,
                    "user": order.user,
                    "frontend_url": "http://localhost:5173/orders",
                    "year": datetime.now().year
                },
                order.user.email
            )
