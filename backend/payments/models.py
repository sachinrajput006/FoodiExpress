from django.db import models

class Payment(models.Model):
    order_id = models.CharField(max_length=100)
    payment_id = models.CharField(max_length=100, blank=True, null=True)
    signature = models.TextField(blank=True, null=True)
    amount = models.IntegerField()
    status = models.CharField(max_length=20, default="PENDING")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.order_id