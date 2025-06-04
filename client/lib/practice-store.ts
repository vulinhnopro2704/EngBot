import { create } from "zustand"
import { persist } from "zustand/middleware"
import { v4 as uuidv4 } from "uuid"
import type { PracticeSession, PracticeQuestion, Word, QuestionType, PracticeMode } from "@/data/types"
import { fetchReviewWords, submitReviewWords, ReviewWordItem } from "@/service/word"

interface PracticeState {
  // Current practice session
  currentSession: PracticeSession | null
  sessionHistory: PracticeSession[]

  // Review words data
  reviewWordsResult: ReviewWordItem[] | null

  // Practice settings
  autoPlayAudio: boolean
  showHints: boolean
  isLoading: boolean

  // Practice stats
  streakCount: number
  totalCorrect: number
  totalIncorrect: number
  hearts: number

  // Actions
  startSession: (mode: PracticeMode, wordCount?: number) => Promise<void>
  endSession: () => void
  submitReviewSession: () => Promise<void>
  answerQuestion: (questionId: number, answer: string) => boolean
  moveToNextQuestion: () => void
  incrementStreak: () => void
  resetStreak: () => void
  decrementHearts: () => void
  toggleAutoPlayAudio: () => void
  toggleShowHints: () => void
  clearReviewWordsResult: () => void

  // Real data generation
  generateQuestionsFromReviewWords: (count: number, mode: PracticeMode, reviewWords: any[]) => PracticeQuestion[]
}

export const usePracticeStore = create<PracticeState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentSession: null,
      sessionHistory: [],
      autoPlayAudio: true,
      showHints: true,
      streakCount: 0,
      totalCorrect: 0,
      totalIncorrect: 0,
      hearts: 5,
      isLoading: false,
      reviewWordsResult: null,

      // Actions
      startSession: async (mode, wordCount = 10) => {
        set({ isLoading: true })

        try {
          // Fetch real review words from API
          const response = await fetchReviewWords()
          const reviewWords = response.words || []

          // Limit to the requested word count
          const selectedWords = reviewWords.slice(0, wordCount)

          if (selectedWords.length === 0) {
            console.error("No review words available")
            set({ isLoading: false })
            return
          }

          const questions = get().generateQuestionsFromReviewWords(selectedWords.length, mode, selectedWords)

          const newSession: PracticeSession = {
            id: uuidv4(),
            mode,
            questions,
            currentQuestionIndex: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            startTime: new Date(),
            completed: false,
            results: [],
          }

          set({ currentSession: newSession, streakCount: 0, hearts: 5, isLoading: false })
        } catch (error) {
          console.error("Failed to fetch review words:", error)
          set({ isLoading: false })
        }
      },

      endSession: () => {
        const currentSession = get().currentSession
        if (!currentSession) return

        const completedSession = {
          ...currentSession,
          completed: true,
          endTime: new Date(),
        }

        set((state) => ({
          currentSession: null,
          sessionHistory: [completedSession, ...state.sessionHistory].slice(0, 20), // Keep last 20 sessions
        }))
      },

      // Add new function to submit review session results
      submitReviewSession: async () => {
        const currentSession = get().currentSession
        if (!currentSession) return

        set({ isLoading: true })

        try {
          // Get words from the current session
          const sessionWords = currentSession.questions.map((q) => q.word)

          // Submit the review words
          const response = await submitReviewWords(sessionWords)

          // Store the result
          set({
            reviewWordsResult: response.words,
            isLoading: false,
          })

          // End the session
          get().endSession()
        } catch (error) {
          console.error("Failed to submit review words:", error)
          set({ isLoading: false })
          // Still end the session even if submission fails
          get().endSession()
        }
      },

      clearReviewWordsResult: () => {
        set({ reviewWordsResult: null })
      },

      answerQuestion: (questionId, answer) => {
        const { currentSession } = get()
        if (!currentSession) return false

        const questionIndex = currentSession.questions.findIndex((q) => q.id === questionId)
        if (questionIndex === -1) return false

        const question = currentSession.questions[questionIndex]
        const isCorrect = question.correctAnswer.toLowerCase() === answer.toLowerCase()

        // Update session with result
        const updatedSession = {
          ...currentSession,
          correctAnswers: isCorrect ? currentSession.correctAnswers + 1 : currentSession.correctAnswers,
          incorrectAnswers: !isCorrect ? currentSession.incorrectAnswers + 1 : currentSession.incorrectAnswers,
          results: [
            ...currentSession.results,
            {
              questionId,
              userAnswer: answer,
              isCorrect,
              timestamp: new Date(),
            },
          ],
        }

        set({
          currentSession: updatedSession,
          totalCorrect: get().totalCorrect + (isCorrect ? 1 : 0),
          totalIncorrect: get().totalIncorrect + (!isCorrect ? 1 : 0),
        })

        return isCorrect
      },

      moveToNextQuestion: () => {
        const { currentSession } = get()
        if (!currentSession) return

        const nextIndex = currentSession.currentQuestionIndex + 1

        // If we've reached the end, complete the session
        if (nextIndex >= currentSession.questions.length) {
          get().endSession()
          return
        }

        // Otherwise, move to next question
        set({
          currentSession: {
            ...currentSession,
            currentQuestionIndex: nextIndex,
          },
        })
      },

      incrementStreak: () => {
        set((state) => ({ streakCount: state.streakCount + 1 }))
      },

      resetStreak: () => {
        set({ streakCount: 0 })
      },

      decrementHearts: () => {
        set((state) => ({ hearts: Math.max(0, state.hearts - 1) }))
      },

      toggleAutoPlayAudio: () => {
        set((state) => ({ autoPlayAudio: !state.autoPlayAudio }))
      },

      toggleShowHints: () => {
        set((state) => ({ showHints: !state.showHints }))
      },

      // Replace mock data generation with real data
      generateQuestionsFromReviewWords: (count, mode, reviewWords) => {
        // Make sure we don't exceed available words
        const availableCount = Math.min(count, reviewWords.length)
        const selectedWords = reviewWords.slice(0, availableCount)

        // Generate questions based on mode
        switch (mode) {
          case "mixed":
            return selectedWords.map((reviewWord, index) => {
              // Extract the actual word data from the review word
              const word = reviewWord.word

              // Alternate between different question types
              const questionTypes: QuestionType[] = [
                "multiple-choice",
                "fill-blank",
                "listening",
                "matching",
                "drag-drop",
              ]
              const type = questionTypes[index % questionTypes.length]

              return createQuestion(word, type, selectedWords.map((rw) => rw.word))
            })

          case "multiple-choice":
            return selectedWords.map((rw) => createQuestion(rw.word, "multiple-choice", selectedWords.map((rw) => rw.word)))

          case "fill-blank":
            return selectedWords.map((rw) => createQuestion(rw.word, "fill-blank", selectedWords.map((rw) => rw.word)))

          case "listening":
            return selectedWords.map((rw) => createQuestion(rw.word, "listening", selectedWords.map((rw) => rw.word)))

          case "matching":
            return selectedWords.map((rw) => createQuestion(rw.word, "matching", selectedWords.map((rw) => rw.word)))

          case "drag-drop":
            return selectedWords.map((rw) => createQuestion(rw.word, "drag-drop", selectedWords.map((rw) => rw.word)))

          default:
            return selectedWords.map((rw) => createQuestion(rw.word, "multiple-choice", selectedWords.map((rw) => rw.word)))
        }
      },
    }),
    {
      name: "vocabulary-practice-storage",
    },
  ),
)

