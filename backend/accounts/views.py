from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.conf import settings
from .serializers import RegisterSerializer, UserSerializer
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated



User = get_user_model()
token_generator = PasswordResetTokenGenerator()


# ✅ Register User + Send Welcome Email
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Styled Welcome Email
        try:
            html_content = render_to_string("emails/welcome_email.html", {"user": user})
            email = EmailMultiAlternatives(
                subject="🎉 Welcome to Foodie Express!",
                body="Welcome to Foodie Express",
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[user.email],
            )
            email.attach_alternative(html_content, "text/html")
            email.send()
            print("✅ Welcome email sent to", user.email)
        except Exception as e:
            print("❌ Email sending failed:", e)

        return Response(
            UserSerializer(user).data,
            status=status.HTTP_201_CREATED
        )

# ✅ Login with JWT
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        # With backend, authenticate will now work with username, email, or phone
        user = authenticate(request, username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": UserSerializer(user).data,
            }, status=status.HTTP_200_OK)

        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

# ✅ Logout (Blacklist Refresh Token)
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Profile View

class ProfileView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


# Update Profile
class ProfileUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    partial = True  # Allow partial updates

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', self.partial)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


# ✅ Password Reset Request (Send Styled Email with Button)
class PasswordResetRequestView(APIView):
    permission_classes = []

    def post(self, request):
        email = request.data.get("email")
        try:
            user = User.objects.get(email=email)
            token = token_generator.make_token(user)
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))

            frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:5173")
            reset_link = f"{frontend_url}/reset-password-confirm/{uidb64}/{token}/"

            # Styled Password Reset Email
            html_content = render_to_string("emails/password_reset_email.html", {
                "user": user,
                "reset_link": reset_link
            })
            email_obj = EmailMultiAlternatives(
                subject="🔑 Reset Your Foodie Express Password",
                body="Use the button below to reset password",
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[user.email],
            )
            email_obj.attach_alternative(html_content, "text/html")
            email_obj.send()

        except User.DoesNotExist:
            pass  # security: don't reveal email existence

        return Response({"message": "If the email exists, a reset link has been sent."}, status=200)

# ✅ Confirm Password Reset
class PasswordResetConfirmView(APIView):
    permission_classes = []

    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except Exception as e:
            print("❌ Error decoding UID:", e)
            return Response({"error": "Invalid UID"}, status=400)

        if not token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token."}, status=400)

        new_password = request.data.get("new_password")
        if not new_password:
            return Response({"error": "New password is required."}, status=400)

        user.set_password(new_password)
        user.save()
        return Response({"message": "Password has been reset successfully."}, status=200)


# ✅ Email Login (alternative to username)
class EmailLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(request, username=email, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": UserSerializer(user).data,
            }, status=status.HTTP_200_OK)

        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
    

