"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { useVocabStore } from "@/lib/store"
import { MultipleChoiceQuestion } from "@/components/practice/question-types/multiple-choice-question"
import { FillBlankQuestion } from "@/components/practice/question-types/fill-blank-question"
import { ListeningQuestion } from "@/components/practice/question-types/listening-question"
import { Button } from "@/components/ui/button"
import { useAudio } from "@/lib/audio-context"

export function PracticeSessionPage() {
  const router = useRouter()
  const { currentPracticeSession, answerQuestion, nextQuestion, completePracticeSession, addToNotebook } =
    useVocabStore()
  const { cancelSpeech, speakWord } = useAudio()

  const [userAnswer, setUserAnswer] = useState("")
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [showingFeedback, setShowingFeedback] = useState(false)

  // Redirect if no active session
  useEffect(() => {
    if (!currentPracticeSession) {
      router.push("/practice")
      return
    }

    // If session is completed, go to results
    if (currentPracticeSession.completed) {
      router.push("/practice/results")
    }
  }, [currentPracticeSession, router])

  if (!currentPracticeSession) {
    return null
  }

  const { questions, currentQuestionIndex, correctAnswers, incorrectAnswers } = currentPracticeSession

  // Check if we've reached the end of questions
  if (currentQuestionIndex >= questions.length) {
    completePracticeSession()
    router.push("/practice/results")
    return null
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const handleSubmitAnswer = (answer: string) => {
    if (showingFeedback) return

    // Cancel any ongoing speech
    cancelSpeech()

    setUserAnswer(answer)
    const isCorrect = answerQuestion(answer)
    setFeedback(isCorrect ? "correct" : "incorrect")
    setShowingFeedback(true)

    // Add word to notebook if correct
    if (isCorrect) {
      addToNotebook(currentQuestion.word, "practice", "Practice Session")
    }

    // Auto advance after feedback, but play pronunciation first if correct
    if (isCorrect) {
      // Play the pronunciation of the word
      setTimeout(() => {
        speakWord(currentQuestion.word.word, 0.8)

        // Wait for pronunciation to finish before advancing
        setTimeout(() => {
          setShowingFeedback(false)
          setFeedback(null)
          setUserAnswer("")
          nextQuestion()
        }, 1500) // Allow time for pronunciation
      }, 500) // Small delay before pronunciation
    } else {
      // For incorrect answers, just show feedback and advance
      setTimeout(() => {
        setShowingFeedback(false)
        setFeedback(null)
        setUserAnswer("")
        nextQuestion()
      }, 2000)
    }
  }

  const handleSkip = () => {
    if (showingFeedback) return

    // Cancel any ongoing speech
    cancelSpeech()

    setFeedback("incorrect")
    setShowingFeedback(true)

    // Auto advance after feedback
    setTimeout(() => {
      setShowingFeedback(false)
      setFeedback(null)
      setUserAnswer("")
      nextQuestion()
    }, 2000)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-green-600 dark:text-green-400">{correctAnswers} correct</span>
          <span className="text-sm font-medium text-red-600 dark:text-red-400">{incorrectAnswers} incorrect</span>
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentQuestion.type === "multiple-choice" && (
            <MultipleChoiceQuestion
              question={currentQuestion}
              onSubmit={handleSubmitAnswer}
              feedback={feedback}
              showingFeedback={showingFeedback}
            />
          )}

          {currentQuestion.type === "fill-blank" && (
            <FillBlankQuestion
              question={currentQuestion}
              onSubmit={handleSubmitAnswer}
              feedback={feedback}
              showingFeedback={showingFeedback}
            />
          )}

          {currentQuestion.type === "listening" && (
            <ListeningQuestion
              question={currentQuestion}
              onSubmit={handleSubmitAnswer}
              feedback={feedback}
              showingFeedback={showingFeedback}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {!showingFeedback && (
        <div className="flex justify-end">
          <Button variant="ghost" onClick={handleSkip}>
            Skip Question
          </Button>
        </div>
      )}
    </div>
  )
}

