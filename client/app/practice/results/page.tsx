"use client"

import { motion } from "framer-motion"
import { ArrowRight, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MascotEncouragement } from "@/components/practice/ui/mascot-encouragement"
import { usePracticeResults } from "@/lib/hooks/use-practice-results"
import { PracticeSummarySection } from "@/components/practice/sections/practice-summary-section"
import { ReviewWordsSection } from "@/components/practice/sections/review-words-section"

export default function PracticeResults() {
  const {
    currentSession,
    lastSession,
    reviewWordsResult,
    calculateStats,
    reviewStats,
    getPerformanceMessage,
    handlePracticeSimilar,
    handleBackToPractice,
    handleStartNewSession,
  } = usePracticeResults()

  if (!currentSession || !currentSession.completed || !calculateStats) {
    return null
  }

  const { 
    score, 
    timeSpent, 
    questionTypeCounts, 
    questions, 
    correctAnswers, 
    incorrectAnswers 
  } = calculateStats

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      <PracticeSummarySection
        score={score}
        timeSpent={timeSpent}
        questionTypeCounts={questionTypeCounts}
        correctAnswers={correctAnswers}
        incorrectAnswers={incorrectAnswers}
        questions={questions}
        performanceMessage={getPerformanceMessage(score)}
      />

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={handlePracticeSimilar}
          className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
          size="lg"
        >
          <RotateCw className="mr-2 h-4 w-4" /> Practice Similar Words
        </Button>
        <Button onClick={handleBackToPractice} variant="outline" className="flex-1" size="lg">
          <ArrowRight className="mr-2 h-4 w-4" /> Back to Practice
        </Button>
      </div>

      {/* Review Results Section */}
      {lastSession && reviewStats && (
        <ReviewWordsSection
          correctPercentage={reviewStats.correctPercentage}
          timeSpentReview={reviewStats.timeSpentReview}
          lastSession={lastSession}
          reviewWordsResult={reviewWordsResult}
          onStartNewSession={handleStartNewSession}
        />
      )}

      {/* Mascot encouragement */}
      <MascotEncouragement
        message={score >= 80 ? "Amazing job! You're a vocabulary master!" : "Great effort! Keep practicing to improve!"}
        mood={score >= 80 ? "excited" : "happy"}
        duration={5000}
        position="bottom-right"
        onComplete={() => {}}
      />
    </motion.div>
  )
}
