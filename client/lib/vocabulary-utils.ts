import type { CEFRLevel, MemorizationLevel } from "@/data/types"

// CEFR level descriptions
export const cefrDescriptions: Record<CEFRLevel, string> = {
  A1: "Beginner - Basic words and phrases",
  A2: "Elementary - Simple, everyday expressions",
  B1: "Intermediate - Main points of clear standard input",
  B2: "Upper Intermediate - Complex text and technical discussions",
  C1: "Advanced - Fluent expression with implicit meaning",
  C2: "Proficient - Near-native level comprehension",
}

// CEFR level colors
export const cefrColors: Record<CEFRLevel, { bg: string; text: string; dark: { bg: string; text: string } }> = {
  A1: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    dark: { bg: "dark:bg-blue-900", text: "dark:text-blue-300" },
  },
  A2: {
    bg: "bg-green-100",
    text: "text-green-800",
    dark: { bg: "dark:bg-green-900", text: "dark:text-green-300" },
  },
  B1: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    dark: { bg: "dark:bg-yellow-900", text: "dark:text-yellow-300" },
  },
  B2: {
    bg: "bg-orange-100",
    text: "text-orange-800",
    dark: { bg: "dark:bg-orange-900", text: "dark:text-orange-300" },
  },
  C1: {
    bg: "bg-red-100",
    text: "text-red-800",
    dark: { bg: "dark:bg-red-900", text: "dark:text-red-300" },
  },
  C2: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    dark: { bg: "dark:bg-purple-900", text: "dark:text-purple-300" },
  },
}

// Memorization level descriptions
export const memorizationLevelDescriptions: Record<MemorizationLevel, string> = {
  1: "Just learned - Review daily",
  2: "Recognizable - Review every 3 days",
  3: "Familiar - Review weekly",
  4: "Well-known - Review every 2 weeks",
  5: "Mastered - Review monthly",
}

// Memorization level colors
export const memorizationLevelColors: Record<
  MemorizationLevel,
  { bg: string; text: string; dark: { bg: string; text: string } }
> = {
  1: {
    bg: "bg-red-100",
    text: "text-red-800",
    dark: { bg: "dark:bg-red-900", text: "dark:text-red-300" },
  },
  2: {
    bg: "bg-orange-100",
    text: "text-orange-800",
    dark: { bg: "dark:bg-orange-900", text: "dark:text-orange-300" },
  },
  3: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    dark: { bg: "dark:bg-yellow-900", text: "dark:text-yellow-300" },
  },
  4: {
    bg: "bg-green-100",
    text: "text-green-800",
    dark: { bg: "dark:bg-green-900", text: "dark:text-green-300" },
  },
  5: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    dark: { bg: "dark:bg-blue-900", text: "dark:text-blue-300" },
  },
}

// Get color classes for CEFR level
export const getCEFRLevelClasses = (level: CEFRLevel | undefined): string => {
  if (!level || !cefrColors[level]) {
    return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }

  const { bg, text, dark } = cefrColors[level]
  return `${bg} ${text} ${dark.bg} ${dark.text}`
}

// Get color classes for memorization level
export const getMemorizationLevelClasses = (level: MemorizationLevel | undefined): string => {
  if (!level || !memorizationLevelColors[level]) {
    return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }

  const { bg, text, dark } = memorizationLevelColors[level]
  return `${bg} ${text} ${dark.bg} ${dark.text}`
}

// Get color for word type badge
export const getWordTypeColor = (type: string | undefined): string => {
  if (!type) return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"

  switch (type.toLowerCase()) {
    case "noun":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "verb":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "adjective":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    case "adverb":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "preposition":
      return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
    case "conjunction":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
    case "pronoun":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    case "interjection":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
    case "phrase":
      return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

// Format date safely
export const formatDate = (dateValue: Date | string | undefined): string => {
  if (!dateValue) return "Unknown date"
  try {
    const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (e) {
    console.error("Error formatting date:", e)
    return "Invalid date"
  }
}

// Calculate days until next review
export const daysUntilReview = (nextReview: Date | string | undefined): number | null => {
  if (!nextReview) return null

  try {
    const reviewDate = typeof nextReview === "string" ? new Date(nextReview) : nextReview
    const now = new Date()

    // Set hours to 0 to compare just the dates
    reviewDate.setHours(0, 0, 0, 0)
    now.setHours(0, 0, 0, 0)

    const diffTime = reviewDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  } catch (e) {
    console.error("Error calculating days until review:", e)
    return null
  }
}

// Get review status text
export const getReviewStatusText = (nextReview: Date | string | undefined): string => {
  if (!nextReview) return "Not reviewed yet"

  const days = daysUntilReview(nextReview)

  if (days === null) return "Unknown"
  if (days < 0) return "Review overdue"
  if (days === 0) return "Review today"
  if (days === 1) return "Review tomorrow"
  return `Review in ${days} days`
}
