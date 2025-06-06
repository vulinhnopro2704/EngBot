from django.contrib import admin
from .models import Lesson, Word, Course, CustomUser, UserCourse, UserLesson, UserWord, LeaderBoard

admin.site.register(Lesson)
admin.site.register(Word)
admin.site.register(Course)
admin.site.register(CustomUser)
admin.site.register(UserCourse)
admin.site.register(UserLesson)
admin.site.register(UserWord)
admin.site.register(LeaderBoard)