import type { CEFRLevel, MemorizationLevel, VocabularyWord } from "./vocabulary"

// Notebook entry
export interface NotebookEntry extends VocabularyWord {
  source: "lesson" | "manual" | "practice"
  sourceDetails?: string
  dateAdded: Date | string
  isFavorite: boolean
  notes?: string
  level?: MemorizationLevel
  cefr?: CEFRLevel
  reviewCount?: number
  lastReviewed?: Date | string | null
  nextReview?: Date | string | null
}

// API Word type (from backend)
export interface ApiWord {
  id: number
  word: string
  pronunciation: string | null
  pos: string
  meaning: string
  example: string
  exampleVi: string
  image: string | null
  audio: string | null
  cefr: string
}

// Learned Word type (from backend)
export interface LearnedWord {
  id: number
  word: ApiWord
  level: number
  nextReview: string
  lastReview: string
  streak: number
  learnedAt: string
  user: number
}

// Learned Words Pagination API response
export interface LearnedWordsPaginationResponse {
  count: number
  next: string | null
  previous: string | null
  results: LearnedWord[]
}

// Words list props
export interface WordsListProps {
  onComplete?: () => void
}
