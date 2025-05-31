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

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2"

export type MemorizationLevel = 1 | 2 | 3 | 4 | 5

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
