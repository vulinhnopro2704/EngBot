"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Volume2, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { usePracticeStore } from "@/lib/practice-store"
import { useAudio } from "@/hooks/use-audio"
import { FeedbackEffect } from "@/components/practice/ui/feedback-effect"
import { MascotEncouragement } from "@/components/practice/ui/mascot-encouragement"
import { WordInfoSnackbar } from "@/components/practice/ui/word-info-snackbar"
import type { PracticeQuestion } from "@/data/types"

type ListeningChoiceModuleProps = {
  question: PracticeQuestion
  onAnswer: (answer: string) => void
}

export function ListeningChoiceModule({ question, onAnswer }: ListeningChoiceModuleProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [showingFeedback, setShowingFeedback] = useState(false)
  const [showMascot, setShowMascot] = useState(false)
  const [mascotMessage, setMascotMessage] = useState("")
  const [mascotMood, setMascotMood] = useState<"happy" | "sad" | "excited" | "neutral">("neutral")
  const [playCount, setPlayCount] = useState(0)
  const [showWordInfo, setShowWordInfo] = useState(false)
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false)
  const [answerSubmitted, setAnswerSubmitted] = useState(false)

  const { streakCount, autoPlayAudio, incrementStreak, resetStreak, decrementHearts } = usePracticeStore()
  const { playAudio, speakWord, cancelSpeech } = useAudio()

  const handleSelectOption = (option: string) => {
    if (showingFeedback) return
    setSelectedOption(option)
  }

  const handleSubmit = () => {
    if (!selectedOption || showingFeedback || hasSubmittedAnswer) return
    setHasSubmittedAnswer(true)

    const isCorrect = selectedOption === question.correctAnswer
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

  const handleContinue = () => {
    if (!answerSubmitted) {
      setAnswerSubmitted(true)
      // Submit the answer
      onAnswer(selectedOption || "")
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

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null)
    setFeedback(null)
    setShowingFeedback(false)
    setShowMascot(false)
    setPlayCount(0)
    setShowWordInfo(false)
    setHasSubmittedAnswer(false)
    setAnswerSubmitted(false)
  }, [question.id])

  return (
    <div className="relative">
      <Card className="w-full overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />

        <CardHeader>
          <CardTitle className="text-center">Listen and Choose</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <motion.button
              className="h-20 w-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg"
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
            <p className="text-sm text-muted-foreground">Listen to the word and select the correct meaning</p>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {question.options?.map((option, index) => (
                <motion.div
                  key={option}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left p-4 h-auto ${
                      selectedOption === option
                        ? "border-primary bg-primary/5"
                        : showingFeedback && option === question.correctAnswer
                          ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                          : showingFeedback && selectedOption === option
                            ? "border-red-500 bg-red-50 dark:bg-red-950/30"
                            : ""
                    }`}
                    onClick={() => handleSelectOption(option)}
                    disabled={showingFeedback}
                  >
                    <div className="flex justify-between w-full items-center">
                      <span>{option}</span>
                      {showingFeedback && option === question.correctAnswer && (
                        <Check className="h-5 w-5 text-green-500" />
                      )}
                      {showingFeedback && selectedOption === option && option !== question.correctAnswer && (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            onClick={handleSubmit}
            disabled={!selectedOption || showingFeedback}
          >
            Submit Answer
          </Button>

          {showingFeedback && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Alert variant={feedback === "correct" ? "default" : "destructive"}>
                <AlertDescription className="flex items-center gap-2">
                  {feedback === "correct" ? (
                    <>
                      <Check className="h-4 w-4" />
                      Correct! The meaning of "{question.word.word}" is "{question.correctAnswer}".
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4" />
                      Incorrect. The correct meaning of "{question.word.word}" is "{question.correctAnswer}".
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
