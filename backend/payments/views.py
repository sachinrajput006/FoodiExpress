import razorpay
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Payment

client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)

@api_view(["POST"])
def create_order(request):
    amount = request.data["amount"]  # in paise

    razorpay_order = client.order.create({
        "amount": amount,
        "currency": "INR",
        "payment_capture": 1
    })

    Payment.objects.create(
        order_id=razorpay_order["id"],
        amount=amount
    )

    return Response({
        "order_id": razorpay_order["id"],
        "key": settings.RAZORPAY_KEY_ID,
        "amount": amount
    })

@api_view(["POST"])
def verify_payment(request):
    data = request.data

    try:
        client.utility.verify_payment_signature({
            "razorpay_order_id": data["order_id"],
            "razorpay_payment_id": data["payment_id"],
            "razorpay_signature": data["signature"]
        })

        payment = Payment.objects.get(order_id=data["order_id"])
        payment.payment_id = data["payment_id"]
        payment.signature = data["signature"]
        payment.status = "SUCCESS"
        payment.save()

        return Response({"status": "Payment Successful"})

    except:
        return Response({"status": "Payment Failed"}, status=400)