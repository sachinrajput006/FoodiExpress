from rest_framework import serializers
from .models import Menu, MenuCategory, MenuVariation


class MenuVariationSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuVariation
        fields = '__all__'


# 🔹 Simple serializer (NO recursion)
class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuCategory
        fields = ['id', 'name', 'description', 'is_active']


# 🔹 Main Category serializer
class MenuCategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()

    class Meta:
        model = MenuCategory
        fields = ['id', 'name', 'description', 'parent', 'is_active', 'subcategories']

    def get_subcategories(self, obj):
        qs = obj.subcategories.filter(is_active=True)
        return SubCategorySerializer(qs, many=True).data


class MenuSerializer(serializers.ModelSerializer):
    category = MenuCategorySerializer(read_only=True)
    variations = MenuVariationSerializer(many=True, read_only=True)
    price = serializers.ReadOnlyField()

    class Meta:
        model = Menu
        fields = '__all__'
