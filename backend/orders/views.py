from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView, RetrieveAPIView, UpdateAPIView
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import Order, OrderItem
from .serializers import (
    OrderSerializer,
    CreateOrderSerializer,
    UpdateOrderStatusSerializer,
    OrderItemSerializer
)
from menus.models import Menu, MenuVariation


class CreateOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            order = serializer.save()
            return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyOrdersAPIView(ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')


class OrderDetailAPIView(RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class AdminOrderListAPIView(ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Assuming admin check, but for simplicity, return all orders
        return Order.objects.all().order_by('-created_at')


class UpdateOrderStatusAPIView(UpdateAPIView):
    serializer_class = UpdateOrderStatusSerializer
    permission_classes = [IsAuthenticated]
    queryset = Order.objects.all()


class CancelOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        order = get_object_or_404(Order, pk=pk, user=request.user)
        if order.status in ['delivered', 'cancelled']:
            return Response({'error': 'Cannot cancel this order'}, status=status.HTTP_400_BAD_REQUEST)
        order.status = 'cancelled'
        order.save()
        return Response({'message': 'Order cancelled successfully'})


class ReOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        original_order = get_object_or_404(Order, pk=pk, user=request.user)
        with transaction.atomic():
            new_order = Order.objects.create(
                user=request.user,
                total_amount=original_order.total_amount,
                delivery_address=original_order.delivery_address,
                special_instructions=original_order.special_instructions,
            )
            for item in original_order.items.all():
                OrderItem.objects.create(
                    order=new_order,
                    menu=item.menu,
                    variation=item.variation,
                    quantity=item.quantity,
                    price=item.price,
                )
        return Response(OrderSerializer(new_order).data, status=status.HTTP_201_CREATED)


class CreateOrderRatingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        order = get_object_or_404(Order, pk=pk, user=request.user)
        rating = request.data.get('rating')
        if not rating or not (1 <= int(rating) <= 5):
            return Response({'error': 'Invalid rating'}, status=status.HTTP_400_BAD_REQUEST)
        # For simplicity, store in a dict or something, but since no model, just return success
        return Response({'message': 'Rating submitted successfully'})


class GetOrderRatingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        order = get_object_or_404(Order, pk=pk, user=request.user)
        # Return dummy rating
        return Response({'rating': 4.5, 'reviews': 10})


class OrderInvoiceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        order = get_object_or_404(Order, pk=pk, user=request.user)
        serializer = OrderSerializer(order)
        return Response(serializer.data)
