import type { Course } from "@/types/courses"
import { BookOpen, Briefcase, Globe, GraduationCap, Lightbulb, Mic, Palette, Utensils } from "lucide-react"
import type { IconType } from "@/types/icons"

// Sample courses data
const courses: Course[] = [
  {
    id: 1,
    title: "Beginner Vocabulary",
    description:
      "Essential words for everyday communication. Perfect for beginners who want to build a strong foundation in English vocabulary.",
    image: "/placeholder.svg?height=400&width=600&text=Beginner+Vocabulary",
    icon: "BookOpen",
    level: "Beginner",
    category: "Vocabulary",
    popularity: 95,
    releaseDate: "2023-06-15",
  },
  {
    id: 2,
    title: "Business English",
    description:
      "Professional vocabulary for the workplace. Enhance your communication skills in business settings with industry-specific terminology.",
    image: "/placeholder.svg?height=400&width=600&text=Business+English",
    icon: "Briefcase",
    level: "Intermediate",
    category: "Business",
    popularity: 85,
    releaseDate: "2023-08-22",
  },
  {
    id: 3,
    title: "Academic English",
    description:
      "Vocabulary for academic writing and research. Develop the language skills needed for success in academic environments and scholarly writing.",
    image: "/placeholder.svg?height=400&width=600&text=Academic+English",
    icon: "GraduationCap",
    level: "Advanced",
    category: "Academic",
    popularity: 75,
    releaseDate: "2023-10-05",
  },
  {
    id: 4,
    title: "Travel Vocabulary",
    description:
      "Essential words and phrases for travelers. Learn vocabulary related to transportation, accommodation, dining, and sightseeing.",
    image: "/placeholder.svg?height=400&width=600&text=Travel+Vocabulary",
    icon: "Globe",
    level: "Beginner",
    category: "Travel",
    popularity: 90,
    releaseDate: "2023-07-10",
  },
  {
    id: 5,
    title: "Conversational English",
    description:
      "Everyday expressions and idioms for natural conversations. Improve your fluency and sound more like a native speaker.",
    image: "/placeholder.svg?height=400&width=600&text=Conversational+English",
    icon: "Mic",
    level: "Intermediate",
    category: "Conversation",
    popularity: 88,
    releaseDate: "2023-09-15",
  },
  {
    id: 6,
    title: "Food and Cooking",
    description:
      "Culinary vocabulary for food enthusiasts. Learn words related to ingredients, cooking techniques, and dining experiences.",
    image: "/placeholder.svg?height=400&width=600&text=Food+and+Cooking",
    icon: "Utensils",
    level: "Beginner",
    category: "Specialty",
    popularity: 80,
    releaseDate: "2023-11-20",
  },
]

// Map course icons based on course title or id
export const getCourseIcon = (course: Course): IconType => {
  const title = course.title.toLowerCase()

  if (title.includes("business") || title.includes("office")) {
    return Briefcase
  } else if (title.includes("travel") || title.includes("world")) {
    return Globe
  } else if (title.includes("food") || title.includes("cooking")) {
    return Utensils
  } else if (title.includes("academic") || title.includes("school")) {
    return GraduationCap
  } else if (title.includes("creative") || title.includes("art")) {
    return Palette
  } else if (title.includes("conversation") || title.includes("speaking")) {
    return Mic
  } else if (title.includes("idioms") || title.includes("expressions")) {
    return Lightbulb
  } else {
    return BookOpen
  }
}

// Get color scheme based on course id or title
export const getCourseColorScheme = (course: Course) => {
  const id = course.id % 8

  switch (id) {
    case 0:
      return {
        color: "bg-blue-100 dark:bg-blue-900/30",
        iconColor: "text-blue-600 dark:text-blue-400",
      }
    case 1:
      return {
        color: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-purple-600 dark:text-purple-400",
      }
    case 2:
      return {
        color: "bg-green-100 dark:bg-green-900/30",
        iconColor: "text-green-600 dark:text-green-400",
      }
    case 3:
      return {
        color: "bg-amber-100 dark:bg-amber-900/30",
        iconColor: "text-amber-600 dark:text-amber-400",
      }
    case 4:
      return {
        color: "bg-red-100 dark:bg-red-900/30",
        iconColor: "text-red-600 dark:text-red-400",
      }
    case 5:
      return {
        color: "bg-indigo-100 dark:bg-indigo-900/30",
        iconColor: "text-indigo-600 dark:text-indigo-400",
      }
    case 6:
      return {
        color: "bg-pink-100 dark:bg-pink-900/30",
        iconColor: "text-pink-600 dark:text-pink-400",
      }
    case 7:
      return {
        color: "bg-teal-100 dark:bg-teal-900/30",
        iconColor: "text-teal-600 dark:text-teal-400",
      }
    default:
      return {
        color: "bg-gray-100 dark:bg-gray-800/30",
        iconColor: "text-gray-600 dark:text-gray-400",
      }
  }
}

// Map course level to a color
export const getCourseLevelColor = (level: string) => {
  switch (level.toLowerCase()) {
    case "beginner":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "elementary":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "upper intermediate":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
    case "advanced":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    case "proficient":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  }
}

// Enhance course data with additional UI properties
export const enhanceCourse = (course: Course) => {
  const Icon = getCourseIcon(course)
  const { color, iconColor } = getCourseColorScheme(course)

  return {
    ...course,
    Icon,
    color,
    iconColor,
    level: course.level || "Beginner",
    category: course.category || "Vocabulary",
  }
}

// Export enhanced courses
export const enhancedCourses = courses.map(enhanceCourse)
