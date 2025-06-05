from .content import (
    WordSerializer,
    LessonSerializer,
    OnlyLessonSerializer,
    CourseSerializer,
    LeaderBoardSerializer
)

from .auth import (
    UserRegisterSerializer,
    UserLoginSerializer,
    ChangePasswordSerializer,
    ResetPasswordSerializer,
    LogoutSerializer
)

from .user_progress import (
    UserLessonSerializer,
    UserCourseSerializer,
    UserWordInputSerializer,
    UserWordOutputSerializer,
    LessonWordsInputSerializer
)

# Export all serializers
__all__ = [
    'WordSerializer',
    'LessonSerializer',
    'OnlyLessonSerializer',
    'CourseSerializer',
    'UserRegisterSerializer',
    'UserLoginSerializer',
    'ChangePasswordSerializer',
    'ResetPasswordSerializer',
    'LogoutSerializer',
    'UserLessonSerializer',
    'UserCourseSerializer',
    'UserWordInputSerializer',
    'UserWordOutputSerializer',
    'LessonWordsInputSerializer',
    'LeaderBoardSerializer'
]
