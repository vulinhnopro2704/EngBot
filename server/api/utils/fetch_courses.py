import requests
import cloudinary.uploader
from concurrent.futures import ThreadPoolExecutor
from api.models import Course  

courses_url = "https://mochien-server.mochidemy.com/v3.0/course/get-course-ios"

headers = {
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoxMTg3MzcyLCJlbWFpbCI6ImRvdHVhbmd2QGdtYWlsLmNvbSIsInRva2VuIjoiNjdjNWJjM2U5ZDdjYSIsImlwIjoiMTE4LjcxLjIyMS4xOTciLCJleHAiOjE3NzI1NDgwMzB9.7McKOsunhE8UaoV-ADrxLwCuPHlYzekV345CqjQ4sBA",
    "PrivateKey": "M0ch1M0ch1_En_$ecret_k3y",
    "Accept": "application/json"
}

def process_course(course):

    if course['id'] != 16 and course['id'] != 17:
        return
    """Xử lý từng course: upload ảnh và lưu vào database."""
    image_url = course.get("image", None)
    uploaded_image = None
    if image_url:
        try:
            print(f"🔹 Đang upload ảnh cho bài học {course['title']}: {image_url}")
            uploaded_image = cloudinary.uploader.upload(image_url, folder="courses")
        except Exception as e:
            print(f"❌ Lỗi upload ảnh {image_url}: {e}")

    # Lưu vào database
    Course.objects.update_or_create(
        id=course["id"],
        defaults={
            "title": course["title"],
            "en_title": course["en_title"],
            "description": course.get("description", ""),
            "image": uploaded_image["secure_url"] if uploaded_image else None,
        }
    )

    try:
        print(f"🔹 Đang xử lý khóa học: {course['title']}")
        Course.objects.update_or_create(
            id=course["id"],
            defaults={
                "title": course["title"],
                "en_title": course["en_title"],
                "description": course.get("description", ""),
                "image": uploaded_image["secure_url"] if uploaded_image else None,
            }
        )
        print(f"✅ Đã xử lý xong khóa học: {course['title']}")
    except Exception as e:
        print(f"❌ Lỗi xử lý khóa học {course['title']}: {e}")
        return

    print(f"✅ Đã xử lý xong khóa học: {course['title']}")

def fetch_courses():
    """Lấy danh sách bài học và xử lý chúng bằng đa luồng."""
    response = requests.get(courses_url, headers=headers)

    if response.status_code == 200:
        courses_data = response.json()["data"]

        with ThreadPoolExecutor(max_workers=5) as executor:  # Sử dụng tối đa 5 luồng
            executor.map(process_course, courses_data)

        print("✅ Tất cả bài học đã được xử lý xong!")
    else:
        print(f"❌ Lỗi lấy dữ liệu Lesson: {response.status_code} - {response.text}")


