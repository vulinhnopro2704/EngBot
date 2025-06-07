import { motion } from "framer-motion"
import { Clock, Brain, Dumbbell, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { PracticeMode } from "@/data/types"

interface SpacedRepetitionTabProps {
  handleStartPractice: (mode: PracticeMode) => void
}

export function SpacedRepetitionTab({ handleStartPractice }: SpacedRepetitionTabProps) {
  return (
    <Card className="border-none shadow-md overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          <Clock className="h-5 w-5 md:h-6 md:w-6 text-cyan-500" /> Spaced Repetition
        </CardTitle>
        <CardDescription className="text-base">
          Review words at optimal intervals for maximum retention
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-cyan-50 dark:bg-cyan-950/30 p-4 rounded-lg border border-cyan-100 dark:border-cyan-900">
          <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
            <Brain className="h-5 w-5 text-cyan-600" /> How Spaced Repetition Works
          </h3>
          <p className="text-sm text-muted-foreground">
            Words are scheduled for review at scientifically-optimized intervals. Words you find difficult will
            appear more frequently, while words you know well will appear less often.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                  <Dumbbell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-medium">Due for Review</h3>
              </div>
              <p className="text-3xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Words ready to review today</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
                  <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-medium">Coming Up</h3>
              </div>
              <p className="text-3xl font-bold">8</p>
              <p className="text-sm text-muted-foreground">Words due in the next 3 days</p>
            </CardContent>
          </Card>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={() => handleStartPractice("spaced")}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-md"
            size="lg"
          >
            Start Spaced Repetition <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  )
}
