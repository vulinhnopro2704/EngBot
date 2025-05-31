"use client"

import { motion } from "framer-motion"
import { useVocabStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain } from "lucide-react"

export function MemorizationLevelChart() {
  const { getMemorizationLevelCounts } = useVocabStore()
  const levelCounts = getMemorizationLevelCounts()

  // Define colors for each level
  const levelColors = {
    "1": "from-red-400 to-red-500",
    "2": "from-orange-400 to-orange-500",
    "3": "from-yellow-400 to-yellow-500",
    "4": "from-green-400 to-green-500",
    "5": "from-blue-400 to-blue-500",
  }

  // Find the maximum count for scaling
  const maxCount = Math.max(...Object.values(levelCounts), 1)

  // Level descriptions
  const levelDescriptions = {
    "1": "Just started",
    "2": "Learning",
    "3": "Familiar",
    "4": "Well known",
    "5": "Mastered",
  }

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardHeader className="pb-2 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 dark:from-purple-900/30 dark:to-indigo-900/30">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Brain className="h-5 w-5 text-purple-500 dark:text-purple-400" />
          Memorization Levels
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 relative">
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-purple-50/50 to-indigo-50/50 dark:from-purple-950/30 dark:to-indigo-950/30 z-0"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "mirror",
          }}
        />

        <div className="relative z-10">
          <div className="h-52 flex items-end justify-between gap-3 px-2 mb-4">
            {Object.entries(levelCounts).map(([level, count], i) => (
              <div key={level} className="flex flex-col items-center gap-1 flex-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(count / maxCount) * 100}%` }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`w-full bg-gradient-to-t ${levelColors[level as keyof typeof levelColors]} rounded-t-sm relative group`}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {count} words
                  </div>
                </motion.div>
                <span className="text-sm font-medium">Level {level}</span>
                <span className="text-xs text-muted-foreground">
                  {levelDescriptions[level as keyof typeof levelDescriptions]}
                </span>
              </div>
            ))}
          </div>

          <div className="text-sm text-center text-muted-foreground">
            <p>Track your vocabulary memorization progress across all 5 levels</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
