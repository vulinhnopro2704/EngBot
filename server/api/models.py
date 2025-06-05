from cloudinary.models import CloudinaryField
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.utils.timezone import now

from accounts.models import CustomUser


class Course(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    en_title = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    image = CloudinaryField('image', blank=True, null=True)  
    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)  
    icon = models.CharField(max_length=10, blank=True, null=True)
    def __str__(self):
        return self.title

class Lesson(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    image = CloudinaryField('image', blank=True, null=True)  # Hình ảnh bài học
    created_at = models.DateTimeField(auto_now_add=True)  # Lưu thời gian khi tạo
    updated_at = models.DateTimeField(auto_now=True)  # Lưu thời gian khi cập nhật
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True)
    def __str__(self):
        return self.title


class Word(models.Model):
    id = models.AutoField(primary_key=True)
    lesson = models.ForeignKey(Lesson, on_delete=models.SET_NULL, null=True, blank=True)
    word = models.CharField(max_length=255)
    pronunciation = models.CharField(max_length=255, blank=True, null=True)
    pos = models.CharField(max_length=255, blank=True, null=True)
    meaning = models.TextField()
    example = models.TextField(blank=True, null=True)
    example_vi = models.TextField(blank=True, null=True)
    image = CloudinaryField('image', blank=True, null=True)  # Hình ảnh từ vựng
    audio = CloudinaryField('audio', blank=True, null=True)  # Âm thanh từ vựng
    created_at = models.DateTimeField(default=now, editable=False)
    updated_at = models.DateTimeField(default=now)
    cefr = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self):
        return self.word

class UserCourse(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='course_progress')
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    date_started = models.DateTimeField(auto_now_add=True)
    date_completed = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'course'], name='unique_user_course')
        ]
        ordering = ['-date_started']  # Ví dụ: sắp xếp theo ngày bắt đầu giảm dần

    def __str__(self):
        return f"{self.user.username} - {self.course.title}"

class UserLesson(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='lesson_progress')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    date_started = models.DateTimeField(auto_now_add=True)
    date_completed = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'lesson'], name='unique_user_lesson')
        ]
        ordering = ['-date_started']

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title}"


class UserWord(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='user_words')
    word = models.ForeignKey(Word, on_delete=models.CASCADE, related_name='user_words')
    level = models.PositiveSmallIntegerField(default=1)  
    next_review = models.DateTimeField(default=timezone.now) 
    last_review = models.DateTimeField(auto_now=True)
    streak = models.PositiveIntegerField(default=1)
    learned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'word'], name='unique_user_word')
        ]

    def __str__(self):
        return f"{self.user.username} - {self.word.word} (Level: {self.level})"


class LeaderBoard(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    total_score = models.IntegerField(default=0)  # Điểm số tổng hợp từ các bài học
    date_updated = models.DateTimeField(auto_now=True)  # Thời gian cập nhật điểm số

    class Meta:
        ordering = ['-total_score']

    def __str__(self):
        return f"{self.user.username} - {self.total_score}"