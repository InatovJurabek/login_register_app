from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError

from app.models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "password2"
        ]

    def validate_username(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Username bo'sh bo'lishi mumkin emas."
            )

        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError(
                "Bu username band. Boshqa username tanlang."
            )

        return value

    def validate_email(self, value):
        value = value.lower().strip()

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Bu email allaqachon ro'yxatdan o'tgan."
            )

        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "Parollar mos kelmadi."}
            )

        try:
            validate_password(attrs["password"])
        except ValidationError as e:
            raise serializers.ValidationError(
                {"password": list(e.messages)}
            )

        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )

        return user


class LoginSerializer(serializers.Serializer):
    # "login" maydoni — username yoki email kiritiladi
    login = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        login = attrs.get("login", "").strip()
        password = attrs.get("password", "")

        if not login or not password:
            raise serializers.ValidationError(
                "Login (username yoki email) va parol kiritilishi shart."
            )

        # Email yoki username ekanligini aniqlash
        user = None

        if "@" in login:
            # Email orqali userni topamiz
            try:
                user_obj = User.objects.get(email=login.lower())
                # Topilgan userning username'i bilan authenticate qilamiz
                user = authenticate(
                    username=user_obj.username,
                    password=password
                )
            except User.DoesNotExist:
                pass
        else:
            # Username orqali authenticate qilamiz (case-insensitive)
            try:
                user_obj = User.objects.get(username__iexact=login)
                user = authenticate(
                    username=user_obj.username,
                    password=password
                )
            except User.DoesNotExist:
                pass

        if user is None:
            raise serializers.ValidationError(
                "Login yoki parol noto'g'ri."
            )

        if not user.is_active:
            raise serializers.ValidationError(
                "Bu akkaunt faol emas."
            )

        # Keyingi qadamda view ichida user'ga murojaat qilish uchun
        attrs["user"] = user
        return attrs