from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        "message": "Welcome to Food Delivery API",
        "endpoints": {
            "menus": "/api/menus/",
            "categories": "/api/categories/",
            "orders": "/api/orders/",
            "admin": "/admin/"
        }
    })

urlpatterns = [
    path("", api_root),
    path("admin/", admin.site.urls),
    path("accounts/", include("accounts.urls")),
    path("api/", include("menus.urls")),
    path("api/orders/", include("orders.urls")),  # ✅ ONLY THIS
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
