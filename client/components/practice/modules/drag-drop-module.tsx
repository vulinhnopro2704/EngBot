"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, X, Volume2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { usePracticeStore } from "@/lib/practice-store"
import { useAudio } from "@/hooks/use-audio"
import { FeedbackEffect } from "@/components/practice/ui/feedback-effect"
import { MascotEncouragement } from "@/components/practice/ui/mascot-encouragement"
import { WordInfoSnackbar } from "@/components/practice/ui/word-info-snackbar"
import type { PracticeQuestion } from "@/data/types"

type ClickSelectModuleProps = {
  question: PracticeQuestion
  onAnswer: (answer: string) => void
}

type WordItem = {
  id: string
  word: string
  isPlaced: boolean
  placedAt?: number
}

export function DragDropModule({ question, onAnswer }: ClickSelectModuleProps) {
  const [sentence, setSentence] = useState<string[]>([])
  const [blanks, setBlanks] = useState<number[]>([])
  const [wordItems, setWordItems] = useState<WordItem[]>([])
  const [filledBlanks, setFilledBlanks] = useState<{ [key: number]: string }>({})
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [showingFeedback, setShowingFeedback] = useState(false)
  const [showMascot, setShowMascot] = useState(false)
  const [mascotMessage, setMascotMessage] = useState("")
  const [mascotMood, setMascotMood] = useState<"happy" | "sad" | "excited" | "neutral">("neutral")
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null)
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false)
  const [showWordInfo, setShowWordInfo] = useState(false)
  const [answerSubmitted, setAnswerSubmitted] = useState(false)

  const { streakCount, incrementStreak, resetStreak, decrementHearts } = usePracticeStore()
  const { playAudio, speakWord, playSound } = useAudio()

  // Process sentence and create word items and blanks
  useEffect(() => {
    // Default sentence if none provided
    const defaultSentence = `The ${question.word.word} is a ${question.word.type} that means ${question.word.meaning}.`

    // Use provided sentence or default
    const sentenceText = question.sentence || defaultSentence

    // Split into words
    const words = sentenceText.split(" ")
    setSentence(words)

    // Determine which words to make into blanks (target word + 2-3 others)
    let blankIndices: number[] = []

    // Always include the target word if it's in the sentence
    const targetWordIndex = words.findIndex(
      (word) => word.toLowerCase().replace(/[.,!?;:]/g, "") === question.word.word.toLowerCase(),
    )

    if (targetWordIndex !== -1) {
      blankIndices.push(targetWordIndex)
    }

    // Add 2-3 more random words as blanks (preferably longer words)
    const potentialBlanks = words
      .map((word, index) => ({ word: word.replace(/[.,!?;:]/g, ""), index }))
      .filter(({ word, index }) => word.length > 3 && index !== targetWordIndex && !blankIndices.includes(index))

    // Randomly select additional blanks
    const additionalBlanks = potentialBlanks
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.min(3, potentialBlanks.length))
      .map((item) => item.index)

    blankIndices = [...blankIndices, ...additionalBlanks].sort((a, b) => a - b) // Sort blanks in ascending order
    setBlanks(blankIndices)

    // Create word items for the blanks
    const items: WordItem[] = blankIndices.map((index) => ({
      id: `word-${index}`,
      word: words[index].replace(/[.,!?;:]/g, ""),
      isPlaced: false,
    }))

    // Shuffle the word items
    setWordItems(items.sort(() => 0.5 - Math.random()))
  }, [question.sentence, question.word])

  const handleWordClick = (wordId: string) => {
    if (showingFeedback) return

    // Find the word
    const word = wordItems.find((item) => item.id === wordId)
    if (!word || word.isPlaced) return

    // Use playSound instead of playAudio for better reliability
    playSound("click")

    setSelectedWordId(wordId)

    // Find the first empty blank (leftmost)
    const sortedBlanks = [...blanks].sort((a, b) => a - b)
    const emptyBlankIndex = sortedBlanks.find((index) => !filledBlanks[index])

    if (emptyBlankIndex !== undefined) {
      // Place the word in the blank
      const newFilledBlanks = { ...filledBlanks }
      newFilledBlanks[emptyBlankIndex] = wordId
      setFilledBlanks(newFilledBlanks)

      // Mark the word as placed
      setWordItems(
        wordItems.map((item) => (item.id === wordId ? { ...item, isPlaced: true, placedAt: emptyBlankIndex } : item)),
      )

      // Clear selection
      setSelectedWordId(null)

      // Check if all blanks are filled
      if (Object.keys(newFilledBlanks).length === blanks.length) {
        checkAnswers(newFilledBlanks)
      }
    }
  }

  const handleBlankClick = (blankIndex: number) => {
    if (showingFeedback) return

    // If the blank is already filled, remove the word
    if (filledBlanks[blankIndex]) {
      const wordId = filledBlanks[blankIndex]

      // Remove from filled blanks
      const newFilledBlanks = { ...filledBlanks }
      delete newFilledBlanks[blankIndex]
      setFilledBlanks(newFilledBlanks)

      // Mark the word as not placed
      setWordItems(
        wordItems.map((item) => (item.id === wordId ? { ...item, isPlaced: false, placedAt: undefined } : item)),
      )

      // Use playSound instead of playAudio for better reliability
      playSound("click")
    }
    // If a word is selected, place it in this blank
    else if (selectedWordId) {
      // Place the word in the blank
      const newFilledBlanks = { ...filledBlanks }
      newFilledBlanks[blankIndex] = selectedWordId
      setFilledBlanks(newFilledBlanks)

      // Mark the word as placed
      setWordItems(
        wordItems.map((item) =>
          item.id === selectedWordId ? { ...item, isPlaced: true, placedAt: blankIndex } : item,
        ),
      )

      // Clear selection
      setSelectedWordId(null)

      // Use playSound instead of playAudio for better reliability
      playSound("click")

      // Check if all blanks are filled
      if (Object.keys(newFilledBlanks).length === blanks.length) {
        checkAnswers(newFilledBlanks)
      }
    }
  }

  const checkAnswers = (filledBlanks: { [key: number]: string }) => {
    if (hasSubmittedAnswer) return

    // Count correct placements
    let correctCount = 0

    Object.entries(filledBlanks).forEach(([blankIndex, wordId]) => {
      const blank = Number.parseInt(blankIndex)
      const word = wordItems.find((item) => item.id === wordId)

      if (word && word.id === `word-${blank}`) {
        correctCount++
      }
    })

    const allCorrect = correctCount === blanks.length
    setHasSubmittedAnswer(true)

    // Show feedback after a short delay
    setTimeout(() => {
      setFeedback(allCorrect ? "correct" : "incorrect")
      setShowingFeedback(true)

      // Update streak or deduct heart
      if (allCorrect) {
        incrementStreak()
        playSound("correct")
      } else {
        resetStreak()
        decrementHearts()
        playSound("incorrect")
      }

      // Show mascot based on result
      if (allCorrect) {
        if (streakCount >= 3) {
          setMascotMessage("Amazing! You're on a winning streak! 🔥")
          setMascotMood("excited")
          setShowMascot(true)
        } else if (Math.random() > 0.7) {
          setMascotMessage("Perfect! You completed the sentence correctly!")
          setMascotMood("happy")
          setShowMascot(true)
        }
      } else {
        if (Math.random() > 0.5) {
          setMascotMessage("Almost there! Keep practicing!")
          setMascotMood("sad")
          setShowMascot(true)
        }
      }

      // Pronounce the word after showing feedback
      setTimeout(() => {
        speakWord(question.word.word)
      }, 1000)

      // Show word info for all answers
      setTimeout(() => {
        setShowWordInfo(true)
      }, 1500)
    }, 500)
  }

  const handlePlayAudio = () => {
    if (question.word.audio) {
      playAudio(question.word.audio)
    } else {
      speakWord(question.word.word)
    }
  }

  const handleReset = () => {
    // Reset all filled blanks
    setFilledBlanks({})

    // Reset all word items
    setWordItems(
      wordItems.map((item) => ({
        ...item,
        isPlaced: false,
        placedAt: undefined,
      })),
    )

    // Clear selection
    setSelectedWordId(null)

    // Use playSound instead of playAudio for better reliability
    playSound("click")
  }

  const handleSkip = () => {
    if (hasSubmittedAnswer) return

    setFeedback("incorrect")
    setShowingFeedback(true)
    setHasSubmittedAnswer(true)

    // Reset streak and deduct heart
    resetStreak()
    decrementHearts()

    // Show the correct answers
    const correctFilledBlanks: { [key: number]: string } = {}
    blanks.forEach((blankIndex) => {
      correctFilledBlanks[blankIndex] = `word-${blankIndex}`
    })
    setFilledBlanks(correctFilledBlanks)

    // Mark all words as placed in their correct positions
    setWordItems(
      wordItems.map((item) => {
        const blankIndex = Number.parseInt(item.id.replace("word-", ""))
        return {
          ...item,
          isPlaced: true,
          placedAt: blankIndex,
        }
      }),
    )

    // Show mascot
    setMascotMessage("Let's try a different one!")
    setMascotMood("neutral")
    setShowMascot(true)

    // Show word info
    setTimeout(() => {
      setShowWordInfo(true)
    }, 1500)
  }

  const handleContinue = () => {
    if (!answerSubmitted) {
      setAnswerSubmitted(true)
      // Submit the answer
      onAnswer(feedback === "correct" ? "correct" : "skipped")
    }
  }

  // Reset state when question changes
  useEffect(() => {
    setFilledBlanks({})
    setFeedback(null)
    setShowingFeedback(false)
    setShowMascot(false)
    setSelectedWordId(null)
    setHasSubmittedAnswer(false)
    setShowWordInfo(false)
    setAnswerSubmitted(false)
  }, [question.id])

  // Get the word to display in a blank
  const getBlankText = (blankIndex: number) => {
    const wordId = filledBlanks[blankIndex]
    if (!wordId) return "_______"

    const word = wordItems.find((item) => item.id === wordId)
    return word ? word.word : "_______"
  }

  // Check if a word placement is correct (for feedback)
  const isCorrectPlacement = (blankIndex: number) => {
    if (!showingFeedback) return true

    const wordId = filledBlanks[blankIndex]
    if (!wordId) return false

    return wordId === `word-${blankIndex}`
  }

  return (
    <div className="relative">
      <Card className="w-full overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />

        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Complete the sentence</span>
            <Button variant="ghost" size="icon" onClick={handlePlayAudio} title="Play pronunciation">
              <Volume2 className="h-5 w-5" />
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Sentence with blanks */}
          <div className="p-4 bg-primary/5 rounded-md min-h-[100px]">
            <div className="flex flex-wrap gap-1">
              {sentence.map((word, index) => {
                const punctuation = word.match(/[.,!?;:]/g)?.[0] || ""
                const cleanWord = word.replace(/[.,!?;:]/g, "")

                // Check if this word should be a blank
                const isBlank = blanks.includes(index)

                return isBlank ? (
                  <motion.div
                    key={`blank-${index}`}
                    className={`relative inline-flex min-w-[80px] h-[38px] border-2 ${
                      showingFeedback
                        ? isCorrectPlacement(index)
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : filledBlanks[index]
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-dashed border-gray-300"
                    } rounded px-2 mr-1 items-center justify-center cursor-pointer`}
                    onClick={() => handleBlankClick(index)}
                    whileHover={{ scale: filledBlanks[index] || showingFeedback ? 1 : 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className={filledBlanks[index] ? "" : "text-gray-400"}>{getBlankText(index)}</span>
                    {punctuation}
                  </motion.div>
                ) : (
                  <div key={`text-${index}`} className="mr-1">
                    {word}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Word options */}
          <div className="flex flex-wrap gap-2 justify-center">
            {wordItems.map((item) => (
              <motion.button
                key={item.id}
                disabled={item.isPlaced || showingFeedback}
                onClick={() => handleWordClick(item.id)}
                className={`rounded-md px-3 py-1 ${
                  item.isPlaced
                    ? "bg-gray-100 text-gray-500 dark:bg-gray-800 cursor-not-allowed"
                    : selectedWordId === item.id
                      ? "bg-blue-600 text-white shadow-md dark:bg-blue-700"
                      : "bg-blue-500 text-white shadow-md dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: item.isPlaced ? 0.5 : 1,
                  y: 0,
                  scale: item.isPlaced ? 0.95 : 1,
                }}
                whileHover={{
                  scale: item.isPlaced ? 0.95 : 1.05,
                  boxShadow: item.isPlaced ? "none" : "0 5px 15px rgba(0,0,0,0.1)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                {item.word}
              </motion.button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleReset}
              disabled={Object.keys(filledBlanks).length === 0 || showingFeedback}
            >
              Reset
            </Button>

            <Button variant="outline" className="flex-1" onClick={handleSkip} disabled={showingFeedback}>
              Skip
            </Button>
          </div>

          {showingFeedback && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Alert variant={feedback === "correct" ? "default" : "destructive"}>
                <AlertDescription className="flex items-center gap-2">
                  {feedback === "correct" ? (
                    <>
                      <Check className="h-4 w-4" />
                      Great job! You completed the sentence correctly.
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4" />
                      Let's try again. The correct word order has been shown.
                    </>
                  )}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Visual feedback effect */}
      {showingFeedback && <FeedbackEffect isCorrect={feedback === "correct"} />}

      {/* Mascot encouragement */}
      {showMascot && (
        <MascotEncouragement message={mascotMessage} mood={mascotMood} onComplete={() => setShowMascot(false)} />
      )}

      {/* Word information snackbar */}
      <WordInfoSnackbar
        word={question.word}
        isVisible={showWordInfo}
        onClose={() => setShowWordInfo(false)}
        onContinue={handleContinue}
        showContinueButton={true}
        isCorrect={feedback === "correct"}
      />
    </div>
  )
}
