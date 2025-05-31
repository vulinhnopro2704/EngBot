"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Volume2, Check, X, Lightbulb } from "lucide-react"
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

type ListeningModuleProps = {
  question: PracticeQuestion
  onAnswer: (answer: string) => void
}

export function ListeningModule({ question, onAnswer }: ListeningModuleProps) {
  const [userInput, setUserInput] = useState("")
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [showingFeedback, setShowingFeedback] = useState(false)
  const [showMascot, setShowMascot] = useState(false)
  const [mascotMessage, setMascotMessage] = useState("")
  const [mascotMood, setMascotMood] = useState<"happy" | "sad" | "excited" | "neutral">("neutral")
  const [showHint, setShowHint] = useState(false)
  const [playCount, setPlayCount] = useState(0)
  const [showWordInfo, setShowWordInfo] = useState(false)
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false)
  const [answerSubmitted, setAnswerSubmitted] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const { streakCount, showHints, autoPlayAudio, incrementStreak, resetStreak, decrementHearts } = usePracticeStore()
  const { playAudio, speakWord, cancelSpeech } = useAudio()

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

    // Show mascot based on streak
    if (isCorrect) {
      if (streakCount >= 3) {
        setMascotMessage("Amazing listening skills! Keep it up! 🎧")
        setMascotMood("excited")
        setShowMascot(true)
      } else if (Math.random() > 0.7) {
        setMascotMessage("Great job! Your listening is improving!")
        setMascotMood("happy")
        setShowMascot(true)
      }
    } else {
      if (Math.random() > 0.5) {
        setMascotMessage("Listening takes practice. You'll get better!")
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
    setPlayCount(playCount + 1)
    if (question.word.audio) {
      playAudio(question.word.audio)
    } else {
      speakWord(question.word.word, 0.8)
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

  // Auto-play audio when component mounts
  useEffect(() => {
    if (autoPlayAudio) {
      const timer = setTimeout(() => {
        handlePlayAudio()
      }, 500)

      return () => {
        clearTimeout(timer)
        cancelSpeech()
      }
    }

    return () => {
      cancelSpeech()
    }
  }, [question.id, autoPlayAudio])

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
    setPlayCount(0)
    setShowWordInfo(false)
    setHasSubmittedAnswer(false)
    setAnswerSubmitted(false)
  }, [question.id])

  return (
    <div className="relative">
      <Card className="w-full overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />

        <CardHeader>
          <CardTitle className="text-center">Listen and Type</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <motion.button
              className="h-20 w-20 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlayAudio}
              initial={{ scale: 1 }}
              animate={
                playCount === 0
                  ? { scale: [1, 1.1, 1], transition: { repeat: Number.POSITIVE_INFINITY, repeatDelay: 1.5 } }
                  : { scale: 1 }
              }
            >
              <Volume2 className="h-8 w-8 text-white" />
            </motion.button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">Listen to the word and type what you hear</p>
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
              placeholder="Type what you hear..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="text-center text-lg"
              disabled={showingFeedback}
            />

            <div className="flex justify-between items-center">
              {showHints && !showHint && !showingFeedback && playCount > 0 && (
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
              {(!showHints || showHint || showingFeedback || playCount === 0) && <div />}

              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
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
                      Correct! The word is "{question.word.word}".
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
