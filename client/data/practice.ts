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

// Generate matching pairs for a word
export function generateMatchingPairs(word: VocabularyWord, allWords: VocabularyWord[]): any[] {
  // Get 5 additional random words
  const additionalWords = allWords
    .filter((w) => w.id !== word.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 5)

  const allWordsForPairs = [word, ...additionalWords]

  // Create pairs
  const pairs = allWordsForPairs.flatMap((w, index) => [
    { id: `a-${w.id}`, text: w.word, matchId: `b-${w.id}` },
    { id: `b-${w.id}`, text: w.definition || w.meaning, matchId: `a-${w.id}` },
  ])

  return pairs
}

// Generate a sentence for drag-drop exercise
export function generateDragDropSentence(word: VocabularyWord): { sentence: string; dragWords: string[] } {
  if (!word.example) {
    const sentence = `The ${word.word} is a ${word.type || "word"} that means ${word.definition || word.meaning}.`
    return {
      sentence,
      dragWords: [word.word, word.type || "word", word.definition || word.meaning],
    }
  }

  const sentence = word.example
  const words = sentence.split(" ")

  // Find the target word in the sentence
  const targetIndex = words.findIndex((w) => w.replace(/[.,!?;:]/g, "").toLowerCase() === word.word.toLowerCase())

  // Select 2-3 additional words (preferably longer ones)
  const additionalWords = words
    .map((w, i) => ({ word: w.replace(/[.,!?;:]/g, ""), index: i }))
    .filter(({ word, index }) => word.length > 3 && index !== targetIndex)
    .sort(() => 0.5 - Math.random())
    .slice(0, 2)

  const dragWords = [
    ...(targetIndex !== -1 ? [words[targetIndex].replace(/[.,!?;:]/g, "")] : []),
    ...additionalWords.map(({ word }) => word),
  ]

  return { sentence, dragWords }
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
    case "matching":
      return {
        id: Math.floor(Math.random() * 10000),
        type: "matching",
        word,
        pairs: generateMatchingPairs(word, allWords),
        correctAnswer: "matched",
      }
    case "drag-drop":
      const { sentence, dragWords } = generateDragDropSentence(word)
      return {
        id: Math.floor(Math.random() * 10000),
        type: "drag-drop",
        word,
        sentence,
        dragWords,
        correctAnswer: "correct",
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
    if (i % 5 === 0) questionTypes.push("multiple-choice")
    else if (i % 5 === 1) questionTypes.push("fill-blank")
    else if (i % 5 === 2) questionTypes.push("listening")
    else if (i % 5 === 3) questionTypes.push("matching")
    else questionTypes.push("drag-drop")
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
