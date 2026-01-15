from django.db import models

# Create your models here.

class MenuCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subcategories')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class MenuVariation(models.Model):
    name = models.CharField(max_length=100)  # e.g., Small, Medium, Large
    price_modifier = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Menu(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(MenuCategory, on_delete=models.CASCADE, related_name='menus')
    base_price = models.DecimalField(max_digits=8, decimal_places=2)
    variations = models.ManyToManyField(MenuVariation, blank=True, related_name='menus')
    is_active = models.BooleanField(default=True)
    is_vegetarian = models.BooleanField(default=False)
    is_vegan = models.BooleanField(default=False)
    is_gluten_free = models.BooleanField(default=False)
    calories = models.IntegerField(blank=True, null=True)
    preparation_time = models.IntegerField(help_text="Time in minutes", blank=True, null=True)
    available_from = models.TimeField(blank=True, null=True)
    available_to = models.TimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    image = models.ImageField(upload_to='menu_images/', blank=True, null=True)
    rating = models.FloatField(default=0.0)
    num_reviews = models.IntegerField(default=0)

    def __str__(self):
        return self.name

    @property
    def price(self):
        return self.base_price
