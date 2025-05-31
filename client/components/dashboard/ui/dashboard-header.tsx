"use client"

import { motion } from "framer-motion"
import { Flame, Heart, Diamond, Calendar, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useVocabStore } from "@/lib/store"
import type { DashboardHeaderProps } from "@/types/dashboard"

export function DashboardHeader({ userName, streak, hearts, diamonds }: DashboardHeaderProps) {
  const { dailyGoal, dailyProgress } = useVocabStore()
  const percentage = Math.min(100, Math.round((dailyProgress / dailyGoal) * 100))

  // Get time of day for personalized greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  // Get day of week
  const getDayOfWeek = () => {
    return new Date().toLocaleDateString("en-US", { weekday: "long" })
  }

  return (
    <Card className="border-none overflow-hidden relative">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-pink-500/20 to-cyan-500/20 dark:from-violet-900/30 dark:via-pink-900/30 dark:to-cyan-900/30">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-purple-500/10 to-blue-500/10 dark:from-yellow-900/20 dark:via-purple-900/20 dark:to-blue-900/20"
          animate={{
            x: ["-100%", "100%"],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "mirror",
          }}
        />
      </div>

      {/* Floating sparkles */}
      <motion.div
        className="absolute top-1/4 left-1/4 hidden sm:block"
        animate={{
          y: [0, -10, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          delay: 1,
        }}
      >
        <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-yellow-400 dark:text-yellow-300" />
      </motion.div>

      <motion.div
        className="absolute bottom-1/3 right-1/3 hidden sm:block"
        animate={{
          y: [0, -15, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          delay: 2,
        }}
      >
        <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-purple-400 dark:text-purple-300" />
      </motion.div>

      <CardContent className="p-4 sm:p-6 md:p-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1 sm:space-y-2">
            <motion.h1
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {getGreeting()}, {userName}!
            </motion.h1>
            <motion.p
              className="text-muted-foreground text-sm sm:text-base md:text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Ready to boost your English with Engbot? Keep up your {streak} day streak!
            </motion.p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <motion.div
              className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              <span className="font-medium text-xs sm:text-sm md:text-base">{streak}</span>
            </motion.div>

            <motion.div
              className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-red-500 to-pink-500 dark:from-red-600 dark:to-pink-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              <span className="font-medium text-xs sm:text-sm md:text-base">{hearts}</span>
            </motion.div>

            <motion.div
              className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Diamond className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              <span className="font-medium text-xs sm:text-sm md:text-base">{diamonds}</span>
            </motion.div>

            <motion.div
              className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              <span className="font-medium text-xs sm:text-sm md:text-base">{percentage}%</span>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="mt-3 sm:mt-4 md:mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex justify-between text-xs sm:text-sm md:text-base mb-1 sm:mb-1.5">
            <span>Daily Goal</span>
            <span className="font-medium">
              {dailyProgress}/{dailyGoal} XP
            </span>
          </div>
          <div className="relative">
            <Progress value={percentage} className="h-2 sm:h-3 md:h-4 bg-primary/10" />
            <motion.div
              className="absolute top-0 left-0 h-full w-full overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <div className="h-full w-full bg-gradient-to-r from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 opacity-30"></div>
            </motion.div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}
