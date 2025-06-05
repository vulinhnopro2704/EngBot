import { motion } from "framer-motion"
import { Shuffle, BookOpen, PenTool, Headphones, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { containerVariants, itemVariants } from "../ui/practice-mode-card"
import type { PracticeMode } from "@/data/types"

interface MixedPracticeTabProps {
  selectedQuestionCount: number
  setSelectedQuestionCount: (count: number) => void
  handleStartPractice: (mode: PracticeMode) => void
}

export function MixedPracticeTab({
  selectedQuestionCount,
  setSelectedQuestionCount,
  handleStartPractice
}: MixedPracticeTabProps) {
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
            <Shuffle className="h-5 w-5 md:h-6 md:w-6 text-purple-500" /> Mixed Practice
          </CardTitle>
          <CardDescription className="text-base">
            Practice with a mix of different question types for maximum learning
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm md:text-base font-medium">Number of questions:</p>
            <div className="flex flex-wrap gap-2">
              {[5, 10, 15, 20].map((count) => (
                <Button
                  key={count}
                  variant={selectedQuestionCount === count ? "default" : "outline"}
                  size="sm"
                  className="h-9 md:h-10 md:text-base"
                  onClick={() => setSelectedQuestionCount(count)}
                >
                  {count}
                </Button>
              ))}
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4 md:grid-cols-3"
          >
            <PracticeTypeCard
              icon={BookOpen}
              title="Multiple Choice"
              description="Choose the correct definition"
              colorClass="blue"
            />
            
            <PracticeTypeCard
              icon={PenTool}
              title="Fill in the Blank"
              description="Complete sentences with the right word"
              colorClass="green"
            />
            
            <PracticeTypeCard
              icon={Headphones}
              title="Listening"
              description="Type the word you hear"
              colorClass="purple"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => handleStartPractice("mixed")}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-md"
              size="lg"
            >
              Start Mixed Practice <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}

interface PracticeTypeCardProps {
  icon: typeof BookOpen
  title: string
  description: string
  colorClass: "blue" | "green" | "purple"
}

function PracticeTypeCard({ icon: Icon, title, description, colorClass }: PracticeTypeCardProps) {
  const colorMap = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200 dark:border-blue-800",
      iconBg: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    green: {
      bg: "bg-green-50 dark:bg-green-950/30",
      border: "border-green-200 dark:border-green-800", 
      iconBg: "bg-green-100 dark:bg-green-900",
      iconColor: "text-green-600 dark:text-green-400"
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-950/30",
      border: "border-purple-200 dark:border-purple-800",
      iconBg: "bg-purple-100 dark:bg-purple-900", 
      iconColor: "text-purple-600 dark:text-purple-400"
    }
  }

  const colors = colorMap[colorClass]

  return (
    <motion.div variants={itemVariants}>
      <Card className={`${colors.bg} ${colors.border} h-full`}>
        <CardContent className="p-4 md:p-6 flex flex-col items-center text-center">
          <div className={`p-3 md:p-4 rounded-full ${colors.iconBg} mb-3`}>
            <Icon className={`h-5 w-5 md:h-6 md:w-6 ${colors.iconColor}`} />
          </div>
          <h3 className="font-medium text-base md:text-lg mb-1">{title}</h3>
          <p className="text-xs md:text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
