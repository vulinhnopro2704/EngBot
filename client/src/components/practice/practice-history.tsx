"use client"

import { motion } from "framer-motion"
import { format } from "date-fns"
import { BookOpen, Dumbbell, Brain, Clock, Trophy, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useVocabStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"

export function PracticeHistory() {
  const { practiceHistory } = useVocabStore()

  if (practiceHistory.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 flex flex-col items-center justify-center text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No practice history yet</h3>
          <p className="text-muted-foreground">
            Complete practice sessions to see your history and track your progress
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" /> Best Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{Math.max(...practiceHistory.map((h) => h.score))}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" /> Total Practice Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {Math.round(practiceHistory.reduce((sum, h) => sum + h.timeSpent, 0) / 60)} min
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-500" /> Sessions Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{practiceHistory.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Recent Practice Sessions</h3>

        {practiceHistory.slice(0, 10).map((session, index) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        session.score >= 80
                          ? "bg-green-100 dark:bg-green-900"
                          : session.score >= 60
                            ? "bg-yellow-100 dark:bg-yellow-900"
                            : "bg-red-100 dark:bg-red-900"
                      }`}
                    >
                      <Trophy
                        className={`h-5 w-5 ${
                          session.score >= 80
                            ? "text-green-600 dark:text-green-400"
                            : session.score >= 60
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-red-600 dark:text-red-400"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium">Practice Session</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(session.date), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold">{session.score}%</p>
                    <p className="text-xs text-muted-foreground">
                      {session.timeSpent < 60
                        ? `${session.timeSpent} sec`
                        : `${Math.round(session.timeSpent / 60)} min`}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {session.questionTypes.includes("multiple-choice") && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" /> Multiple Choice
                    </Badge>
                  )}
                  {session.questionTypes.includes("fill-blank") && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Dumbbell className="h-3 w-3" /> Fill in Blank
                    </Badge>
                  )}
                  {session.questionTypes.includes("listening") && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Brain className="h-3 w-3" /> Listening
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

