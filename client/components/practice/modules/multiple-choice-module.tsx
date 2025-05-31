"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Volume2, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { usePracticeStore } from "@/lib/practice-store"
import { useAudio } from "@/hooks/use-audio"
import { FeedbackEffect } from "@/components/practice/ui/feedback-effect"
import { MascotEncouragement } from "@/components/practice/ui/mascot-encouragement"
import { WordInfoSnackbar } from "@/components/practice/ui/word-info-snackbar"
import type { PracticeQuestion } from "@/data/types"

type MultipleChoiceModuleProps = {
  question: PracticeQuestion
  onAnswer: (answer: string) => void
}

export function MultipleChoiceModule({ question, onAnswer }: MultipleChoiceModuleProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [showingFeedback, setShowingFeedback] = useState(false)
  const [showMascot, setShowMascot] = useState(false)
  const [mascotMessage, setMascotMessage] = useState("")
  const [mascotMood, setMascotMood] = useState<"happy" | "sad" | "excited" | "neutral">("neutral")
  const [showWordInfo, setShowWordInfo] = useState(false)
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false)
  const [answerSubmitted, setAnswerSubmitted] = useState(false)

  const { streakCount, incrementStreak, resetStreak, decrementHearts } = usePracticeStore()
  const { playAudio, speakWord } = useAudio()

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
        setMascotMessage("Amazing streak! Keep it up! 🔥")
        setMascotMood("excited")
        setShowMascot(true)
      } else if (Math.random() > 0.7) {
        setMascotMessage("Great job! You're doing well!")
        setMascotMood("happy")
        setShowMascot(true)
      }
    } else {
      if (Math.random() > 0.5) {
        setMascotMessage("Don't worry! You'll get it next time!")
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

  const handleContinue = () => {
    if (!answerSubmitted) {
      setAnswerSubmitted(true)
      // Submit the answer
      onAnswer(selectedOption || "")
    }
  }

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null)
    setFeedback(null)
    setShowingFeedback(false)
    setShowMascot(false)
    setShowWordInfo(false)
    setHasSubmittedAnswer(false)
    setAnswerSubmitted(false)
  }, [question.id])

  return (
    <div className="relative">
      <Card className="w-full overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Choose the correct definition</span>
            <Button variant="ghost" size="icon" onClick={handlePlayAudio} title="Play pronunciation">
              <Volume2 className="h-5 w-5" />
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <motion.div
            className="p-4 bg-primary/5 rounded-md text-center"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold">{question.word.word}</h3>
            {question.word.pronunciation && (
              <p className="text-sm text-muted-foreground mt-1">{question.word.pronunciation}</p>
            )}
            {question.word.pos && (
              <Badge variant="outline" className="mt-2">
                {question.word.pos}
              </Badge>
            )}
          </motion.div>

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
                    className={cn(
                      "w-full justify-start text-left p-4 h-auto",
                      selectedOption === option ? "border-primary bg-primary/5" : "",
                      showingFeedback && option === question.correctAnswer
                        ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                        : showingFeedback && selectedOption === option && option !== question.correctAnswer
                          ? "border-red-500 bg-red-50 dark:bg-red-950/30"
                          : "",
                    )}
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
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
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
                      Correct! The definition of "{question.word.word}" is "{question.correctAnswer}".
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4" />
                      Incorrect. The correct definition of "{question.word.word}" is "{question.correctAnswer}".
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
