from django.urls import path
from .views import (
    
    RegisterView,
    LogoutView,
    LoginView,
    EmailLoginView,
    ProfileView,
    ProfileUpdateView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("profile/update/", ProfileUpdateView.as_view(), name="profile-update"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("email-login/", EmailLoginView.as_view(), name="email-login"),

    # ✅ Password reset
    path("password-reset/", PasswordResetRequestView.as_view(), name="password-reset"),
    path(
        "password-reset-confirm/<uidb64>/<token>/",
        PasswordResetConfirmView.as_view(),
        name="password-reset-confirm"
    ),
]
