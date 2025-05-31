import type { Lesson, Word } from "@/types/lessons"

// Dummy lesson data
export const dummyLessons: Lesson[] = [
  {
    id: 1,
    title: "Greetings and Introductions",
    titleVi: "Chào hỏi và giới thiệu",
    words: 10,
    courseId: 1,
    description: "Learn common greetings and how to introduce yourself in English",
    descriptionVi: "Học các lời chào thông dụng và cách giới thiệu bản thân bằng tiếng Anh",
    imageUrl: "/placeholder.svg?height=200&width=400&text=Greetings",
  },
  {
    id: 2,
    title: "Daily Activities",
    titleVi: "Hoạt động hàng ngày",
    words: 10,
    courseId: 1,
    description: "Vocabulary for everyday activities and routines",
    descriptionVi: "Từ vựng cho các hoạt động và thói quen hàng ngày",
    imageUrl: "/placeholder.svg?height=200&width=400&text=Daily+Activities",
  },
  {
    id: 3,
    title: "Food and Dining",
    titleVi: "Thức ăn và ăn uống",
    words: 10,
    courseId: 1,
    description: "Learn words related to food, restaurants, and dining",
    descriptionVi: "Học các từ liên quan đến thức ăn, nhà hàng và ăn uống",
    imageUrl: "/placeholder.svg?height=200&width=400&text=Food+and+Dining",
  },
]

// Dummy words data
export const dummyWords: Word[] = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  lesson: 1,
  word: `Example Word ${i + 1}`,
  pronunciation: "/ɪɡˈzæmpəl wɜːrd/",
  pos: "noun",
  meaning: `This is the definition for example word ${i + 1}`,
  example: `Here is an example sentence using example word ${i + 1}.`,
  example_vi: `Đây là một câu ví dụ sử dụng từ ví dụ ${i + 1}.`,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  cefr: "A1",
}))

// Function to get lessons by course ID
export const getLessonsByCourseId = (courseId: number): Lesson[] => {
  return dummyLessons.filter((lesson) => lesson.courseId === courseId)
}

// Function to get a lesson by ID
export const getLessonById = (lessonId: number): Lesson | undefined => {
  return dummyLessons.find((lesson) => lesson.id === lessonId)
}

// Function to get words by lesson ID
export const getWordsByLessonId = (lessonId: number): Word[] => {
  return dummyWords.filter((word) => word.lesson === lessonId)
}
