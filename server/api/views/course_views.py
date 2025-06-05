from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ..models import Course
from ..serializers import CourseSerializer, LessonSerializer
from rest_framework.permissions import AllowAny
from ..pagination import CustomPagination
from django.core.cache import cache 


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by('id')
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]  
    pagination_class = CustomPagination

    @action(detail=True, methods=['GET'], url_path='lessons')
    def get_lessons(self, request, pk=None):
        course = get_object_or_404(Course, pk=pk)
        lessons = course.lesson_set.all()
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)
    
    def _generate_cache_key(self, request):
        raw_key = f"usercourses"
        return raw_key

    @action(detail=False, methods=['GET'], url_path='all_courses')
    def get_all_courses(self, request):
        cache_key = self._generate_cache_key(request)
        cached_response = cache.get(cache_key)
        if cached_response is not None:
            return Response(cached_response)
        
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response_data = self.get_paginated_response(serializer.data)
            cache.set(cache_key, response_data.data, timeout=60 * 60 * 24)
            return response_data
        
        serializer = self.get_serializer(queryset, many=True)
        response_data = Response(serializer.data)
        cache.set(cache_key, response_data.data, timeout=60 * 60 * 24)
        return response_data
        
    

