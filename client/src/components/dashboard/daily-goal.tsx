"use client"

import { motion } from "framer-motion"
import { Target, Trophy, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useVocabStore } from "@/lib/store"

export function DailyGoal() {
  const router = useRouter()
  const { dailyGoal, dailyProgress } = useVocabStore()

  const percentage = Math.min(100, Math.round((dailyProgress / dailyGoal) * 100))

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Daily Goal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                className="text-muted stroke-current"
                strokeWidth="10"
                cx="50"
                cy="50"
                r="40"
                fill="none"
              ></circle>

              {/* Progress circle */}
              <motion.circle
                initial={{ strokeDashoffset: 251.2 }}
                animate={{
                  strokeDashoffset: 251.2 - (percentage / 100) * 251.2,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-primary stroke-current"
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
              <span className="text-2xl sm:text-3xl font-bold">{percentage}%</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">
                {dailyProgress}/{dailyGoal} XP
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-2">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
              <span className="text-xs sm:text-sm">Current streak</span>
            </div>
            <span className="text-xs sm:text-sm font-medium">7 days</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-2">
              <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
              <span className="text-xs sm:text-sm">Best streak</span>
            </div>
            <span className="text-xs sm:text-sm font-medium">14 days</span>
          </div>
        </div>

        <Button className="w-full" onClick={() => router.push("/practice")}>
          Practice Now
        </Button>
      </CardContent>
    </Card>
  )
}

