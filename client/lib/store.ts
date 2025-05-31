"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { v4 as uuidv4 } from "uuid"
import type {
  FontSize,
  Language,
  ReminderFrequency,
  Activity,
  PracticeSession,
  PracticeHistory,
  NotebookEntry,
  VocabularyWord,
  MemorizationLevel,
} from "@/data/types"
import { recentActivities } from "@/data/activities"
import { createPracticeSession, calculatePracticeScore, calculateTimeSpent } from "@/data/practice"

type VocabState = {
  // User info
  userName: string
  userAvatar: string
  updateUserName: (name: string) => void
  updateUserAvatar: (avatar: string) => void

  // Progress metrics
  streak: number
  hearts: number
  diamonds: number
  dailyGoal: number
  dailyProgress: number

  // Course tracking
  courseId: number | null
  lessonId: number | null
  progress: Record<string, number>
  setCourse: (id: number) => void
  setLesson: (id: number) => void
  updateProgress: (courseId: number, lessonId: number, progress: number) => void

  // Settings
  interfaceLanguage: Language
  updateInterfaceLanguage: (language: Language) => void
  fontSizePreference: FontSize
  updateFontSizePreference: (size: FontSize) => void

  // Audio settings
  masterVolume: number
  speechVolume: number
  effectsVolume: number
  autoPlayAudio: boolean
  updateMasterVolume: (volume: number) => void
  updateSpeechVolume: (volume: number) => void
  updateEffectsVolume: (volume: number) => void
  toggleAutoPlayAudio: (enabled: boolean) => void

  // Notification settings
  emailNotifications: boolean
  pushNotifications: boolean
  reminderFrequency: ReminderFrequency
  toggleEmailNotifications: (enabled: boolean) => void
  togglePushNotifications: (enabled: boolean) => void
  updateReminderFrequency: (frequency: ReminderFrequency) => void

  // Recent activities
  recentActivities: Activity[]

  // Practice
  currentPracticeSession: PracticeSession | null
  practiceHistory: PracticeHistory[]
  startPracticeSession: (questionCount?: number, courseId?: number, lessonId?: number) => void
  answerQuestion: (answer: string) => boolean
  nextQuestion: () => void
  completePracticeSession: () => void
  resetPracticeSession: () => void

  // Notebook
  notebookEntries: NotebookEntry[]
  addToNotebook: (word: VocabularyWord, source: "lesson" | "manual" | "practice", sourceDetails?: string) => void
  removeFromNotebook: (id: number) => void
  updateNotebookEntry: (id: number, updates: Partial<NotebookEntry>) => void
  toggleFavorite: (id: number) => void
  updateMemorizationLevel: (id: number, level: MemorizationLevel) => void
  reviewWord: (id: number, successful: boolean) => void
  getWordsForReview: () => NotebookEntry[]
  getMemorizationLevelCounts: () => Record<string, number>
  getCEFRLevelCounts: () => Record<string, number>

  // Debug
  _debug_clearNotebook: () => void
}

