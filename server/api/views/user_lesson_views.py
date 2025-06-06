from rest_framework import viewsets
from rest_framework.decorators import action, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from ..models import Lesson, UserLesson
from ..serializers import UserLessonSerializer, WordSerializer
from ..pagination import CustomPagination

@permission_classes([IsAuthenticated])
class UserLessonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Lesson.objects.all().order_by('id').annotate(word_count=Count('word')).prefetch_related('word_set')
    serializer_class = UserLessonSerializer
    pagination_class = CustomPagination

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
    
    @action(detail=True, methods=['get'], url_path='words')
    def get_words(self, request, pk=None):
        """
        Lấy danh sách từ vựng của bài học cụ thể mà không phân trang.
        URL mẫu: /api/user-lessons/<lesson_id>/words/
        """
        
        user_lesson = UserLesson.objects.filter(user=request.user, lesson_id=pk).first()
        if user_lesson:
            return Response(
                {
                    'message': 'Bạn đã hoàn thành bài học này.',
                }
            )

        lesson = self.get_object()
        words = lesson.word_set.all()
        serializer = WordSerializer(words, many=True, context={'request': request})
        return Response(
            {
                'lesson_id': lesson.id,
                'lesson_title': lesson.title,
                'lesson_description': lesson.description,
                'words': serializer.data
            }
        )
