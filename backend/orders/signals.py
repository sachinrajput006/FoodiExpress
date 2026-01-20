from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from .models import Order
from .utils import send_order_html_email
from datetime import datetime


@receiver(pre_save, sender=Order)
def store_old_status(sender, instance, **kwargs):
    if instance.pk:
        try:
            old_order = Order.objects.get(pk=instance.pk)
            instance._old_status = old_order.status
        except Order.DoesNotExist:
            instance._old_status = None


@receiver(post_save, sender=Order)
def order_status_email(sender, instance, created, **kwargs):
    if created:
        return

    old_status = getattr(instance, "_old_status", None)

    # ❌ status same → no email
    if old_status == instance.status:
        return

    context = {
        "order": instance,
        "user": instance.user,
        "frontend_url": "http://localhost:5173/orders",
        "year": datetime.now().year
    }

    if instance.status == "confirmed":
        send_order_html_email(
            "✅ Order Confirmed",
            "emails/order_confirmed.html",
            context,
            instance.user.email
        )

    elif instance.status == "delivered":
        send_order_html_email(
            "🍽️ Order Delivered",
            "emails/order_delivered.html",
            context,
            instance.user.email
        )

    elif instance.status == "cancelled":
        send_order_html_email(
            "❌ Order Cancelled",
            "emails/order_cancelled.html",
            context,
            instance.user.email
        )
