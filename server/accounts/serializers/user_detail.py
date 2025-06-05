from rest_framework import serializers

from accounts.models import UserDetail


class UserDetailSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    avatar = serializers.URLField(source='user.avatar', read_only=True)
    joinedDate = serializers.DateTimeField(source='joined_date', read_only=True)
    completedLessons = serializers.IntegerField(source='completed_lessons')
    totalLessons = serializers.IntegerField(source='total_lessons')
    completedTopics = serializers.IntegerField(source='completed_topics')
    totalTopics = serializers.IntegerField(source='total_topics')
    learningTime = serializers.DurationField(source='learning_time')
    subscriptionExpiry = serializers.DateTimeField(source='subscription_expiry', allow_null=True)
    paymentMethod = serializers.CharField(source='payment_method', allow_blank=True, allow_null=True)

    class Meta:
        model = UserDetail
        fields = [
            'name', 'email', 'avatar', 'phone', 'birthday', 'address', 'bio',
            'language', 'joinedDate', 'level', 'streak', 'completedLessons',
            'totalLessons', 'completedTopics', 'totalTopics', 'learningTime',
            'subscription', 'subscriptionExpiry', 'paymentMethod'
        ]
