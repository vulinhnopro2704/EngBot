from django.db.models import OuterRef, Subquery, Count, IntegerField, Value
from django.db.models.functions import Coalesce
from rest_framework import viewsets
from rest_framework.decorators import action, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..models import Course, UserCourse, Lesson
from ..pagination import CustomPagination
from ..serializers import UserCourseSerializer, UserLessonSerializer
from django.core.cache import cache

# Subquery để đếm số lesson của một Course
lesson_count_subquery = Lesson.objects.filter(course=OuterRef('pk')) \
    .values('course') \
    .annotate(cnt=Count('id')) \
    .values('cnt')

# Subquery để đếm số user course của một Course
learner_count_subquery = UserCourse.objects.filter(course=OuterRef('pk')) \
    .values('course') \
    .annotate(cnt=Count('id')) \
    .values('cnt')
# @permission_classes([IsAuthenticated])
class UserCourseViewSet(viewsets.ReadOnlyModelViewSet):

    serializer_class = UserCourseSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        queryset = Course.objects.all().order_by('id').annotate(
            lesson_count=Coalesce(Subquery(lesson_count_subquery, output_field=IntegerField()), Value(0)),
            learner_count=Coalesce(Subquery(learner_count_subquery, output_field=IntegerField()), Value(0))
        )
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    @action(detail=True, methods=['get'], url_path='lessons')
    def get_lessons(self, request, pk=None):
        """
        Lấy danh sách các bài học của khóa học cụ thể (có phân trang).
        URL mẫu: /api/user-courses/<course_id>/lessons/
        """
        cache_key = self._generate_cache_key(request)
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)

        course = self.get_object()
        lessons = course.lesson_set.annotate(word_count=Count('word')).order_by('id')

        page = self.paginate_queryset(lessons)
        if page is not None:
            serializer = UserLessonSerializer(page, many=True, context={'request': request})
            paginated_data = self.get_paginated_response(serializer.data).data
            cache.set(cache_key, paginated_data, timeout=60 * 15)
            return Response(paginated_data)

        serializer = UserLessonSerializer(lessons, many=True, context={'request': request})
        cache.set(cache_key, serializer.data, timeout=60 * 15)
        return Response(serializer.data)


    def _generate_cache_key(self, request):
        raw_key = f"usercourses:{request.user.id}:{request.get_full_path()}"
        return raw_key
    
    def list(self, request, *args, **kwargs):
        """
        Lấy danh sách các khóa học của người dùng (có phân trang).
        URL mẫu: /api/user-courses/
        """
        cache_key = self._generate_cache_key(request)
        cached_response = cache.get(cache_key)
        if cached_response is not None:
            return Response(cached_response)
        
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response_data = self.get_paginated_response(serializer.data)
            cache.set(cache_key, response_data.data, timeout=60 * 15)
            return response_data
        
        serializer = self.get_serializer(queryset, many=True)
        response_data = Response(serializer.data)
        cache.set(cache_key, response_data.data, timeout=60 * 15)
        return response_data
