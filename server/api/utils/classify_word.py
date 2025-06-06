import google.generativeai as genai
import time
from api.models import Word
from google.generativeai import list_models
API_KEY = "AIzaSyCd99aR3QixOsQNV9V1kIWi7g3SasGBtQQ"
genai.configure(api_key=API_KEY)

# Danh sách model và RPM
model_rpm = {
    "gemini-2.0-flash-lite": 30,
    "gemini-2.0-flash-lite-001": 30,
    "gemini-2.0-flash-lite-preview-02-05": 30,
    "gemini-2.0-flash-lite-preview": 30,
    "gemma-3-27b-it": 30,
    "gemini-2.0-flash": 15,
    "gemini-2.0-flash-001": 15,
    "gemini-1.5-flash": 15,
    "gemini-1.5-flash-002": 15,
    "gemini-1.5-flash-8b": 15,
    "gemini-1.5-flash-8b-001": 15,
    "gemini-1.5-flash-8b-latest": 15,
    "gemini-2.0-flash-exp": 10,
    "gemini-2.0-flash-thinking-exp-01-21": 10,
    "gemini-2.0-flash-thinking-exp": 10,
    "gemini-2.0-flash-thinking-exp-1219": 10,
    "gemini-2.0-pro-exp": 2,
    "gemini-2.0-pro-exp-02-05": 2,
    "gemini-1.5-pro-001": 2,
    "gemini-1.5-pro-002": 2,
    "gemini-1.5-pro-latest": 2,
    "models/learnlm-1.5-pro-experimental": 5
}




# Sắp xếp model theo RPM giảm dần
sorted_models = sorted(model_rpm.keys(), key=lambda x: model_rpm[x], reverse=True)
models = [genai.GenerativeModel(name) for name in sorted_models]

# Tính toán thời gian sleep cho từng model
sleep_times = [2 / rpm for rpm in model_rpm.values()]

# Lấy danh sách từ vựng cần xử lý
words = list(Word.objects.all())

m_index = 0
# Hàm xử lý từng model
def process_model(word):
    global m_index
    while True:
        model = models[m_index]
        try:
            prompt = f"""Hãy phân loại từ vựng "{word}" thành các mức độ như:
            A1, A2, B1, B2, C1, C2
            
            Chỉ trả lời một từ: A1, A2, B1, B2, C1, C2"""
            
            response = model.generate_content(prompt)
            return response.text.strip()

        except Exception as e:
            m_index = (m_index + 1) % len(models)
            time.sleep(1)

def classify_words():
    w_index = 0
    while w_index < len(words):
        word = words[w_index]
        if word.cefr:
            print(f"⚠️ Từ {word} đã được phân loại")
            w_index += 1
            continue
        sleep_time = sleep_times[m_index]
        try:
            result = process_model(word)
            word.cefr = result
            word.save()
            print(f"✅ Đã phân loại từ {word} thành {result}")
            time.sleep(sleep_time)
            w_index += 1
        except Exception as e:
            time.sleep(1)
# Chạy phân loại từ
