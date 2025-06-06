from random import randint
from django.utils import timezone
from datetime import timedelta

# Giả sử bạn đã định nghĩa level_time và question_type_times ở đâu đó, ví dụ:
level_time = [0.5, 2.5, 12.5, 62.5, 312.5]  # Giá trị cơ bản theo level (1-5)
question_type_times = {
    "L1": 1,
    "L2": 1.1,
    "L3": 1.2,
    "L4": 1.3,
    "L5": 1.5,
}

def calculate_next_review(level, streak, question_type):
    """
    Tính toán thời gian ôn tập tiếp theo dựa trên level, streak và question_type,
    cộng thêm một số phút ngẫu nhiên.
    
    :param level: int, ví dụ từ 1 đến 5
    :param streak: int, số lần ôn tập liên tục
    :param question_type: str, ví dụ "L1", "L2", ...
    :return: datetime, thời điểm next_review
    """
    # Tính số giờ cơ bản
    base_hours = streak * question_type_times[question_type] * level_time[level - 1]
    # Tạo offset ngẫu nhiên theo phút (ví dụ từ 0 đến 59 phút)
    rand_minutes = randint(0, 59)
    # Tính toán next_review bằng cách cộng thêm base_hours và rand_minutes
    next_review = timezone.now() + timedelta(hours=base_hours, minutes=rand_minutes)
    return next_review

def calculate_time_until_next_review(cutoff_time):
    """
    Tính toán thời gian còn lại cho đến lần ôn tập tiếp theo.
    :param cutoff_time: datetime, thời điểm ôn tập tiếp theo
    :return: dict, chứa hours, minutes, seconds còn lại
    """
    delta = cutoff_time - timezone.now()
    total_seconds = int(delta.total_seconds())
    hours, remainder = divmod(total_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    if hours < 0:
        hours = minutes = seconds = 0
    time_until_next_review = {"hours": hours, "minutes": minutes, "seconds": seconds}
    return time_until_next_review