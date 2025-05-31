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

// Notebook entry card props
export interface NotebookEntryCardProps {
  entry: NotebookEntry
  onToggleFavorite: () => void
}

// Add word dialog props
export interface AddWordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Edit word dialog props
export interface EditWordDialogProps {
  entry: NotebookEntry
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Vocabulary review props
export interface VocabularyReviewProps {
  onComplete: () => void
}