// Helper function to create questions from real data
function createQuestion(word: any, type: QuestionType, allWords: any[]): PracticeQuestion {
  const baseQuestion = {
    id: Math.floor(Math.random() * 10000),
    word,
    type,
    correctAnswer: type === "multiple-choice" ? word.meaning : word.word,
  }

  switch (type) {
    case "multiple-choice":
      // Generate 3 incorrect options from other words
      const incorrectOptions = allWords
        .filter((w) => w.id !== word.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((w) => w.meaning)

      // Add correct answer and shuffle
      const options = [...incorrectOptions, word.meaning].sort(() => 0.5 - Math.random())

      return {
        ...baseQuestion,
        options,
      }

    case "matching":
      // Generate 5 additional random words for matching
      const additionalWords = allWords
        .filter((w) => w.id !== word.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 5)

      // Create pairs for matching
      const pairs = [word, ...additionalWords].flatMap((w) => [
        { id: `a-${w.id}`, text: w.word, matchId: `b-${w.id}` },
        { id: `b-${w.id}`, text: w.meaning, matchId: `a-${w.id}` },
      ])

      return {
        ...baseQuestion,
        pairs,
      }

    case "drag-drop":
      // Generate a sentence with blanks
      const sentence = word.example || `The word "${word.word}" means ${word.meaning}.`

      // Select words to drag
      const words = sentence.split(" ")
      const dragWords = [
        word.word,
        ...words
          .filter((w) => w.length > 3 && w.toLowerCase() !== word.word.toLowerCase())
          .sort(() => 0.5 - Math.random())
          .slice(0, 2)
          .map((w) => w.replace(/[.,!?;:]/g, "")),
      ]

      return {
        ...baseQuestion,
        sentence,
        dragWords,
      }

    default:
      return baseQuestion
  }
}
