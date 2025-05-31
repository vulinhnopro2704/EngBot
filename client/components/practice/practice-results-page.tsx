"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Trophy, Clock, Brain, ArrowRight, RotateCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useVocabStore } from "@/lib/store"
import { calculatePracticeScore, calculateTimeSpent } from "@/data/practice"
import { Badge } from "@/components/ui/badge"

export function PracticeResultsPage() {
  const router = useRouter()
  const { currentPracticeSession, startPracticeSession, resetPracticeSession } = useVocabStore()

  // Redirect if no session data
  useEffect(() => {
    if (!currentPracticeSession) {
      router.push("/practice")
    }
  }, [currentPracticeSession, router])

  if (!currentPracticeSession) {
    return null
  }

  const score = calculatePracticeScore(currentPracticeSession)
  const timeSpent = calculateTimeSpent(currentPracticeSession)
  const { questions, correctAnswers, incorrectAnswers } = currentPracticeSession

  // Count question types
  const questionTypeCounts = questions.reduce(
    (counts, question) => {
      counts[question.type] = (counts[question.type] || 0) + 1
      return counts
    },
    {} as Record<string, number>,
  )

  const handlePracticeSimilar = () => {
    // Start a new session with the same parameters
    startPracticeSession(questions.length, currentPracticeSession.courseId, currentPracticeSession.lessonId)
    router.push("/practice/session")
  }

  const handleBackToPractice = () => {
    resetPracticeSession()
    router.push("/practice")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Practice Results</h1>
        <p className="text-muted-foreground">
          {score >= 80
            ? "Great job! You're mastering these words."
            : score >= 60
              ? "Good effort! Keep practicing to improve."
              : "Keep practicing! You'll get better with time."}
        </p>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle className="text-muted stroke-current" strokeWidth="10" cx="50" cy="50" r="40" fill="none"></circle>

            {/* Progress circle */}
            <motion.circle
              initial={{ strokeDashoffset: 251.2 }}
              animate={{
                strokeDashoffset: 251.2 - (score / 100) * 251.2,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`stroke-current ${
                score >= 80 ? "text-green-500" : score >= 60 ? "text-yellow-500" : "text-red-500"
              }`}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="251.2"
              cx="50"
              cy="50"
              r="40"
              fill="none"
              transform="rotate(-90 50 50)"
            ></motion.circle>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold">{score}%</span>
            <span className="text-sm text-muted-foreground">Score</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="h-4 w-4 text-green-500" /> Correct Answers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{correctAnswers}</p>
            <Progress value={(correctAnswers / questions.length) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" /> Time Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {timeSpent < 60 ? `${timeSpent} sec` : `${Math.round(timeSpent / 60)} min`}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round(timeSpent / questions.length)} seconds per question
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-500" /> Question Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(questionTypeCounts).map(([type, count]) => (
                <Badge key={type} variant="outline">
                  {type === "multiple-choice"
                    ? "Multiple Choice"
                    : type === "fill-blank"
                      ? "Fill in Blank"
                      : "Listening"}
                  : {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={handlePracticeSimilar} className="flex-1" size="lg">
          <RotateCw className="mr-2 h-4 w-4" /> Practice Similar Words
        </Button>
        <Button onClick={handleBackToPractice} variant="outline" className="flex-1" size="lg">
          <ArrowRight className="mr-2 h-4 w-4" /> Back to Practice
        </Button>
      </div>
    </motion.div>
  )
}
