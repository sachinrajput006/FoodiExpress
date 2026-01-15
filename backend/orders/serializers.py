from rest_framework import serializers
from .models import Order, OrderItem
from menus.models import Menu, MenuVariation
from menus.serializers import MenuSerializer, MenuVariationSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    menu = MenuSerializer(read_only=True)
    variation = MenuVariationSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'menu', 'variation', 'quantity', 'price', 'total_price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'user',
            'items',
            'total_amount',
            'status',
            'delivery_address',
            'special_instructions',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'total_amount', 'created_at', 'updated_at']


class CreateOrderSerializer(serializers.Serializer):
    items = serializers.ListField(
        child=serializers.DictField(),
        allow_empty=False
    )
    delivery_address = serializers.CharField(required=False, allow_blank=True)
    special_instructions = serializers.CharField(required=False, allow_blank=True)

    def create(self, validated_data):
        request = self.context['request']
        user = request.user
        items_data = validated_data['items']

        total_amount = 0
        order_items = []

        for item_data in items_data:
            menu_id = item_data.get('id')
            quantity = item_data.get('qty', 1)
            variation_id = item_data.get('variation_id')

            try:
                menu = Menu.objects.get(id=menu_id)
            except Menu.DoesNotExist:
                raise serializers.ValidationError(
                    {"menu": f"Menu with id {menu_id} does not exist."}
                )

            price = menu.base_price
            variation = None

            if variation_id:
                try:
                    variation = MenuVariation.objects.get(
                        id=variation_id,
                        menu=menu
                    )
                    price += variation.price_modifier
                except MenuVariation.DoesNotExist:
                    raise serializers.ValidationError(
                        {"variation": "Invalid variation for selected menu."}
                    )

            total_amount += price * quantity
            order_items.append({
                'menu': menu,
                'variation': variation,
                'quantity': quantity,
                'price': price,
            })

        order = Order.objects.create(
            user=user,
            total_amount=total_amount,
            delivery_address=validated_data.get('delivery_address', ''),
            special_instructions=validated_data.get('special_instructions', ''),
        )

        for item in order_items:
            OrderItem.objects.create(order=order, **item)

        # Recalculate total after items are created
        order.save()

        return order


class UpdateOrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status']
