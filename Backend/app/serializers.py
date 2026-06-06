from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from app.models import User
from django.core.exceptions import ValidationError

class RegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'password2']
    
    def validate_username(self, value):
        if not value:
            raise serializers.ValidationError(
                "Username bo'sh bo'lishi mumkin emas."
        )
            
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "Bu username band. Boshqa username tanlang."
            )
        return value

    def validate_username(self, value):
        return value.strip()

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Parollar mos kelmadi."}
            )
        try:
            validate_password(attrs['password'])
        except ValidationError as e:
            raise serializers.ValidationError(
                {"password": list(e.messages)}
            )
        except Exception as e:
            raise serializers.ValidationError({"password": list(e.messages)})

        return attrs


    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Bu email allaqachon ro'yxatdan o'tgan."
        )
        return value
    
    def validate_email(self, value):
        return value.lower()
    
    def create(self, validated_data):
        validated_data.pop('password2')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            phone_number=validated_data.get('phone_number', '')
        )
        return user