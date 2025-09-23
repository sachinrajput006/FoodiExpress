from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
import random

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("email", "password", "password2", "first_name", "last_name", "phone", "avatar")
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, data):
        if data["password"] != data["password2"]:
            raise serializers.ValidationError({"password2": "Passwords do not match"})
        return data

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered")
        return value

    def create(self, validated_data):
        validated_data.pop("password2")
        first_name = validated_data.get("first_name", "").replace(" ", "").upper()
        
        alt_code = str(random.randint(1000, 9999))

        username = f"{first_name}{alt_code}"
        user = User.objects.create_user(
            username=username,
            email=validated_data["email"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            phone=validated_data.get("phone", ""),
            avatar=validated_data.get("avatar", None),
            password=validated_data["password"]
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(source='avatar', required=False)

    class Meta:
        model = User
        fields = ("id", "username", "first_name", "last_name", "email", "phone", "avatar", "profile_picture", "gender", "address", "city", "state", "country", "zip_code", "date_of_birth")

    def validate_phone(self, value):
        if value and not value.isdigit():
            raise serializers.ValidationError("Phone number must contain only digits.")
        if value and (len(value) < 10 or len(value) > 15):
            raise serializers.ValidationError("Phone number must be between 10 and 15 digits.")
        return value

    def validate_zip_code(self, value):
        if value and not value.replace(" ", "").isalnum():
            raise serializers.ValidationError("Zip code must contain only letters and numbers.")
        return value

    def validate_email(self, value):
        user = self.instance
        if user and User.objects.filter(email=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("Email already registered")
        return value


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
