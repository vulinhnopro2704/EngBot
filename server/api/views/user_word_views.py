from django.db.models import Count, Case, When, IntegerField
from rest_framework import viewsets, status
from rest_framework.decorators import action, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.cache import cache
from django.utils import timezone
from ..models import UserWord, UserLesson, UserCourse, LeaderBoard
from ..pagination import LearnedWordsPagination
from ..serializers import (
    UserWordInputSerializer, UserWordOutputSerializer, LessonWordsInputSerializer
)
from ..serializers.user_progress import LearnedWordsSerializer
from ..utils.calculate_next_review import calculate_next_review, calculate_time_until_next_review
from ..utils.get_review_ready_words import get_review_ready_words

@permission_classes([IsAuthenticated])
class UserWordViewSet(viewsets.ModelViewSet):
    queryset = UserWord.objects.all()
    serializer_class = UserWordOutputSerializer

    def get_queryset(self):
        # Chỉ lấy dữ liệu của user hiện tại và lấy luôn thông tin của word
        return UserWord.objects.filter(user=self.request.user).select_related('word')

    @action(detail=False, methods=['post'], url_path='submit-words')
    def submit_words(self, request):
        """
        Input:
        {
            "is_review": true,
            "lesson_id": 12,          // Bắt buộc khi is_review là false
            "words": [
                {
                    "word_id": 123,
                    "level": 2,
                    "streak": 3,
                    "is_correct": true,
                    "question_type": "L2"
                },
                {
                    "word_id": 124,
                    "level": 3,
                    "streak": 2,
                    "is_correct": false,
                    "question_type": "L1"
                }
            ]
        }
        """
        parent_serializer = LessonWordsInputSerializer(data=request.data)
        parent_serializer.is_valid(raise_exception=True)
        validated_data = parent_serializer.validated_data

        is_review = validated_data['is_review']
        lesson_id = validated_data.get('lesson_id', None)
        words_data = validated_data['words']
        user = request.user

        processed_words = []
        update_list = []
        score = 0
        for word_data in words_data:
            word_id = word_data['word_id']
            question_type = word_data['question_type']
            is_correct = word_data.get('is_correct', None)

            if not is_review:
                # Nếu không phải ôn, reset level và streak
                score += 1
                new_level = 1
                new_streak = 1
            else:
                level = word_data['level']
                streak = word_data['streak']
                if is_correct is False:
                    new_streak = 1
                    new_level = max(level - 1, 1)
                else:
                    score += level
                    new_streak = min(10, streak + 1)
                    new_level = min(level + 1, 5)

            next_review_value = calculate_next_review(new_level, new_streak, question_type)
            # Tìm hoặc tạo đối tượng UserWord
            user_word, created = UserWord.objects.get_or_create(    
                user=user,
                word_id=word_id,
                defaults={
                    'level': new_level,
                    'streak': new_streak,
                    'next_review': next_review_value,
                }
            )
            if not created:
                # Nếu đã tồn tại thì cập nhật các trường
                user_word.level = new_level
                user_word.streak = new_streak
                user_word.next_review = next_review_value
                update_list.append(user_word)
            processed_words.append(user_word)

        # Bulk update cho các đối tượng đã thay đổi
        if update_list:
            UserWord.objects.bulk_update(update_list, ['level', 'streak', 'next_review'])

        # Nếu is_review = false, cần cập nhật trạng thái cho UserLesson
        if not is_review and lesson_id is not None:
            user_lesson, created_lesson = UserLesson.objects.get_or_create(
                user=user,
                lesson_id=lesson_id,
                defaults={
                    'date_started': timezone.now(),
                    'date_completed': timezone.now(),
                }
            )

            if not created_lesson:
                user_lesson.date_completed = timezone.now()
                user_lesson.save()

            UserCourse.objects.get_or_create(
                user=user,
                course=user_lesson.lesson.course,
            )

        if LeaderBoard.objects.filter(user=user).exists():
            leaderboard = LeaderBoard.objects.get(user=user)
            leaderboard.total_score += score
            leaderboard.save()
        else:
            LeaderBoard.objects.create(user=user, total_score=score)



        output_serializer = UserWordOutputSerializer(processed_words, many=True, context={'request': request})
        response_data = {
            "is_review": is_review,
            "lesson_id": lesson_id,
            "words": output_serializer.data,
        }

        if not is_review:
            pattern = f"usercourses:{user.id}:*"
            # Xóa cache cho tất cả các khóa học của user
            cache.delete_pattern(pattern) if hasattr(cache, 'delete_pattern') else cache.delete_many(cache.keys(pattern))

        cache.delete(f"count_words_by_level_{user.id}")
        cache.delete(f"learned_words_{user.id}")

        return Response(response_data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='get-words')
    def get_words(self, request):
        # Sử dụng get_queryset đã tối ưu với select_related
        words = self.get_queryset()
        serializer = UserWordOutputSerializer(words, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='count_words-by-level')
    def count_words_by_level(self, request):
        user = request.user
        cache_key = f"count_words_by_level_{user.id}"
        cached_data = cache.get(cache_key)
        if cached_data is not None:
            cached_data['time_until_next_review'] = calculate_time_until_next_review(cached_data['cutoff_time'])
            return Response(cached_data, status=status.HTTP_200_OK)
        
        queryset = self.get_queryset()
        cutoff_time, due_words = get_review_ready_words(request.user)

        time_until_next_review = calculate_time_until_next_review(cutoff_time)
        # Đếm số từ theo từng level (trường 'level' của UserWord)
        level_counts = queryset.values('level').annotate(count=Count('id'))
        
        # Tính nhóm CEFR dựa trên trường word__cefr của model Word:
        #   basic: A1, A2
        #   intermediate: B1, B2
        #   advanced: C1, C2
        cefr_group_counts = queryset.aggregate(
            basic=Count(
                Case(When(word__cefr__in=["A1", "A2"], then=1), output_field=IntegerField())
            ),
            intermediate=Count(
                Case(When(word__cefr__in=["B1", "B2"], then=1), output_field=IntegerField())
            ),
            advanced=Count(
                Case(When(word__cefr__in=["C1", "C2"], then=1), output_field=IntegerField())
            )
        )
        
        result = {
            "level_counts": {f"count_level{item['level']}": item['count'] for item in level_counts},
            "cefr_group_counts": cefr_group_counts,
            "time_until_next_review": time_until_next_review,
            "review_word_count": due_words.count(),
            "cutoff_time": cutoff_time,
        }

        cache.set(cache_key, result, timeout=60*15)
        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='learned-words')
    def learned_words(self, request):
        cache_key = f"learned_words_{request.user.id}"
        cached_data = cache.get(cache_key)
        if cached_data is not None:
            cached_data['time_until_next_review'] = calculate_time_until_next_review(cached_data['cutoff_time'])
            return Response(cached_data, status=status.HTTP_200_OK)
        
        queryset = self.get_queryset()
        # Tính thời gian đến lượt ôn tiếp theo
        cutoff_time, due_words = get_review_ready_words(request.user)
        time_until_next_review = calculate_time_until_next_review(cutoff_time) 

        # Đếm số từ theo từng level (1 đến 5)
        level_counts_qs = queryset.values('level').annotate(count=Count('id'))
        level_counts = {f"count_level{item['level']}": item['count'] for item in level_counts_qs}

        # Chuẩn bị kết quả trả về, bao gồm thời gian ôn và số từ cần ôn
        result = {
            "time_until_next_review": time_until_next_review,
            "review_word_count": due_words.count(),
            "level_counts": level_counts,
            "cutoff_time": cutoff_time,
        }
        
        # Với mỗi level, lấy 10 dữ liệu đầu tiên
        for level in range(1, 6):
            level_qs = queryset.filter(level=level).order_by('id')
            words = level_qs[:10]
            serializer = LearnedWordsSerializer(words, many=True, context={'request': request})
            result[f"words_level{level}"] = serializer.data
            # Nếu muốn thêm lại số đếm từng level riêng (nếu chưa có trong level_counts)
            # result[f"count_level{level}"] = level_qs.count()

        # Lưu vào cache
        cache.set(cache_key, result, timeout=60*15)
        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='review-words')
    def review_words(self, request):
        # Hàm get_review_ready_words() trả về cutoff_time và danh sách từ cần ôn
        cutoff_time, due_words = get_review_ready_words(request.user)
        # nếu cutoff_time > timezone.now() thì không có từ nào cần ôn
        if cutoff_time > timezone.now():
            return Response({"message": "No words to review"}, status=status.HTTP_200_OK)
        serializer = UserWordOutputSerializer(due_words, many=True, context={'request': request})
        response_data = {
            "words": serializer.data,
        }
        return Response(response_data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], url_path='learned-words-pagination')
    def learned_words_pagination(self, request):
        queryset = self.get_queryset()
        paginator = LearnedWordsPagination()
        level = request.query_params.get('level', None)
        if level is not None:
            queryset = queryset.filter(level=level)
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        serializer = LearnedWordsSerializer(paginated_queryset, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

