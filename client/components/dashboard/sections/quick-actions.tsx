"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Brain, BookOpen, Notebook, Settings, Target, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useVocabStore } from "@/lib/store"
import type { QuickAction } from "@/types/dashboard"

export function QuickActions() {
  const router = useRouter()
  const { startPracticeSession, dailyGoal, dailyProgress } = useVocabStore()

  const percentage = Math.min(100, Math.round((dailyProgress / dailyGoal) * 100))

  const handleStartQuickPractice = () => {
    startPracticeSession(10)
    router.push("/practice/session")
  }

  const actions: QuickAction[] = [
    {
      name: "Practice",
      icon: Brain,
      gradient: "from-purple-500 to-violet-500",
      action: () => router.push("/practice"),
    },
    {
      name: "Courses",
      icon: BookOpen,
      gradient: "from-blue-500 to-cyan-500",
      action: () => router.push("/courses"),
    },
    {
      name: "Notebook",
      icon: Notebook,
      gradient: "from-emerald-500 to-green-500",
      action: () => router.push("/notebook"),
    },
    {
      name: "Settings",
      icon: Settings,
      gradient: "from-gray-500 to-slate-500",
      action: () => router.push("/settings"),
    },
  ]

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardHeader className="pb-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 dark:from-amber-900/30 dark:to-yellow-900/30">
        <CardTitle className="flex items-center justify-between text-xl md:text-2xl">
          <span className="flex items-center gap-2">
            <Zap className="h-5 w-5 md:h-6 md:w-6 text-amber-500 dark:text-amber-400" />
            Quick Actions
          </span>
          <div className="flex items-center gap-2 text-sm md:text-base font-normal">
            <Target className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            <span>{percentage}% of daily goal</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 relative">
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-amber-50/50 to-yellow-50/50 dark:from-amber-950/30 dark:to-yellow-950/30 z-0"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "mirror",
          }}
        />

        <div className="grid grid-cols-4 gap-2 md:gap-4 relative z-10">
          {actions.map((action, index) => (
            <motion.div
              key={action.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              whileHover={{ y: -5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-2"
            >
              <Button
                variant="ghost"
                size="icon"
                className={`h-14 w-14 md:h-20 md:w-20 rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-md border-none`}
                onClick={action.action}
              >
                <action.icon className="h-6 w-6 md:h-8 md:w-8" />
              </Button>
              <span className="text-xs md:text-sm font-medium">{action.name}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 md:mt-6 relative z-10">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleStartQuickPractice}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white border-none shadow-md h-10 md:h-12 text-base md:text-lg"
            >
              <Zap className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Start Quick Practice
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}
