"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Trophy, Clock, Brain, ArrowRight, RotateCw, Zap, Award } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { usePracticeStore } from "@/lib/practice-store"
import { Badge } from "@/components/ui/badge"
import { MascotEncouragement } from "@/components/practice/ui/mascot-encouragement"
import confetti from "canvas-confetti"

export function PracticeResultsSection() {
  const router = useRouter()
  const { currentSession, startSession } = usePracticeStore()

  // Redirect if no session data
  useEffect(() => {
    if (!currentSession || !currentSession.completed) {
      router.push("/practice")
    }
  }, [currentSession, router])

  // Trigger confetti on load
  useEffect(() => {
    if (currentSession?.completed) {
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
  }, [currentSession?.completed])

  if (!currentSession || !currentSession.completed) {
    return null
  }

  const { questions, correctAnswers, incorrectAnswers, startTime, endTime, mode } = currentSession

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

  // Get performance message
  const getPerformanceMessage = () => {
    if (score >= 90) return "Outstanding! You've mastered these words!"
    if (score >= 80) return "Excellent work! You're doing great!"
    if (score >= 70) return "Good job! Keep practicing to improve further."
    if (score >= 60) return "Nice effort! Regular practice will help you improve."
    return "Keep practicing! You'll get better with time."
  }

  const handlePracticeSimilar = () => {
    // Start a new session with the same mode
    startSession(mode, questions.length)
    router.push("/practice/session")
  }

  const handleBackToPractice = () => {
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
        <p className="text-muted-foreground">{getPerformanceMessage()}</p>
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
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="h-4 w-4 text-green-500" /> Correct Answers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">{correctAnswers}</p>
            <Progress value={(correctAnswers / questions.length) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" /> Time Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {timeSpent < 60 ? `${timeSpent} sec` : `${Math.round(timeSpent / 60)} min`}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round(timeSpent / questions.length)} seconds per question
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-500" /> Question Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(questionTypeCounts).map(([type, count]) => (
                <Badge key={type} variant="outline" className="bg-purple-100/50 dark:bg-purple-900/50">
                  {type === "multiple-choice"
                    ? "Multiple Choice"
                    : type === "fill-blank"
                      ? "Fill in Blank"
                      : type === "listening"
                        ? "Listening"
                        : type === "matching"
                          ? "Matching"
                          : "Drag & Drop"}
                  : {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement card */}
      <Card className="overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-yellow-400 to-orange-500" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" /> Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {score >= 80 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-full">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">High Scorer</p>
                    <p className="text-xs text-muted-foreground">Scored 80% or higher</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {timeSpent / questions.length < 10 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-2 rounded-full">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Speed Demon</p>
                    <p className="text-xs text-muted-foreground">Less than 10 seconds per question</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {correctAnswers >= 5 && incorrectAnswers === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-2 rounded-full">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Perfect Streak</p>
                    <p className="text-xs text-muted-foreground">5+ correct answers with no mistakes</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </CardContent>
      </Card>

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
