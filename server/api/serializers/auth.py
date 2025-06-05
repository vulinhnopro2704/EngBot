from rest_framework import serializers
from ..models import CustomUser
from django.contrib.auth import password_validation

class UserRegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ["username", "email", "password", "password2"]

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password": "Mật khẩu không khớp!"})
        if CustomUser.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "Tên đăng nhập đã tồn tại!"})
        if CustomUser.objects.filter(email=attrs["email"]).exists():
            raise serializers.ValidationError({"email": "Email đã được sử dụng!"})
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")  
        user = CustomUser.objects.create_user(**validated_data, is_active=False)
        user.is_active = False
        user.save()
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Mật khẩu cũ không đúng!")
        return value

    def validate(self, attrs):
        new_password = attrs.get("new_password")
        confirm_new_password = attrs.get("confirm_new_password")
        if new_password != confirm_new_password:
            raise serializers.ValidationError("Mật khẩu mới và xác nhận mật khẩu không trùng khớp!")
        password_validation.validate_password(new_password, self.context["request"].user)
        return attrs
    
class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()
