"use client"

import { motion } from "framer-motion"
import { Brain } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { PracticeSession } from "@/types/practice"

interface PracticeHistorySectionProps {
  sessionHistory: PracticeSession[]
}

export function PracticeHistorySection({ sessionHistory }: PracticeHistorySectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recent Practice Sessions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessionHistory.map((session) => {
          const accuracy = Math.round((session.correctAnswers / session.questions.length) * 100)
          return (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {session.mode ? session.mode.charAt(0).toUpperCase() + session.mode.slice(1) : "Mixed"} Practice
                  </CardTitle>
                  <CardDescription>
                    {new Date(session.startTime).toLocaleDateString()} • {session.questions.length} words
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Brain className="h-5 w-5 text-purple-500 mr-2" />
                      <span>{session.correctAnswers} correct</span>
                    </div>
                    <div className="font-semibold text-lg">{accuracy}%</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
