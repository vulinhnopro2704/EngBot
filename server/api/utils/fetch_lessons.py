import requests
import cloudinary.uploader
from concurrent.futures import ThreadPoolExecutor
from api.models import Lesson, Course

# lesson_url = "https://learn.mochidemy.com/_next/data/ouwiOobiRDrduRfgjGBFT/vi/learn/{course_id}.json?courseId={course_id}"
lesson_url = "https://learn.mochidemy.com/_next/data/jqRIFJk7WgjBGC9nBJxa0/vi/learn/{course_id}.json?courseId={course_id}"

headers = {
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMTg3MzcyLCJlbWFpbCI6ImRvdHVhbmd2QGdtYWlsLmNvbSIsInRva2VuIjoiNjdjNWJjM2U5ZDdjYSIsImlwIjoiMTE4LjcxLjIyMS4xOTciLCJleHAiOjE3NzI1NDgwMzB9.7McKOsunhE8UaoV-ADrxLwCuPHlYzekV345CqjQ4sBA",
    "PrivateKey": "M0ch1M0ch1_En_$ecret_k3y",
    "Accept": "application/json"
}

def process_lesson(lesson):
    """Xử lý từng lesson: upload ảnh và lưu vào database."""
    image_url = lesson.get("image", None)
    uploaded_image = None

    if image_url:
        try:
            print(f"🔹 Đang upload ảnh cho bài học {lesson['title']}: {image_url}")
            uploaded_image = cloudinary.uploader.upload(image_url, folder="lessons")
        except Exception as e:
            print(f"❌ Lỗi upload ảnh {image_url}: {e}")

    # Lưu vào database
    try:
        Lesson.objects.update_or_create(
            id=lesson["id"],
            defaults={
                "title": lesson["title"],
                "description": lesson.get("description", ""),
                "image": uploaded_image["secure_url"] if uploaded_image else None,
                "created_at": lesson["created_at"],
                "updated_at": lesson["updated_at"],
            }
        )
        print(f"✅ Đã xử lý xong bài học: {lesson['title']}")
    except Exception as e:
        print(f"❌ Lỗi xử lý bài học {lesson['title']}: {e}")

def fetch_lessons():
    """Lấy danh sách bài học và xử lý chúng bằng đa luồng."""
    course_ids = [16, 17, 11]  # ID của các course cần lấy bài học
    for course_id in course_ids:
        url = lesson_url.format(course_id=course_id)
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            lessons_data = response.json()["pageProps"]["courseData"]

            with ThreadPoolExecutor(max_workers=5) as executor:  # Sử dụng tối đa 5 luồng
                executor.map(process_lesson, lessons_data)

            print("✅ Tất cả bài học đã được xử lý xong!")
        else:
            print(f"❌ Lỗi lấy dữ liệu Lesson: {response.status_code} - {response.text}")



def process_lessons_course(lesson, course):

    # if course.id != 16 and course.id != 17:
    #     print(f"⚠️ Bỏ qua Course {course.title}")
    #     return

    # print(f"🔄 DEBUG: Đang vào process_lessons_course() với bài học ID: {lesson.get('id', 'N/A')}")
    print(f"🔹 Đang xử lý bài học: {lesson['title']}")

    try:
        lesson_db = Lesson.objects.get(id=lesson["id"])
        if lesson_db.course:
            print(f"⚠️ Bài học {lesson['title']} đã có course {lesson_db.course.title}. Bỏ qua!")
            return
        lesson_db.course = course
        lesson_db.save()
        print(f"✅ Đã cập nhật course cho bài học {lesson['title']} với Course {course.title}")
    except Lesson.DoesNotExist:
        print(f"❌ Lỗi: Không tìm thấy bài học {lesson['title']}")
    except Exception as e:
        print(f"❌ Lỗi khi cập nhật bài học {lesson['title']}: {e}")


def update_lessons_course():
    """Cập nhật course cho từng lesson."""
    course_ids = [16, 17, 11]  # ID của các course cần cập nhật
    course_id = 8
    # for _ in range(3):
    for course_id in course_ids:
        course = Course.objects.get(id=course_id)
    #     for course in Course.objects.all():
        url = lesson_url.format(course_id=course.id)
        response = requests.get(url, headers=headers)
        
        if response.status_code != 200:
            print(f"❌ Lỗi API: {response.status_code} - {response.text}")
        
        lessons_data = response.json()["pageProps"]["courseData"]
        print(f"📌 Course {course.title} có {len(lessons_data)} bài học.\n")

        if not lessons_data:
            pass
            # continue  # Không có bài học nào để xử lý

        with ThreadPoolExecutor(max_workers=10) as executor:
            executor.map(process_lessons_course, lessons_data, [course]*len(lessons_data))
        
        print(f"✅ Hoàn thành cập nhật cho Course {course.title}!")


