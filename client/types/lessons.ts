import type { VocabularyWord } from "./vocabulary"

// Lesson type
export interface Lesson {
  id: number
  title: string
  titleVi: string
  words: number
  courseId: number
  description?: string
  descriptionVi?: string
  imageUrl?: string
  completed?: boolean
}

// Word type used in lessons
export interface Word {
  id: number
  lesson: number
  word: string
  pronunciation: string
  pos: string
  meaning: string
  example: string
  example_vi: string
  created_at: string
  updated_at: string
  cefr: string
  audio?: string
}

// Module types
export interface ModuleProps {
  courseId: number
  lessonId: number
  words?: Word[]
}

// Flashcard module props
export interface FlashcardModuleProps extends ModuleProps {
  onComplete?: () => void
}

// Listening module props
export interface ListeningModuleProps extends ModuleProps {
  onComplete?: () => void
}

// Fill in the blank module props
export interface FillBlankModuleProps extends ModuleProps {
  onComplete?: () => void
}

// Lesson page props
export interface LessonPageProps {
  courseId: number
  lessonId: number
}

// Lesson view props
export interface LessonViewProps {
  courseId: number
  lessonId: number
  lesson: Lesson
  words: VocabularyWord[]
}
