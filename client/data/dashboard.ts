import type { LearningInsight, WordCategory } from "@/types/dashboard"

// Weekly progress data
export const weeklyProgress: LearningInsight[] = [
  { day: "Mon", words: 12 },
  { day: "Tue", words: 8 },
  { day: "Wed", words: 15 },
  { day: "Thu", words: 10 },
  { day: "Fri", words: 5 },
  { day: "Sat", words: 20 },
  { day: "Sun", words: 18 },
]

// Word categories data
export const wordCategories: WordCategory[] = [
  { category: "Nouns", count: 45, color: "bg-gradient-to-r from-blue-400 to-blue-500" },
  { category: "Verbs", count: 32, color: "bg-gradient-to-r from-green-400 to-green-500" },
  { category: "Adjectives", count: 28, color: "bg-gradient-to-r from-purple-400 to-purple-500" },
  { category: "Adverbs", count: 15, color: "bg-gradient-to-r from-yellow-400 to-yellow-500" },
  { category: "Phrases", count: 20, color: "bg-gradient-to-r from-pink-400 to-pink-500" },
]
