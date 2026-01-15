from django.contrib import admin
from .models import MenuCategory, MenuVariation, Menu

@admin.register(MenuCategory)
class MenuCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'parent', 'is_active')
    list_filter = ('is_active', 'parent')
    search_fields = ('name', 'description')

@admin.register(MenuVariation)
class MenuVariationAdmin(admin.ModelAdmin):
    list_display = ('name', 'price_modifier', 'is_default')
    list_filter = ('is_default',)

@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'base_price', 'is_active', 'is_vegetarian', 'is_vegan', 'is_gluten_free', 'calories', 'preparation_time')
    list_filter = ('is_active', 'is_vegetarian', 'is_vegan', 'is_gluten_free', 'category')
    search_fields = ('name', 'description')
    filter_horizontal = ('variations',)
