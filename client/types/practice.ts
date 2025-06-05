import type { VocabularyWord } from "./vocabulary"

// Practice modes
export type PracticeMode = "mixed" | "multiple-choice" | "fill-blank" | "listening" | "matching" | "drag-drop"

// Question types
export type QuestionType = "multiple-choice" | "fill-blank" | "listening" | "matching" | "drag-drop"

// Practice question
export interface PracticeQuestion {
  id: number
  type: QuestionType
  word: VocabularyWord
  correctAnswer: string
  options?: string[]
  pairs?: any[] // This should be properly typed based on the actual structure
  sentence?: string
  dragWords?: string[]
}

// Practice session
export interface PracticeSession {
  id: string
  mode?: PracticeMode
  courseId?: number
  lessonId?: number
  questions: PracticeQuestion[]
  currentQuestionIndex: number
  correctAnswers: number
  incorrectAnswers: number
  startTime: Date
  endTime?: Date
  completed: boolean
  results?: PracticeResult[]
}

// Practice result
export interface PracticeResult {
  questionId: number
  userAnswer: string
  isCorrect: boolean
  timestamp: Date
}

// Practice history
export interface PracticeHistory {
  id: string
  date: Date
  score: number
  totalQuestions: number
  timeSpent: number
  questionTypes: QuestionType[]
}

// Question module props
export interface QuestionModuleProps {
  question: PracticeQuestion
  onSubmit: (answer: string) => void
  feedback: "correct" | "incorrect" | null
  showingFeedback: boolean
}
