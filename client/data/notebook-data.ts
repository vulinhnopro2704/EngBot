import type { NotebookEntry, MemorizationLevel } from "@/types/notebook"
import type { VocabularyWord } from "@/types/vocabulary"

// Calculate next review date based on memorization level
export const calculateNextReviewDate = (level: MemorizationLevel): Date => {
  const now = new Date()
  const days =
    {
      1: 1, // Level 1: Review after 1 day
      2: 3, // Level 2: Review after 3 days
      3: 7, // Level 3: Review after 1 week
      4: 14, // Level 4: Review after 2 weeks
      5: 30, // Level 5: Review after 1 month
    }[level] || 1

  now.setDate(now.getDate() + days)
  return now
}

// Helper function to ensure dates are properly handled
export const ensureDateFormat = (entry: NotebookEntry): NotebookEntry => {
  // If dateAdded is a string, convert it to a Date object
  if (typeof entry.dateAdded === "string") {
    entry = {
      ...entry,
      dateAdded: new Date(entry.dateAdded),
    }
  }

  // Handle lastReviewed and nextReview dates
  if (typeof entry.lastReviewed === "string") {
    entry = {
      ...entry,
      lastReviewed: new Date(entry.lastReviewed),
    }
  }

  if (typeof entry.nextReview === "string") {
    entry = {
      ...entry,
      nextReview: new Date(entry.nextReview),
    }
  }

  return entry
}

// Create a notebook entry from a vocabulary word
export const createNotebookEntry = (
  word: VocabularyWord,
  source: "lesson" | "manual" | "practice",
  sourceDetails?: string,
): NotebookEntry => {
  return {
    ...word,
    id: word.id || Date.now(),
    source,
    sourceDetails: sourceDetails || "",
    dateAdded: new Date(),
    isFavorite: false,
    notes: word.notes || "",
    level: word.level || 1,
    cefr: word.cefr || "A1",
    reviewCount: 0,
    lastReviewed: null,
    nextReview: calculateNextReviewDate(1),
  }
}

// Sample notebook entries for testing
export const sampleNotebookEntries: NotebookEntry[] = [
  {
    id: 1,
    word: "ubiquitous",
    definition: "present, appearing, or found everywhere",
    definitionVi: "hiện diện, xuất hiện hoặc được tìm thấy ở khắp mọi nơi",
    phonetic: "/juːˈbɪkwɪtəs/",
    example: "Mobile phones are now ubiquitous in modern life.",
    exampleVi: "Điện thoại di động hiện nay có mặt khắp nơi trong cuộc sống hiện đại.",
    wordType: "adjective",
    imageUrl: "/placeholder.svg?height=200&width=200&text=ubiquitous",
    relatedWords: ["omnipresent", "universal", "widespread"],
    source: "manual",
    dateAdded: new Date(2023, 5, 15),
    isFavorite: true,
    level: 3,
    cefr: "C1",
    reviewCount: 5,
    lastReviewed: new Date(2023, 6, 1),
    nextReview: new Date(2023, 6, 8),
  },
  {
    id: 2,
    word: "ephemeral",
    definition: "lasting for a very short time",
    definitionVi: "tồn tại trong một thời gian rất ngắn",
    phonetic: "/ɪˈfem(ə)rəl/",
    example: "The ephemeral nature of fashion trends makes it hard to keep up.",
    exampleVi: "Bản chất ngắn ngủi của các xu hướng thời trang khiến việc theo kịp trở nên khó khăn.",
    wordType: "adjective",
    imageUrl: "/placeholder.svg?height=200&width=200&text=ephemeral",
    relatedWords: ["fleeting", "transient", "momentary"],
    source: "lesson",
    sourceDetails: "Academic English",
    dateAdded: new Date(2023, 5, 20),
    isFavorite: false,
    level: 2,
    cefr: "C1",
    reviewCount: 3,
    lastReviewed: new Date(2023, 6, 5),
    nextReview: new Date(2023, 6, 8),
  },
]
