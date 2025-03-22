import { v4 as uuidv4 } from "uuid"
import type { PracticeQuestion, PracticeSession, QuestionType, VocabularyWord } from "@/data/types"
import { getRandomVocabularyWords, getVocabularyWords } from "@/data/vocabulary"

// Generate multiple choice options for a word
export function generateMultipleChoiceOptions(correctWord: VocabularyWord, allWords: VocabularyWord[]): string[] {
  // Filter out the correct word and get 3 random incorrect options
  const incorrectWords = allWords
    .filter((word) => word.id !== correctWord.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map((word) => word.definition)

  // Add the correct answer and shuffle
  const options = [...incorrectWords, correctWord.definition]
  return options.sort(() => 0.5 - Math.random())
}

// Generate a fill-in-the-blank sentence
export function generateFillBlankSentence(word: VocabularyWord): string {
  if (!word.example) {
    return `Please use the word "${word.word}" in a sentence.`
  }

  const sentence = word.example
  const wordRegex = new RegExp(`\\b${word.word}\\b`, "i")
  return sentence.replace(wordRegex, "_______")
}

// Generate a practice question
export function generatePracticeQuestion(
  word: VocabularyWord,
  type: QuestionType,
  allWords: VocabularyWord[],
): PracticeQuestion {
  switch (type) {
    case "multiple-choice":
      return {
        id: Math.floor(Math.random() * 10000),
        type: "multiple-choice",
        word,
        options: generateMultipleChoiceOptions(word, allWords),
        correctAnswer: word.definition,
      }
    case "fill-blank":
      return {
        id: Math.floor(Math.random() * 10000),
        type: "fill-blank",
        word,
        correctAnswer: word.word.toLowerCase(),
      }
    case "listening":
      return {
        id: Math.floor(Math.random() * 10000),
        type: "listening",
        word,
        correctAnswer: word.word.toLowerCase(),
      }
    default:
      throw new Error(`Unknown question type: ${type}`)
  }
}

// Create a new practice session
export function createPracticeSession(questionCount = 10, courseId?: number, lessonId?: number): PracticeSession {
  // Get words either from specific course/lesson or random words
  const words =
    courseId && lessonId ? getVocabularyWords(courseId, lessonId) : getRandomVocabularyWords(questionCount * 2) // Get more words than needed to ensure variety

  // Ensure we have enough words
  const availableWords = words.length > questionCount ? words : getRandomVocabularyWords(questionCount * 2)

  // Shuffle and take
  const shuffledWords = [...availableWords].sort(() => 0.5 - Math.random()).slice(0, questionCount)

  // Create a mix of question types
  const questionTypes: QuestionType[] = []

  // Distribute question types evenly
  for (let i = 0; i < questionCount; i++) {
    if (i % 3 === 0) questionTypes.push("multiple-choice")
    else if (i % 3 === 1) questionTypes.push("fill-blank")
    else questionTypes.push("listening")
  }

  // Shuffle question types
  const shuffledTypes = [...questionTypes].sort(() => 0.5 - Math.random())

  // Generate questions
  const questions: PracticeQuestion[] = shuffledWords.map((word, index) => {
    return generatePracticeQuestion(word, shuffledTypes[index], availableWords)
  })

  // Create and return the session
  return {
    id: uuidv4(),
    courseId,
    lessonId,
    questions,
    currentQuestionIndex: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    startTime: new Date(),
    completed: false,
  }
}

// Calculate score for a practice session
export function calculatePracticeScore(session: PracticeSession): number {
  const totalAnswered = session.correctAnswers + session.incorrectAnswers
  if (totalAnswered === 0) return 0

  return Math.round((session.correctAnswers / totalAnswered) * 100)
}

// Calculate time spent on a practice session in seconds
export function calculateTimeSpent(session: PracticeSession): number {
  const endTime = session.endTime || new Date()
  const startTime = session.startTime

  return Math.round((endTime.getTime() - startTime.getTime()) / 1000)
}

