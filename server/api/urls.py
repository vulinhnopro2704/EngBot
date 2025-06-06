from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from rest_framework.routers import DefaultRouter

from .views import LessonViewSet, CourseViewSet, UserCourseViewSet, UserLessonViewSet, UserWordViewSet
from .views.leader_board_views import LeaderBoardViewSet

router = DefaultRouter()
router.register(r'lessons', LessonViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'user-courses', UserCourseViewSet, basename='user-course')
router.register(r'user-lessons', UserLessonViewSet, basename='user-lesson') 
router.register(r'user-words', UserWordViewSet, basename='user-word')
router.register(r'leaderboard', LeaderBoardViewSet, basename='leaderboard')

urlpatterns = [
    path('', include(router.urls)),
    # Endpoint trả về schema OpenAPI (JSON)
    path('schema/', SpectacularAPIView.as_view(), name='schema'),

    # Giao diện Swagger UI
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    # Giao diện Redoc UI (tùy chọn)
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
