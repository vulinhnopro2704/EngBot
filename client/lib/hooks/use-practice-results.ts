import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePracticeStore } from "@/lib/practice-store"
import confetti from "canvas-confetti"

export function usePracticeResults() {
  const router = useRouter()
  const { 
    sessionHistory, 
    reviewWordsResult,
    clearReviewWordsResult,
    currentSession, 
    startSession 
  } = usePracticeStore()

  // Get the most recent session
  const lastSession = sessionHistory[0]

  // Redirect if no session data
  useEffect(() => {
    // Only redirect if there's no completed session in history and no review results
    if (!lastSession && !reviewWordsResult) {
      router.push("/practice")
    }
  }, [lastSession, reviewWordsResult, router])

  // Handle case where there's no session data
  useEffect(() => {
    // Clear review results when navigating away
    return () => {
      clearReviewWordsResult()
    }
  }, [clearReviewWordsResult])

  // Trigger confetti on load
  useEffect(() => {
    if (lastSession?.completed || reviewWordsResult) {
      launchConfetti()
    }
  }, [lastSession?.completed, reviewWordsResult])

  const launchConfetti = () => {
    // First burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FFD700", "#FFA500", "#FF4500", "#9370DB", "#00BFFF"],
    })

    // Second burst after a delay
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0.1, y: 0.6 },
        colors: ["#FFD700", "#FFA500", "#FF4500", "#9370DB", "#00BFFF"],
      })

      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 0.9, y: 0.6 },
        colors: ["#FFD700", "#FFA500", "#FF4500", "#9370DB", "#00BFFF"],
      })
    }, 500)
  }

  const calculateStats = () => {
    // Use lastSession if currentSession is null
    const session = lastSession
    
    if (!session || !session.completed) return null

    const { questions, correctAnswers, incorrectAnswers, startTime, endTime, mode } = session
    
    // Calculate score
    const score = Math.round((correctAnswers / questions.length) * 100)
    
    // Calculate time spent
    const timeSpent = endTime ? Math.round((endTime.getTime() - startTime.getTime()) / 1000) : 0
    
    // Count question types
    const questionTypeCounts = questions.reduce(
      (counts, question) => {
        counts[question.type] = (counts[question.type] || 0) + 1
        return counts
      },
      {} as Record<string, number>,
    )

    return {
      score,
      timeSpent,
      questionTypeCounts,
      questions,
      correctAnswers,
      incorrectAnswers,
      mode
    }
  }

  const calculateReviewStats = () => {
    if (!lastSession) return null

    const correctPercentage = Math.round((lastSession.correctAnswers / lastSession.questions.length) * 100)
    const timeSpentReview = Math.round((lastSession.endTime?.getTime() ?? 0 - lastSession.startTime.getTime()) / 1000)

    return {
      correctPercentage,
      timeSpentReview,
      lastSession
    }
  }

  const getPerformanceMessage = (score: number) => {
    if (score >= 90) return "Outstanding! You've mastered these words!"
    if (score >= 80) return "Excellent work! You're doing great!"
    if (score >= 70) return "Good job! Keep practicing to improve further."
    if (score >= 60) return "Nice effort! Regular practice will help you improve."
    return "Keep practicing! You'll get better with time."
  }

  const handlePracticeSimilar = () => {
    if (!currentSession) return
    // Start a new session with the same mode
    startSession(currentSession.mode, currentSession.questions.length)
    router.push("/practice/session")
  }

  const handleBackToPractice = () => {
    router.push("/practice")
  }

  const handleStartNewSession = () => {
    router.push("/practice")
  }

  return {
    currentSession,
    lastSession,
    reviewWordsResult,
    calculateStats: calculateStats(),
    reviewStats: calculateReviewStats(),
    getPerformanceMessage,
    handlePracticeSimilar,
    handleBackToPractice,
    handleStartNewSession,
  }
}
