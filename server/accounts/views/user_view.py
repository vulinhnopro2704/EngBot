from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from accounts.models import UserDetail
from accounts.serializers import UserDetailSerializer



class UserDetailViewSet(viewsets.ModelViewSet):
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserDetail.objects.filter(user=self.request.user)
    
    def retrieve(self, request, *args, **kwargs):
        user_detail, created = UserDetail.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(user_detail)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        user_detail, created = UserDetail.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(user_detail, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get the current user's profile"""
        user_detail, created = UserDetail.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(user_detail)
        return Response(serializer.data)
