"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Brain, Flame } from "lucide-react"
import { usePracticeStore } from "@/lib/practice-store"
import { useAudio } from "@/hooks/use-audio"
import { MultipleChoiceModule } from "@/components/practice/modules/multiple-choice-module"
import { FillBlankModule } from "@/components/practice/modules/fill-blank-module"
import { ListeningModule } from "@/components/practice/modules/listening-module"
import { ListeningChoiceModule } from "@/components/practice/modules/listening-choice-module"
import { MatchingModule } from "@/components/practice/modules/matching-module"
import { DragDropModule } from "@/components/practice/modules/drag-drop-module"
import { ProgressBar } from "@/components/practice/ui/progress-bar"
import { StreakIndicator } from "@/components/practice/ui/streak-indicator"
import { CelebrationOverlay } from "@/components/practice/ui/celebration-overlay"
import { Button } from "@/components/ui/button"
import { WordInfoSnackbar } from "@/components/practice/ui/word-info-snackbar"
import { cn } from "@/lib/utils"

export function PracticeSessionSection() {
  const router = useRouter()
  const { currentSession, answerQuestion, moveToNextQuestion, streakCount } = usePracticeStore()
  const { playAudio, speakWord } = useAudio()

  const [hearts, setHearts] = useState(5)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationData, setCelebrationData] = useState({
    title: "",
    message: "",
    stats: {
      correct: 0,
      total: 0,
      streak: 0,
    },
  })
  const [showSkipWordInfo, setShowSkipWordInfo] = useState(false)
  const [isSkipping, setIsSkipping] = useState(false)

  // Redirect if no active session
  useEffect(() => {
    if (!currentSession) {
      router.push("/practice")
    }
  }, [currentSession, router])

  // Show milestone celebrations
  useEffect(() => {
    if (!currentSession) return

    const { currentQuestionIndex, questions, correctAnswers } = currentSession

    // Show celebration after every 10 questions
    if (currentQuestionIndex > 0 && currentQuestionIndex % 10 === 0) {
      setCelebrationData({
        title: "Great Progress!",
        message: `You've completed ${currentQuestionIndex} questions!`,
        stats: {
          correct: correctAnswers,
          total: currentQuestionIndex,
          streak: streakCount,
        },
      })
      setShowCelebration(true)
      playAudio("/sounds/celebration.mp3")
    }

    // Update hearts based on incorrect answers
    const incorrectAnswers = currentQuestionIndex - correctAnswers
    setHearts(Math.max(0, 5 - incorrectAnswers))
  }, [currentSession?.currentQuestionIndex, currentSession, streakCount, playAudio])

  if (!currentSession) {
    return null
  }

  const { questions, currentQuestionIndex, correctAnswers } = currentSession
  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswer = (answer: string) => {
    answerQuestion(currentQuestion.id, answer)
    // Note: We no longer automatically move to the next question here
    // The continue button in the snackbar will handle this
  }

  const handleSkipQuestion = () => {
    if (isSkipping) return

    setIsSkipping(true)
    // Show the word info snackbar for the skipped question
    setShowSkipWordInfo(true)

    // Pronounce the word
    setTimeout(() => {
      speakWord(currentQuestion.word.word)
    }, 500)
  }

  const handleContinueAfterSkip = () => {
    setShowSkipWordInfo(false)
    setIsSkipping(false)
    moveToNextQuestion()
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 relative">
      {/* Stats bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Heart
                key={i}
                className={cn(
                  "h-5 w-5 transition-all",
                  i < hearts ? "text-red-500 fill-red-500 scale-100" : "text-gray-300 scale-90",
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-1">
            <Brain className="h-5 w-5 text-purple-500" />
            <span className="font-medium">{correctAnswers}</span>
          </div>
          {streakCount > 0 && (
            <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
              <Flame className="h-4 w-4 text-amber-500" />
              <span className="font-medium text-amber-700 dark:text-amber-400">{streakCount}</span>
            </div>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      {/* Progress bar */}
      <ProgressBar value={currentQuestionIndex + 1} total={questions.length} gradient={true} />

      {/* Streak indicator */}
      {streakCount > 0 && <StreakIndicator streak={streakCount} position="top-right" />}

      {/* Question modules */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentQuestion.type === "multiple-choice" && (
            <MultipleChoiceModule question={currentQuestion} onAnswer={handleAnswer} />
          )}

          {currentQuestion.type === "fill-blank" && (
            <FillBlankModule question={currentQuestion} onAnswer={handleAnswer} />
          )}

          {currentQuestion.type === "listening" && (
            <ListeningModule question={currentQuestion} onAnswer={handleAnswer} />
          )}

          {currentQuestion.type === "listening-choice" && (
            <ListeningChoiceModule question={currentQuestion} onAnswer={handleAnswer} />
          )}

          {currentQuestion.type === "matching" && <MatchingModule question={currentQuestion} onAnswer={handleAnswer} />}

          {currentQuestion.type === "drag-drop" && (
            <DragDropModule question={currentQuestion} onAnswer={handleAnswer} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Skip button */}
      <div className="flex justify-end">
        <Button variant="ghost" onClick={handleSkipQuestion} disabled={isSkipping}>
          Skip Question
        </Button>
      </div>

      {/* Word information snackbar for skipped questions */}
      <WordInfoSnackbar
        word={currentQuestion.word}
        isVisible={showSkipWordInfo}
        onClose={() => setShowSkipWordInfo(false)}
        onContinue={handleContinueAfterSkip}
        showContinueButton={true}
        isCorrect={false}
      />

      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <CelebrationOverlay
            title={celebrationData.title}
            message={celebrationData.message}
            stats={celebrationData.stats}
            onClose={() => setShowCelebration(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
