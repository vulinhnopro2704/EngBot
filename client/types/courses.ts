import type React from "react"
import type { IconType } from "./icons"

export type CourseLevel =
  | "All Levels"
  | "Beginner"
  | "Elementary"
  | "Intermediate"
  | "Upper Intermediate"
  | "Advanced"
  | "Proficient"

export type CourseCategory =
  | "All Categories"
  | "Vocabulary"
  | "Grammar"
  | "Conversation"
  | "Business"
  | "Academic"
  | "Travel"
  | "Specialty"

export type CourseSortOption = "popular" | "newest" | "highest-rated" | "most-students" | "alphabetical"

export interface Course {
  id: number
  title: string
  description: string
  image?: string
  icon?: string
  level?: string
  category?: string
  popularity?: number
  releaseDate?: string
}

export interface EnhancedCourse extends Course {
  Icon: IconType
  color: string
  iconColor: string
}

export interface CourseCardProps {
  course: EnhancedCourse
  progress: number
  Icon: IconType
  index: number
  onSelect: () => void
  onPractice: (e: React.MouseEvent) => void
  getLevelColor: (level: string) => string
}
