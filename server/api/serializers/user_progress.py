from rest_framework import serializers

from . import WordSerializer
from ..models import Lesson, Course, UserCourse, UserLesson, UserWord
from ..models import Word
from ..models import Lesson


class UserLessonSerializer(serializers.ModelSerializer):
    is_learned = serializers.SerializerMethodField()
    word_count = serializers.IntegerField(read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = [
            'id',
            'title',
            'description',
            'image',
            'created_at',
            'updated_at',
            'is_learned',
            'word_count'
        ]

    def get_image(self, obj):
        return obj.image.url if obj.image else None

    def get_is_learned(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Kiểm tra nếu có bản ghi UserLesson cho user và lesson này
            return UserLesson.objects.filter(user=request.user, lesson=obj).exists()
        return False


# Serializer cho Course kèm danh sách bài học và trạng thái học của user
class UserCourseSerializer(serializers.ModelSerializer):
    is_learned = serializers.SerializerMethodField()
    # lessons = LessonWithStatusSerializer(many=True, read_only=True, source='lesson_set')
    lesson_count = serializers.IntegerField(read_only=True)  # Thêm field lesson_count từ annotate()
    # nếu bạn đã đặt related_name khác trong model Lesson thì thay đổi cho phù hợp.
    image = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()
    learner_count = serializers.IntegerField(read_only=True)
    class Meta:
        model = Course
        fields = [
            'id',
            'title',
            'en_title',
            'description',
            'image',
            'icon',
            'is_learned',
            'lesson_count',
            'progress',
            'learner_count',
        ]

    def get_image(self, obj):
        return obj.image.url if obj.image else None

    def get_progress(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            total_lessons = obj.lesson_count
            completed_lessons = UserLesson.objects.filter(user=request.user, lesson__course=obj).count()

            if total_lessons > 0:
                return round((completed_lessons / total_lessons) * 100, 2)
        return 0
    
    def get_is_learned(self, obj):
        return self.get_progress(obj) == 100
    


class UserWordInputSerializer(serializers.Serializer):
    word_id = serializers.IntegerField(required=True)
    level = serializers.IntegerField(required=True, min_value=1, max_value=5)
    streak = serializers.IntegerField(required=True, min_value=1, max_value=10)
    # is_correct được yêu cầu nếu is_review = true ở cấp cha; để đây tùy chọn:
    is_correct = serializers.BooleanField(required=False)
    question_type = serializers.CharField(required=True)

    def validate_word_id(self, value):
        if not Word.objects.filter(id=value).exists():
            raise serializers.ValidationError("Từ với ID này không tồn tại.")
        return value


class UserWordOutputSerializer(serializers.ModelSerializer):
    word = WordSerializer()

    class Meta:
        model = UserWord
        fields = '__all__'


class LessonWordsInputSerializer(serializers.Serializer):
    is_review = serializers.BooleanField(required=True)
    lesson_id = serializers.IntegerField(required=False)  # Bắt buộc nếu is_review == false
    words = UserWordInputSerializer(many=True, required=True)

    def validate(self, attrs):
        is_review = attrs.get("is_review")
        lesson_id = attrs.get("lesson_id")
        if not is_review and lesson_id is None:
            raise serializers.ValidationError({
                "lesson_id": "Trường này là bắt buộc khi is_review là False."
            })
        return attrs

    def validate_lesson_id(self, value):
        if not Lesson.objects.filter(id=value).exists():
            raise serializers.ValidationError("Lesson với ID này không tồn tại.")
        return value


class LearnedWordsSerializer(serializers.ModelSerializer):
    word = WordSerializer()

    class Meta:
        model = UserWord
        fields = '__all__'