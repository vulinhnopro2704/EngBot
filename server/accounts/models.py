import uuid
from datetime import timedelta
from time import time

from cloudinary.models import CloudinaryField
from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    email_verified = models.BooleanField(default=False)
    verification_token = models.UUIDField(default=uuid.uuid4, unique=True, null=True, blank=True)
    avatar = models.URLField(max_length=255, null=True, blank=True)

    # for social login
    is_social = models.BooleanField(default=False)
    provider = models.CharField(max_length=50, null=True, blank=True)  # 'google', 'facebook', etc.
    social_uid = models.CharField(max_length=255, null=True, blank=True, unique=True)  # id của Google user


class UserDetail(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='user_detail')
    name = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    birthday = models.DateField(blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    language = models.CharField(max_length=50, blank=True, null=True)
    joined_date = models.DateTimeField(auto_now_add=True)
    level = models.CharField(max_length=50, blank=True, null=True)
    streak = models.IntegerField(default=0)
    completed_lessons = models.IntegerField(default=0)
    total_lessons = models.IntegerField(default=0)
    completed_topics = models.IntegerField(default=0)
    total_topics = models.IntegerField(default=0)
    learning_time = models.DurationField(default=timedelta(0))
    subscription = models.CharField(max_length=50, blank=True, null=True)
    subscription_expiry = models.DateTimeField(blank=True, null=True)
    payment_method = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    objects = models.Manager()

    def __str__(self):
        return self.user.username

    class Meta:
        db_table = 'user_detail'
        verbose_name = 'User Detail'
        verbose_name_plural = 'User Details'
        ordering = ['-joined_date']
