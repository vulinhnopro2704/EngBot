import type { Course, Lesson } from "@/data/types"

export const courses: Course[] = [
  {
    id: 1,
    title: "Beginner Vocabulary",
    titleVi: "Từ vựng cơ bản",
    description: "Essential words for everyday communication",
    descriptionVi: "Những từ thiết yếu cho giao tiếp hàng ngày",
    lessons: 5,
    icon: "BookOpen",
    color: "bg-blue-100 dark:bg-blue-950",
    iconColor: "text-blue-500",
    difficulty: "Beginner",
    totalWords: 50,
    estimatedTime: "5 hours",
  },
  {
    id: 2,
    title: "Business English",
    titleVi: "Tiếng Anh thương mại",
    description: "Professional vocabulary for the workplace",
    descriptionVi: "Từ vựng chuyên nghiệp cho môi trường làm việc",
    lessons: 4,
    icon: "Briefcase",
    color: "bg-green-100 dark:bg-green-950",
    iconColor: "text-green-500",
    difficulty: "Intermediate",
    totalWords: 40,
    estimatedTime: "4 hours",
  },
  {
    id: 3,
    title: "Academic English",
    titleVi: "Tiếng Anh học thuật",
    description: "Vocabulary for academic writing and research",
    descriptionVi: "Từ vựng cho viết và nghiên cứu học thuật",
    lessons: 3,
    icon: "GraduationCap",
    color: "bg-purple-100 dark:bg-purple-950",
    iconColor: "text-purple-500",
    difficulty: "Advanced",
    totalWords: 30,
    estimatedTime: "3 hours",
  },
]

export const lessons: Record<number, Lesson[]> = {
  1: [
    { id: 1, title: "Greetings and Introductions", titleVi: "Chào hỏi và giới thiệu", words: 10, courseId: 1 },
    { id: 2, title: "Daily Activities", titleVi: "Hoạt động hàng ngày", words: 10, courseId: 1 },
    { id: 3, title: "Food and Dining", titleVi: "Thức ăn và ăn uống", words: 10, courseId: 1 },
    { id: 4, title: "Travel and Directions", titleVi: "Du lịch và chỉ đường", words: 10, courseId: 1 },
    { id: 5, title: "Shopping and Money", titleVi: "Mua sắm và tiền bạc", words: 10, courseId: 1 },
  ],
  2: [
    { id: 1, title: "Office Communication", titleVi: "Giao tiếp văn phòng", words: 10, courseId: 2 },
    { id: 2, title: "Meetings and Presentations", titleVi: "Họp và thuyết trình", words: 10, courseId: 2 },
    { id: 3, title: "Emails and Reports", titleVi: "Email và báo cáo", words: 10, courseId: 2 },
    { id: 4, title: "Negotiations and Contracts", titleVi: "Đàm phán và hợp đồng", words: 10, courseId: 2 },
  ],
  3: [
    { id: 1, title: "Research Terminology", titleVi: "Thuật ngữ nghiên cứu", words: 10, courseId: 3 },
    { id: 2, title: "Academic Writing", titleVi: "Viết học thuật", words: 10, courseId: 3 },
    { id: 3, title: "Presentations and Debates", titleVi: "Thuyết trình và tranh luận", words: 10, courseId: 3 },
  ],
}

export const getCourseById = (id: number): Course | undefined => {
  return courses.find((course) => course.id === id)
}

export const getLessonsByCourseId = (courseId: number): Lesson[] => {
  return lessons[courseId] || []
}

export const getLessonById = (courseId: number, lessonId: number): Lesson | undefined => {
  const courseLessons = getLessonsByCourseId(courseId)
  return courseLessons.find((lesson) => lesson.id === lessonId)
}

export const getLessonTitle = (lessonId: number): string => {
  const titles: Record<number, string> = {
    1: "Greetings and Introductions",
    2: "Daily Activities",
    3: "Food and Dining",
    4: "Travel and Directions",
    5: "Shopping and Money",
    6: "Office Communication",
    7: "Meetings and Presentations",
    8: "Emails and Reports",
    9: "Negotiations and Contracts",
    10: "Research Terminology",
    11: "Academic Writing",
    12: "Presentations and Debates",
  }

  return titles[lessonId] || `Lesson ${lessonId}`
}

export const getLessonTitleVi = (lessonId: number): string => {
  const titles: Record<number, string> = {
    1: "Chào hỏi và giới thiệu",
    2: "Hoạt động hàng ngày",
    3: "Thức ăn và ăn uống",
    4: "Du lịch và chỉ đường",
    5: "Mua sắm và tiền bạc",
    6: "Giao tiếp văn phòng",
    7: "Họp và thuyết trình",
    8: "Email và báo cáo",
    9: "Đàm phán và hợp đồng",
    10: "Thuật ngữ nghiên cứu",
    11: "Viết học thuật",
    12: "Thuyết trình và tranh luận",
  }

  return titles[lessonId] || `Bài học ${lessonId}`
}
