from django.urls import path
from . import views

urlpatterns = [
    path('menus/', views.MenuListCreateView.as_view(), name='menu-list-create'),
    path('menus/<int:pk>/', views.MenuDetailView.as_view(), name='menu-detail'),
    path('categories/', views.MenuCategoryListView.as_view(), name='category-list'),
    path('categories/<int:category_id>/menus/', views.menu_by_category, name='menus-by-category'),
    path('search/', views.search_menus, name='menu-search'),
]
