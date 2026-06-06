from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from app.models import User

class RegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'password2', 'phone_number']
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "Bu username band. Boshqa username tanlang."
            )
        return value

    def validate(self, attrs):
        if 'password2' not in attrs:
            raise serializers.ValidationError(
                {"password2": "Parolni tasdiqlash majburiy."}
            )
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Parollar mos kelmadi."}
            )
        try:
            validate_password(attrs['password'])
        except Exception as e:
            raise serializers.ValidationError({"password": list(e.messages)})

        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            phone_number=validated_data.get('phone_number', '')
        )
        return user