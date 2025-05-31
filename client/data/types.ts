// User types
export type User = {
  id: number
  name: string
  email: string
  avatar: string
  joinDate: string
}

// Course types
export type Course = {
  id: number
  title: string
  en_title?: string
  description: string
  image?: string
  icon: string
  created_at?: string
  updated_at?: string
}

// Lesson types
export type Lesson = {
  id: number
  title: string
  description?: string
  image?: string
  course: number
  created_at?: string
  updated_at?: string
}

// Word types
export type Word = {
  id: number
  lesson?: number
  word: string
  pronunciation?: string
  pos?: string
  meaning: string
  example?: string
  example_vi?: string
  image?: string
  audio?: string
  created_at?: string
  updated_at?: string
  cefr?: CEFRLevel
}

// User progress types
export type UserCourse = {
  user: number
  course: number
  date_started?: string
  date_completed?: string
}

export type UserLesson = {
  user: number
  lesson: number
  date_started?: string
  date_completed?: string
}

export type UserWord = {
  user: number
  word: number
  level?: number
  next_review?: string
  last_review?: string
  streak?: number
  learned_at?: string
}

// CEFR levels for language proficiency
export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
export type MemorizationLevel = 1 | 2 | 3 | 4 | 5

// Legacy types for compatibility
export interface VocabularyWord {
  id: number
  word: string
  definition: string
  definitionVi?: string
  phonetic?: string
  example?: string
  exampleVi?: string
  wordType: WordType
  imageUrl?: string
  relatedWords?: string[]
  isFavorite?: boolean
  notes?: string
  cefr?: CEFRLevel
  level?: MemorizationLevel
  dateAdded?: Date | string
  source?: string
  sourceDetails?: string
  reviewCount?: number
  lastReviewed?: Date | string | null
  nextReview?: Date | string | null
}

export type WordType =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "preposition"
  | "conjunction"
  | "pronoun"
  | "interjection"
  | "phrase"

export interface NotebookEntry extends VocabularyWord {
  dateAdded: Date | string
  source: string
  sourceDetails?: string
  isFavorite: boolean
}

// Activity types
export type ActivityType = "completed" | "streak" | "practice"

export type Activity = {
  id: number
  type: ActivityType
  title: string
  description: string
  time: string
  iconBg: string
  iconColor: string
}

// Progress types
export type Progress = {
  courseId: number
  lessonId: number
  progress: number
}

// Settings types
export type FontSize = "small" | "medium" | "large"
export type ReminderFrequency = "never" | "daily" | "every-other-day" | "weekly"
export type Language = "en" | "vi" | "es" | "fr" | "de" | "it" | "pt"

// Practice types
// Update the QuestionType to include our new types
export type QuestionType = "multiple-choice" | "fill-blank" | "listening" | "matching" | "drag-drop"

// Update the PracticeQuestion type to include fields for our new question types
export interface PracticeQuestion {
  id: number
  type: QuestionType
  word: VocabularyWord
  options?: string[]
  correctAnswer: string
  pairs?: any[] // For matching exercise
  sentence?: string // For drag-drop exercise
  dragWords?: string[] // For drag-drop exercise
}

export type PracticeMode = "mixed" | QuestionType

export type PracticeQuestion_OLD = {
  id: number
  type: QuestionType
  word: Word
  correctAnswer: string
  options?: string[]
  pairs?: { id: string; text: string; matchId: string }[]
  sentence?: string
  dragWords?: string[]
}

export type QuestionResult = {
  questionId: number
  userAnswer: string
  isCorrect: boolean
  timestamp: Date
}

export type PracticeSession = {
  id: string
  mode: PracticeMode
  questions: PracticeQuestion[]
  currentQuestionIndex: number
  correctAnswers: number
  incorrectAnswers: number
  startTime: Date
  endTime?: Date
  completed: boolean
  results: QuestionResult[]
}

export type PracticeHistory = {
  id: string
  date: Date
  score: number
  totalQuestions: number
  timeSpent: number // in seconds
  questionTypes: QuestionType[]
}