// Helper function to ensure dates are properly handled
const ensureDateFormat = (entry: NotebookEntry): NotebookEntry => {
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

// Calculate next review date based on memorization level
const calculateNextReviewDate = (level: MemorizationLevel): Date => {
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

export const useVocabStore = create<VocabState>()(
  persist(
    (set, get) => ({
      // User info
      userName: "Alex Johnson",
      userAvatar: "/placeholder.svg?height=40&width=40",
      updateUserName: (name) => set({ userName: name }),
      updateUserAvatar: (avatar) => set({ userAvatar: avatar }),

      // Progress metrics
      streak: 7,
      hearts: 5,
      diamonds: 120,
      dailyGoal: 50,
      dailyProgress: 30,

      // Course tracking
      courseId: null,
      lessonId: null,
      progress: {
        "1-1": 100,
        "1-2": 75,
        "2-1": 50,
      },
      setCourse: (id) => set({ courseId: id }),
      setLesson: (id) => set({ lessonId: id }),
      updateProgress: (courseId, lessonId, progress) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [`${courseId}-${lessonId}`]: progress,
          },
        })),

      // Settings
      interfaceLanguage: "en",
      updateInterfaceLanguage: (language) => set({ interfaceLanguage: language }),
      fontSizePreference: "medium",
      updateFontSizePreference: (size) => set({ fontSizePreference: size }),

      // Audio settings
      masterVolume: 80,
      speechVolume: 90,
      effectsVolume: 70,
      autoPlayAudio: true,
      updateMasterVolume: (volume) => set({ masterVolume: volume }),
      updateSpeechVolume: (volume) => set({ speechVolume: volume }),
      updateEffectsVolume: (volume) => set({ effectsVolume: volume }),
      toggleAutoPlayAudio: (enabled) => set({ autoPlayAudio: enabled }),

      // Notification settings
      emailNotifications: true,
      pushNotifications: true,
      reminderFrequency: "daily",
      toggleEmailNotifications: (enabled) => set({ emailNotifications: enabled }),
      togglePushNotifications: (enabled) => set({ pushNotifications: enabled }),
      updateReminderFrequency: (frequency) => set({ reminderFrequency: frequency }),

      // Recent activities
      recentActivities,

      // Practice
      currentPracticeSession: null,
      practiceHistory: [],

      startPracticeSession: (questionCount = 10, courseId, lessonId) => {
        const session = createPracticeSession(questionCount, courseId, lessonId)
        set({ currentPracticeSession: session })

        // Update daily progress
        set((state) => ({
          dailyProgress: Math.min(state.dailyGoal, state.dailyProgress + 5),
        }))

        return session
      },

      answerQuestion: (answer: string) => {
        const { currentPracticeSession } = get()
        if (!currentPracticeSession) return false

        const { questions, currentQuestionIndex } = currentPracticeSession
        const currentQuestion = questions[currentQuestionIndex]
        const isCorrect = answer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase()

        set((state) => {
          if (!state.currentPracticeSession) return {}

          return {
            currentPracticeSession: {
              ...state.currentPracticeSession,
              correctAnswers: isCorrect
                ? state.currentPracticeSession.correctAnswers + 1
                : state.currentPracticeSession.correctAnswers,
              incorrectAnswers: !isCorrect
                ? state.currentPracticeSession.incorrectAnswers + 1
                : state.currentPracticeSession.incorrectAnswers,
            },
            // Update progress metrics
            diamonds: isCorrect ? state.diamonds + 1 : state.diamonds,
            dailyProgress: Math.min(state.dailyGoal, state.dailyProgress + (isCorrect ? 2 : 1)),
          }
        })

        return isCorrect
      },

      nextQuestion: () => {
        set((state) => {
          if (!state.currentPracticeSession) return {}

          const nextIndex = state.currentPracticeSession.currentQuestionIndex + 1
          const isCompleted = nextIndex >= state.currentPracticeSession.questions.length

          return {
            currentPracticeSession: {
              ...state.currentPracticeSession,
              currentQuestionIndex: nextIndex,
              completed: isCompleted,
              endTime: isCompleted ? new Date() : state.currentPracticeSession.endTime,
            },
          }
        })
      },

      completePracticeSession: () => {
        const { currentPracticeSession } = get()
        if (!currentPracticeSession) return

        const endTime = new Date()
        const score = calculatePracticeScore(currentPracticeSession)
        const timeSpent = calculateTimeSpent({
          ...currentPracticeSession,
          endTime,
        })

        const questionTypes = currentPracticeSession.questions.map((q) => q.type)

        // Create history entry
        const historyEntry: PracticeHistory = {
          id: uuidv4(),
          date: endTime,
          score,
          totalQuestions: currentPracticeSession.questions.length,
          timeSpent,
          questionTypes,
        }

        set((state) => ({
          currentPracticeSession: {
            ...currentPracticeSession,
            completed: true,
            endTime,
          },
          practiceHistory: [historyEntry, ...state.practiceHistory],
          // Update streak if score is good
          streak: score >= 70 ? state.streak + 1 : state.streak,
          // Add hearts for good performance
          hearts: score >= 80 ? state.hearts + 1 : state.hearts,
        }))
      },

      resetPracticeSession: () => {
        set({ currentPracticeSession: null })
      },

      // Notebook
      notebookEntries: [],

      addToNotebook: (word, source, sourceDetails) => {
        // Create a complete notebook entry from the vocabulary word
        const entry: NotebookEntry = {
          ...word,
          id: word.id || Date.now(), // Ensure ID exists
          source: source,
          sourceDetails: sourceDetails || "",
          dateAdded: new Date(),
          isFavorite: false,
          notes: word.notes || "",
          level: word.level || 1, // Default to level 1
          cefr: word.cefr || "A1", // Default to A1
          reviewCount: 0,
          lastReviewed: null,
          nextReview: calculateNextReviewDate(1), // Set initial review date
        }

        console.log("Adding word to notebook:", entry)

        set((state) => {
          // Check if word already exists in notebook
          const exists = state.notebookEntries.some(
            (item) => item.id === entry.id || item.word.toLowerCase() === word.word.toLowerCase(),
          )

          if (exists) {
            console.log("Word already exists in notebook, not adding:", word.word)
            return state
          }

          // Add the new entry
          const updatedEntries = [entry, ...state.notebookEntries]
          console.log("Updated notebook entries:", updatedEntries)

          return {
            notebookEntries: updatedEntries,
          }
        })
      },

      removeFromNotebook: (id) => {
        set((state) => ({
          notebookEntries: state.notebookEntries.filter((entry) => entry.id !== id),
        }))
      },

      updateNotebookEntry: (id, updates) => {
        set((state) => ({
          notebookEntries: state.notebookEntries.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry)),
        }))
      },

      toggleFavorite: (id) => {
        set((state) => ({
          notebookEntries: state.notebookEntries.map((entry) =>
            entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry,
          ),
        }))
      },

      updateMemorizationLevel: (id, level) => {
        set((state) => ({
          notebookEntries: state.notebookEntries.map((entry) =>
            entry.id === id
              ? {
                  ...entry,
                  level,
                  lastReviewed: new Date(),
                  nextReview: calculateNextReviewDate(level),
                  reviewCount: (entry.reviewCount || 0) + 1,
                }
              : entry,
          ),
        }))
      },

      reviewWord: (id, successful) => {
        const { notebookEntries } = get()
        const entry = notebookEntries.find((entry) => entry.id === id)

        if (!entry) return

        // Current level or default to 1
        const currentLevel = entry.level || 1

        // Calculate new level based on success
        let newLevel: MemorizationLevel
        if (successful) {
          // Move up a level if successful (max 5)
          newLevel = Math.min(5, currentLevel + 1) as MemorizationLevel
        } else {
          // Move down a level if unsuccessful (min 1)
          newLevel = Math.max(1, currentLevel - 1) as MemorizationLevel
        }

        // Update the entry
        get().updateMemorizationLevel(id, newLevel)
      },

      getWordsForReview: () => {
        const { notebookEntries } = get()
        const now = new Date()

        return notebookEntries.filter((entry) => {
          // If nextReview is not set, include it
          if (!entry.nextReview) return true

          // Parse the date if it's a string
          const reviewDate = typeof entry.nextReview === "string" ? new Date(entry.nextReview) : entry.nextReview

          // Include if review date is in the past
          return reviewDate <= now
        })
      },

      getMemorizationLevelCounts: () => {
        const { notebookEntries } = get()
        const counts: Record<string, number> = {
          "1": 0,
          "2": 0,
          "3": 0,
          "4": 0,
          "5": 0,
        }

        notebookEntries.forEach((entry) => {
          const level = entry.level || 1
          counts[level.toString()] = (counts[level.toString()] || 0) + 1
        })

        return counts
      },

      getCEFRLevelCounts: () => {
        const { notebookEntries } = get()
        const counts: Record<string, number> = {
          A1: 0,
          A2: 0,
          B1: 0,
          B2: 0,
          C1: 0,
          C2: 0,
        }

        notebookEntries.forEach((entry) => {
          const cefr = entry.cefr || "A1"
          counts[cefr] = (counts[cefr] || 0) + 1
        })

        return counts
      },

      // Debug function to clear notebook
      _debug_clearNotebook: () => {
        set({ notebookEntries: [] })
      },
    }),
    {
      name: "vocab-master-storage",
      storage: createJSONStorage(() => localStorage),
      // Process the state before persisting it
      partialize: (state) => {
        // Make a deep copy to avoid mutating the original state
        const stateCopy = JSON.parse(JSON.stringify(state))

        // Ensure dates are properly serialized for storage
        if (stateCopy.notebookEntries) {
          stateCopy.notebookEntries = stateCopy.notebookEntries.map((entry: NotebookEntry) => {
            // Convert Date objects to ISO strings
            if (entry.dateAdded instanceof Date) {
              entry.dateAdded = entry.dateAdded.toISOString()
            }
            if (entry.lastReviewed instanceof Date) {
              entry.lastReviewed = entry.lastReviewed.toISOString()
            }
            if (entry.nextReview instanceof Date) {
              entry.nextReview = entry.nextReview.toISOString()
            }
            return entry
          })
        }

        return stateCopy
      },
      // Process the state after retrieving it from storage
      onRehydrateStorage: () => (state) => {
        if (state && state.notebookEntries) {
          // Ensure dates are properly parsed from storage
          state.notebookEntries = state.notebookEntries.map(ensureDateFormat)
          console.log("Rehydrated notebook entries:", state.notebookEntries)
        }
      },
    },
  ),
)
