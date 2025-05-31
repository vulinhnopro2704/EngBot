"use client"

import { motion } from "framer-motion"
import { Flame, Trophy, Award, Star, Medal, Sparkles, LockIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Achievement, AchievementsSectionProps } from "@/types/dashboard"
import { Book } from "lucide-react"

export function AchievementsSection({ streak, hearts, diamonds }: AchievementsSectionProps) {
  // Define achievements
  const achievements: Achievement[] = [
    {
      name: "7-Day Streak",
      description: "Practice for 7 days in a row",
      icon: Flame,
      color: "from-orange-400 to-red-500",
      unlocked: streak >= 7,
      progress: Math.min(streak / 7, 1) * 100,
    },
    {
      name: "Vocabulary Master",
      description: "Learn 50 new words",
      icon: Book,
      color: "from-blue-400 to-cyan-500",
      unlocked: diamonds >= 50,
      progress: Math.min(diamonds / 50, 1) * 100,
    },
    {
      name: "Perfect Score",
      description: "Get 100% on 5 practice sessions",
      icon: Award,
      color: "from-yellow-400 to-amber-500",
      unlocked: hearts >= 5,
      progress: Math.min(hearts / 5, 1) * 100,
    },
    {
      name: "Course Champion",
      description: "Complete your first course",
      icon: Trophy,
      color: "from-purple-400 to-violet-500",
      unlocked: false,
      progress: 35,
    },
    {
      name: "Rising Star",
      description: "Practice for 5 days in a row",
      icon: Star,
      color: "from-pink-400 to-rose-500",
      unlocked: streak >= 5,
      progress: Math.min(streak / 5, 1) * 100,
    },
    {
      name: "Grammar Guru",
      description: "Complete 10 grammar exercises",
      icon: Medal,
      color: "from-green-400 to-emerald-500",
      unlocked: false,
      progress: 60,
    },
  ]

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardHeader className="pb-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10 dark:from-pink-900/30 dark:to-purple-900/30">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
          Your Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 relative">
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-pink-50/50 to-purple-50/50 dark:from-pink-950/30 dark:to-purple-950/30 z-0"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "mirror",
          }}
        />

        <div className="grid grid-cols-3 gap-3 relative z-10">
          <TooltipProvider>
            {achievements.map((achievement, index) => (
              <Tooltip key={achievement.name}>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div
                      className={`aspect-square rounded-lg flex items-center justify-center bg-gradient-to-br ${achievement.color} text-white shadow-md ${!achievement.unlocked && "opacity-50"}`}
                    >
                      <achievement.icon className="h-6 w-6" />

                      {/* Animated sparkles for unlocked achievements */}
                      {achievement.unlocked && (
                        <>
                          <motion.div
                            className="absolute top-1 right-1"
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0.8, 1.2, 0.8],
                              rotate: [0, 15, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "loop",
                              delay: index * 0.2,
                            }}
                          >
                            <Sparkles className="h-3 w-3 text-yellow-200" />
                          </motion.div>

                          <motion.div
                            className="absolute bottom-1 left-1"
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0.8, 1.2, 0.8],
                              rotate: [0, -15, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "loop",
                              delay: index * 0.2 + 0.5,
                            }}
                          >
                            <Sparkles className="h-3 w-3 text-yellow-200" />
                          </motion.div>
                        </>
                      )}

                      {!achievement.unlocked && (
                        <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-[1px] rounded-lg flex items-center justify-center">
                          <div className="h-8 w-8 rounded-full bg-gray-800/80 flex items-center justify-center">
                            <LockIcon className="h-4 w-4 text-gray-300" />
                          </div>
                        </div>
                      )}

                      {/* Circular progress indicator */}
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle
                          cx="50%"
                          cy="50%"
                          r="48%"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                          strokeDasharray="100"
                          strokeDashoffset={100 - achievement.progress}
                          strokeLinecap="round"
                          className="opacity-30"
                        />
                      </svg>
                    </div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-gradient-to-r from-gray-900 to-gray-800 text-white border-none shadow-xl"
                >
                  <div className="text-center p-2">
                    <p className="font-medium text-white">{achievement.name}</p>
                    <p className="text-xs text-gray-300">{achievement.description}</p>
                    <div className="mt-2 bg-gray-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${achievement.color}`}
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs mt-1 text-gray-300">{Math.round(achievement.progress)}% complete</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  )
}
