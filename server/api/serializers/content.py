from rest_framework import serializers
from ..models import Word, Lesson, Course, LeaderBoard


class WordSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    audio = serializers.SerializerMethodField()

    class Meta:
        model = Word
        fields = ['id', 'word', 'pronunciation', 'pos', 'meaning', 'example', 'example_vi', 'image', 'audio', 'cefr']

    def get_image(self, obj):
        return obj.image.url if obj.image else None

    def get_audio(self, obj):
        return obj.audio.url if obj.audio else None


class LessonSerializer(serializers.ModelSerializer):
    words = WordSerializer(many=True, read_only=True, source='word_set')  # Lấy danh sách Word của Lesson
    image = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = '__all__' 

    def get_image(self, obj):
        return obj.image.url if obj.image else None


class OnlyLessonSerializer(serializers.ModelSerializer):
    word_count = serializers.IntegerField(read_only=True)  # Thêm field word_count từ annotate()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = ['id', 'title', 'description', 'image', 'word_count']

    def get_image(self, obj):
        return obj.image.url if obj.image else None


class CourseSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = '__all__'

    def get_image(self, obj):
        return obj.image.url if obj.image else None

class LeaderBoardSerializer(serializers.ModelSerializer):
    """
    Serializer cho bảng xếp hạng người dùng.
    """
    username = serializers.CharField(source='user.username', read_only=True)
    avatar = serializers.SerializerMethodField()
    class Meta:
        model = LeaderBoard
        fields = ['username', 'total_score', 'avatar']
        read_only_fields = ['username', 'total_score', 'avatar']

    def get_avatar(self, obj):
        return obj.user.avatar