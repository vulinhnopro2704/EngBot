import { create } from "zustand"
import { persist } from "zustand/middleware"
import { v4 as uuidv4 } from "uuid"
import type { PracticeSession, PracticeQuestion, Word, QuestionType, PracticeMode } from "@/data/types"

interface PracticeState {
  // Current practice session
  currentSession: PracticeSession | null
  sessionHistory: PracticeSession[]

  // Practice settings
  autoPlayAudio: boolean
  showHints: boolean

  // Practice stats
  streakCount: number
  totalCorrect: number
  totalIncorrect: number
  hearts: number

  // Actions
  startSession: (mode: PracticeMode, wordCount?: number) => void
  endSession: () => void
  answerQuestion: (questionId: number, answer: string) => boolean
  moveToNextQuestion: () => void
  incrementStreak: () => void
  resetStreak: () => void
  decrementHearts: () => void
  toggleAutoPlayAudio: () => void
  toggleShowHints: () => void

  // Mock data generation (will be replaced with API calls)
  generateMockQuestions: (count: number, mode: PracticeMode) => PracticeQuestion[]
}

// Mock data for practice
const mockWords: Word[] = [
  {
    id: 1,
    word: "ubiquitous",
    meaning: "present, appearing, or found everywhere",
    pronunciation: "/juːˈbɪkwɪtəs/",
    pos: "adjective",
    example: "Mobile phones are now ubiquitous in modern life.",
    example_vi: "Điện thoại di động hiện nay có mặt khắp nơi trong cuộc sống hiện đại.",
    cefr: "C1",
  },
  {
    id: 2,
    word: "ephemeral",
    meaning: "lasting for a very short time",
    pronunciation: "/ɪˈfem(ə)rəl/",
    pos: "adjective",
    example: "The ephemeral nature of fashion trends makes it hard to keep up.",
    example_vi: "Bản chất ngắn ngủi của các xu hướng thời trang khiến việc theo kịp trở nên khó khăn.",
    cefr: "C1",
  },
  {
    id: 3,
    word: "serendipity",
    meaning: "the occurrence of events by chance in a happy or beneficial way",
    pronunciation: "/ˌserənˈdɪpɪti/",
    pos: "noun",
    example: "The discovery of penicillin was a case of serendipity.",
    example_vi: "Việc phát hiện ra penicillin là một trường hợp tình cờ may mắn.",
    cefr: "C1",
  },
  {
    id: 4,
    word: "pragmatic",
    meaning: "dealing with things sensibly and realistically",
    pronunciation: "/præɡˈmætɪk/",
    pos: "adjective",
    example: "We need a pragmatic approach to solving this problem.",
    example_vi: "Chúng ta cần một cách tiếp cận thực tế để giải quyết vấn đề này.",
    cefr: "B2",
  },
  {
    id: 5,
    word: "meticulous",
    meaning: "showing great attention to detail; very careful and precise",
    pronunciation: "/məˈtɪkjʊləs/",
    pos: "adjective",
    example: "He is meticulous in his research.",
    example_vi: "Anh ấy rất tỉ mỉ trong nghiên cứu của mình.",
    cefr: "C1",
  },
  {
    id: 6,
    word: "eloquent",
    meaning: "fluent or persuasive in speaking or writing",
    pronunciation: "/ˈeləkwənt/",
    pos: "adjective",
    example: "She gave an eloquent speech at the conference.",
    example_vi: "Cô ấy đã có một bài phát biểu lưu loát tại hội nghị.",
    cefr: "B2",
  },
  {
    id: 7,
    word: "resilience",
    meaning: "the capacity to recover quickly from difficulties",
    pronunciation: "/rɪˈzɪliəns/",
    pos: "noun",
    example: "The resilience of the human spirit is remarkable.",
    example_vi: "Sức mạnh phục hồi của tinh thần con người thật đáng kinh ngạc.",
    cefr: "C1",
  },
  {
    id: 8,
    word: "ambiguous",
    meaning: "open to more than one interpretation",
    pronunciation: "/æmˈbɪɡjuəs/",
    pos: "adjective",
    example: "The ending of the film was deliberately ambiguous.",
    example_vi: "Kết thúc của bộ phim cố tình mang tính mơ hồ.",
    cefr: "B2",
  },
  {
    id: 9,
    word: "meticulous",
    meaning: "showing great attention to detail; very careful and precise",
    pronunciation: "/məˈtɪkjʊləs/",
    pos: "adjective",
    example: "He is meticulous in his research.",
    example_vi: "Anh ấy rất tỉ mỉ trong nghiên cứu của mình.",
    cefr: "C1",
  },
  {
    id: 10,
    word: "procrastinate",
    meaning: "delay or postpone action; put off doing something",
    pronunciation: "/prəˈkræstɪneɪt/",
    pos: "verb",
    example: "I always procrastinate when it comes to doing my taxes.",
    example_vi: "Tôi luôn trì hoãn khi phải làm thuế.",
    cefr: "B2",
  },
  {
    id: 11,
    word: "meticulous",
    meaning: "showing great attention to detail; very careful and precise",
    pronunciation: "/məˈtɪkjʊləs/",
    pos: "adjective",
    example: "He is meticulous in his research.",
    example_vi: "Anh ấy rất tỉ mỉ trong nghiên cứu của mình.",
    cefr: "C1",
  },
  {
    id: 12,
    word: "benevolent",
    meaning: "well meaning and kindly",
    pronunciation: "/bəˈnevələnt/",
    pos: "adjective",
    example: "A benevolent smile crossed her face.",
    example_vi: "Một nụ cười nhân hậu hiện lên trên khuôn mặt cô ấy.",
    cefr: "C1",
  },
  {
    id: 13,
    word: "quintessential",
    meaning: "representing the most perfect or typical example of a quality or class",
    pronunciation: "/ˌkwɪntɪˈsenʃəl/",
    pos: "adjective",
    example: "He is the quintessential English gentleman.",
    example_vi: "Anh ấy là một quý ông Anh điển hình.",
    cefr: "C1",
  },
  {
    id: 14,
    word: "diligent",
    meaning: "having or showing care and conscientiousness in one's work or duties",
    pronunciation: "/ˈdɪlɪdʒənt/",
    pos: "adjective",
    example: "She's a diligent worker who never misses a deadline.",
    example_vi: "Cô ấy là một người làm việc chăm chỉ, không bao giờ bỏ lỡ thời hạn.",
    cefr: "B2",
  },
  {
    id: 15,
    word: "meticulous",
    meaning: "showing great attention to detail; very careful and precise",
    pronunciation: "/məˈtɪkjʊləs/",
    pos: "adjective",
    example: "He is meticulous in his research.",
    example_vi: "Anh ấy rất tỉ mỉ trong nghiên cứu của mình.",
    cefr: "C1",
  },
]

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
      hearts: 5, // Changed from 3 to 5

      // Actions
      startSession: (mode, wordCount = 10) => {
        const questions = get().generateMockQuestions(wordCount, mode)

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

        set({ currentSession: newSession, streakCount: 0, hearts: 5 }) // Changed from 3 to 5
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

      // Mock data generation
      generateMockQuestions: (count, mode) => {
        // Shuffle and take a subset of mock words
        const shuffled = [...mockWords].sort(() => 0.5 - Math.random())
        const selectedWords = shuffled.slice(0, count)

        // Generate questions based on mode
        switch (mode) {
          case "mixed":
            return selectedWords.map((word, index) => {
              // Alternate between different question types
              const questionTypes: QuestionType[] = [
                "multiple-choice",
                "fill-blank",
                "listening",
                "matching",
                "drag-drop",
              ]
              const type = questionTypes[index % questionTypes.length]

              return createMockQuestion(word, type, mockWords)
            })

          case "multiple-choice":
            return selectedWords.map((word) => createMockQuestion(word, "multiple-choice", mockWords))

          case "fill-blank":
            return selectedWords.map((word) => createMockQuestion(word, "fill-blank", mockWords))

          case "listening":
            return selectedWords.map((word) => createMockQuestion(word, "listening", mockWords))

          case "matching":
            return selectedWords.map((word) => createMockQuestion(word, "matching", mockWords))

          case "drag-drop":
            return selectedWords.map((word) => createMockQuestion(word, "drag-drop", mockWords))

          default:
            return selectedWords.map((word) => createMockQuestion(word, "multiple-choice", mockWords))
        }
      },
    }),
    {
      name: "vocabulary-practice-storage",
    },
  ),
)

// Helper function to create mock questions
function createMockQuestion(word: Word, type: QuestionType, allWords: Word[]): PracticeQuestion {
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
