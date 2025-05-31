"use client"

import { Brain, ChevronRight, Award, Dumbbell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PracticeHeaderProps {
  totalCorrect: number
  sessionCount: number
  streakCount: number
  wordCount: number
  setWordCount: (count: number) => void
  isLoading: boolean
  handleStartSession: () => void
  activeTab: string
}

export function PracticeHeader({
  totalCorrect,
  sessionCount,
  streakCount,
  wordCount,
  setWordCount,
  isLoading,
  handleStartSession,
  activeTab,
}: PracticeHeaderProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Stats Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Your Stats</CardTitle>
          <CardDescription>Practice performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center">
              <Brain className="h-5 w-5 text-purple-500 mb-1" />
              <span className="text-2xl font-bold">{totalCorrect}</span>
              <span className="text-xs text-muted-foreground">Correct</span>
            </div>
            <div className="flex flex-col items-center">
              <Dumbbell className="h-5 w-5 text-blue-500 mb-1" />
              <span className="text-2xl font-bold">{sessionCount}</span>
              <span className="text-xs text-muted-foreground">Sessions</span>
            </div>
            <div className="flex flex-col items-center">
              <Award className="h-5 w-5 text-amber-500 mb-1" />
              <span className="text-2xl font-bold">{streakCount}</span>
              <span className="text-xs text-muted-foreground">Streak</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Word Count Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Words</CardTitle>
          <CardDescription>Words to practice</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 justify-center">
            {[5, 10, 15, 20].map((count) => (
              <Button
                key={count}
                variant={wordCount === count ? "default" : "outline"}
                size="sm"
                onClick={() => setWordCount(count)}
                className="min-w-[50px]"
              >
                {count}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Start Practice Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Ready?</CardTitle>
          <CardDescription>Start a new practice session</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            onClick={handleStartSession}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="animate-pulse">Loading...</span>
              </span>
            ) : (
              <span className="flex items-center">
                Start Practicing
                <ChevronRight className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
