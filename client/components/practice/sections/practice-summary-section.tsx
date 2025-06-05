import { Trophy, Clock, Brain, Award } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScoreCircle } from "../ui/score-circle"
import { StatsCard } from "../ui/stats-card"
import { AchievementCard } from "../ui/achievement-card"

interface PracticeSummarySectionProps {
  score: number
  timeSpent: number
  questionTypeCounts: Record<string, number>
  correctAnswers: number
  incorrectAnswers: number
  questions: any[]
  performanceMessage: string
}

export function PracticeSummarySection({
  score,
  timeSpent,
  questionTypeCounts,
  correctAnswers,
  incorrectAnswers,
  questions,
  performanceMessage
}: PracticeSummarySectionProps) {
  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Practice Results</h1>
        <p className="text-muted-foreground">{performanceMessage}</p>
      </div>

      <div className="flex flex-col items-center justify-center">
        <ScoreCircle score={score} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Correct Answers"
          icon={Trophy}
          iconColor="text-green-500"
          gradient="from-green-50 to-green-100"
          darkGradient="dark:from-green-950 dark:to-green-900"
          border="border-green-200"
          darkBorder="dark:border-green-800"
          content={<p className="text-2xl font-bold text-green-700 dark:text-green-300">{correctAnswers}</p>}
          footer={<Progress value={(correctAnswers / questions.length) * 100} className="h-2" />}
        />

        <StatsCard
          title="Time Spent"
          icon={Clock}
          iconColor="text-blue-500"
          gradient="from-blue-50 to-blue-100"
          darkGradient="dark:from-blue-950 dark:to-blue-900"
          border="border-blue-200"
          darkBorder="dark:border-blue-800"
          content={
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {timeSpent < 60 ? `${timeSpent} sec` : `${Math.round(timeSpent / 60)} min`}
            </p>
          }
          footer={
            <p className="text-xs text-muted-foreground">
              {Math.round(timeSpent / questions.length)} seconds per question
            </p>
          }
        />

        <StatsCard
          title="Question Types"
          icon={Brain}
          iconColor="text-purple-500"
          gradient="from-purple-50 to-purple-100"
          darkGradient="dark:from-purple-950 dark:to-purple-900"
          border="border-purple-200"
          darkBorder="dark:border-purple-800"
          content={
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
          }
        />
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
            <AchievementCard
              title="High Scorer"
              description="Scored 80% or higher"
              icon={Trophy}
              gradient="from-yellow-400 to-orange-500"
              bgGradient="bg-gradient-to-br from-yellow-50 to-yellow-100"
              darkBgGradient="dark:from-yellow-950 dark:to-yellow-900"
              border="border-yellow-200"
              darkBorder="dark:border-yellow-800"
              delay={0.2}
            />
          )}

          {timeSpent / questions.length < 10 && (
            <AchievementCard
              title="Speed Demon"
              description="Less than 10 seconds per question"
              icon={Clock}
              gradient="from-blue-400 to-indigo-500"
              bgGradient="bg-gradient-to-br from-blue-50 to-blue-100"
              darkBgGradient="dark:from-blue-950 dark:to-blue-900"
              border="border-blue-200"
              darkBorder="dark:border-blue-800"
              delay={0.3}
            />
          )}

          {correctAnswers >= 5 && incorrectAnswers === 0 && (
            <AchievementCard
              title="Perfect Streak"
              description="5+ correct answers with no mistakes"
              icon={Award}
              gradient="from-green-400 to-emerald-500"
              bgGradient="bg-gradient-to-br from-green-50 to-green-100"
              darkBgGradient="dark:from-green-950 dark:to-green-900"
              border="border-green-200"
              darkBorder="dark:border-green-800"
              delay={0.4}
            />
          )}
        </CardContent>
      </Card>
    </>
  )
}
