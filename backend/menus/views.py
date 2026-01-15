from rest_framework import generics, filters, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from django.db.models import Q
from .models import Menu, MenuCategory, MenuVariation
from .serializers import MenuSerializer, MenuCategorySerializer, MenuVariationSerializer

class MenuListCreateView(generics.ListCreateAPIView):
    queryset = Menu.objects.filter(is_active=True)
    serializer_class = MenuSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'rating', 'created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        is_vegetarian = self.request.query_params.get('vegetarian')
        is_vegan = self.request.query_params.get('vegan')
        is_gluten_free = self.request.query_params.get('gluten_free')

        if category:
            queryset = queryset.filter(category__name__icontains=category)
        if is_vegetarian == 'true':
            queryset = queryset.filter(is_vegetarian=True)
        if is_vegan == 'true':
            queryset = queryset.filter(is_vegan=True)
        if is_gluten_free == 'true':
            queryset = queryset.filter(is_gluten_free=True)

        return queryset

class MenuDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer

class MenuCategoryListView(generics.ListAPIView):
    queryset = MenuCategory.objects.filter(is_active=True, parent__isnull=True)
    serializer_class = MenuCategorySerializer
    permission_classes = [AllowAny]

@api_view(['GET'])
def menu_by_category(request, category_id):
    try:
        category = MenuCategory.objects.get(id=category_id, is_active=True)
        menus = Menu.objects.filter(category=category, is_active=True)
        serializer = MenuSerializer(menus, many=True)
        return Response(serializer.data)
    except MenuCategory.DoesNotExist:
        return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def search_menus(request):
    query = request.query_params.get('q', '')
    menus = Menu.objects.filter(
        Q(name__icontains=query) | Q(description__icontains=query),
        is_active=True
    )
    serializer = MenuSerializer(menus, many=True)
    return Response(serializer.data)
