from django.contrib import admin
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
        'id',
        'user',
        'status',
        'total_amount',
        'payment_method',
        'is_paid',
        'created_at',
    )

    list_filter = ('status', 'payment_method', 'is_paid')
    search_fields = ('id', 'user__username')
    readonly_fields = ('total_amount', 'created_at', 'updated_at')

    fieldsets = (
        ('Customer Info', {
            'fields': ('user', 'delivery_address', 'special_instructions')
        }),
        ('Order Status', {
            'fields': ('status', 'payment_method', 'is_paid')
        }),
        ('Amount', {
            'fields': ('total_amount',)
        }),
        ('Timeline', {
            'fields': ('created_at', 'updated_at')
        }),
    )

    inlines = [OrderItemInline]

    # ✅ ADMIN ACTIONS
    actions = ['mark_confirmed', 'mark_preparing', 'mark_ready', 'mark_delivered']

    def mark_confirmed(self, request, queryset):
        queryset.update(status='confirmed')
    mark_confirmed.short_description = "Mark selected orders as Confirmed"

    def mark_preparing(self, request, queryset):
        queryset.update(status='preparing')
    mark_preparing.short_description = "Mark selected orders as Preparing"

    def mark_ready(self, request, queryset):
        queryset.update(status='ready')
    mark_ready.short_description = "Mark selected orders as Ready"

    def mark_delivered(self, request, queryset):
        queryset.update(status='delivered', is_paid=True)
    mark_delivered.short_description = "Mark selected orders as Delivered"


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'menu', 'variation', 'quantity', 'price')
