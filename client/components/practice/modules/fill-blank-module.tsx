"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, X, Volume2, Lightbulb } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { usePracticeStore } from "@/lib/practice-store"
import { useAudio } from "@/hooks/use-audio"
import { FeedbackEffect } from "@/components/practice/ui/feedback-effect"
import { MascotEncouragement } from "@/components/practice/ui/mascot-encouragement"
import { WordInfoSnackbar } from "@/components/practice/ui/word-info-snackbar"
import type { PracticeQuestion } from "@/data/types"

type FillBlankModuleProps = {
  question: PracticeQuestion
  onAnswer: (answer: string) => void
}

export function FillBlankModule({ question, onAnswer }: FillBlankModuleProps) {
  const [userInput, setUserInput] = useState("")
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [showingFeedback, setShowingFeedback] = useState(false)
  const [showMascot, setShowMascot] = useState(false)
  const [mascotMessage, setMascotMessage] = useState("")
  const [mascotMood, setMascotMood] = useState<"happy" | "sad" | "excited" | "neutral">("neutral")
  const [showHint, setShowHint] = useState(false)
  const [showWordInfo, setShowWordInfo] = useState(false)
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false)
  const [answerSubmitted, setAnswerSubmitted] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const { streakCount, showHints, incrementStreak, resetStreak, decrementHearts } = usePracticeStore()
  const { playAudio, speakWord } = useAudio()

  // Generate a sentence with a blank
  const generateSentence = () => {
    if (!question.word.example) {
      return `Please use the word "${question.word.word}" in a sentence.`
    }

    const sentence = question.word.example
    const wordRegex = new RegExp(`\\b${question.word.word}\\b`, "i")
    return sentence.replace(wordRegex, "_______")
  }

  // Generate a hint (first letter + number of remaining letters)
  const generateHint = () => {
    const word = question.word.word
    return `${word[0]}${"_ ".repeat(word.length - 1)}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInput.trim() || showingFeedback || hasSubmittedAnswer) return
    setHasSubmittedAnswer(true)

    const isCorrect = userInput.toLowerCase() === question.word.word.toLowerCase()
    setFeedback(isCorrect ? "correct" : "incorrect")
    setShowingFeedback(true)

    // Update streak or deduct heart
    if (isCorrect) {
      incrementStreak()
      playAudio("/sounds/correct.mp3")
    } else {
      resetStreak()
      decrementHearts()
      playAudio("/sounds/incorrect.mp3")
    }

    // Show mascot based on streak or result
    if (isCorrect) {
      if (streakCount >= 3) {
        setMascotMessage("Fantastic streak! You're on fire! 🔥")
        setMascotMood("excited")
        setShowMascot(true)
      } else if (Math.random() > 0.7) {
        setMascotMessage("Well done! Perfect answer!")
        setMascotMood("happy")
        setShowMascot(true)
      }
    } else {
      if (Math.random() > 0.5) {
        setMascotMessage("Keep trying! You're learning!")
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
  }

  const handlePlayAudio = () => {
    if (question.word.audio) {
      playAudio(question.word.audio)
    } else {
      speakWord(question.word.word)
    }
  }

  const handleShowHint = () => {
    setShowHint(true)
    playAudio("/sounds/hint.mp3")
  }

  const handleContinue = () => {
    if (!answerSubmitted) {
      setAnswerSubmitted(true)
      // Submit the answer
      onAnswer(userInput)
    }
  }

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [question.id])

  // Reset state when question changes
  useEffect(() => {
    setUserInput("")
    setFeedback(null)
    setShowingFeedback(false)
    setShowMascot(false)
    setShowHint(false)
    setShowWordInfo(false)
    setHasSubmittedAnswer(false)
    setAnswerSubmitted(false)
  }, [question.id])

  const sentence = generateSentence()

  return (
    <div className="relative">
      <Card className="w-full overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-teal-500" />

        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Fill in the blank</span>
            <Button variant="ghost" size="icon" onClick={handlePlayAudio} title="Play pronunciation">
              <Volume2 className="h-5 w-5" />
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <motion.div
            className="p-4 bg-primary/5 rounded-md"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-lg leading-relaxed">{sentence}</p>
          </motion.div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Definition: {question.word.meaning}</p>
            {question.word.pos && (
              <Badge variant="outline" className="mt-2">
                {question.word.pos}
              </Badge>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Type the missing word..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="text-center text-lg"
              disabled={showingFeedback}
            />

            <div className="flex justify-between items-center">
              {showHints && !showHint && !showingFeedback && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleShowHint}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Lightbulb className="mr-1 h-4 w-4" />
                  Need a hint?
                </Button>
              )}
              {!showHints && <div />}

              <Button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                disabled={!userInput.trim() || showingFeedback}
              >
                Submit Answer
              </Button>
            </div>
          </form>

          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-amber-50 dark:bg-amber-950/50 p-3 rounded-md border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"
            >
              <p className="text-sm">
                <span className="font-medium">Hint:</span> {generateHint()}
              </p>
            </motion.div>
          )}

          {showingFeedback && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Alert variant={feedback === "correct" ? "default" : "destructive"}>
                <AlertDescription className="flex items-center gap-2">
                  {feedback === "correct" ? (
                    <>
                      <Check className="h-4 w-4" />
                      Correct! The missing word is "{question.word.word}".
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4" />
                      Incorrect. The correct word is "{question.word.word}".
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
