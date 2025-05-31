"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Brain, BookOpen, Headphones, Sparkles, Lightbulb } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useVocabStore } from "@/lib/store"
import type { RecommendedActivity } from "@/types/dashboard"

export function RecommendedActivities() {
  const router = useRouter()
  const { startPracticeSession, courseId, lessonId } = useVocabStore()

  // Define recommended activities with vibrant colors
  const activities: RecommendedActivity[] = [
    {
      title: "Quick Vocabulary Practice",
      description: "Review 10 words from your recent lessons",
      icon: Brain,
      gradient: "from-purple-500 to-violet-500",
      iconGradient: "from-purple-300 to-violet-300",
      action: () => {
        startPracticeSession(10)
        router.push("/practice/session")
      },
    },
    {
      title: "Listening Exercise",
      description: "Improve your pronunciation with audio exercises",
      icon: Headphones,
      gradient: "from-blue-500 to-cyan-500",
      iconGradient: "from-blue-300 to-cyan-300",
      action: () => {
        if (courseId && lessonId) {
          router.push(`/courses/${courseId}/lessons/${lessonId}?tab=listening`)
        } else {
          router.push("/courses")
        }
      },
    },
    {
      title: "Daily Challenge",
      description: "Complete today's special vocabulary challenge",
      icon: Sparkles,
      gradient: "from-amber-500 to-yellow-500",
      iconGradient: "from-amber-300 to-yellow-300",
      action: () => {
        startPracticeSession(5)
        router.push("/practice/session")
      },
    },
    {
      title: "Continue Learning",
      description: "Pick up where you left off in your current lesson",
      icon: BookOpen,
      gradient: "from-emerald-500 to-green-500",
      iconGradient: "from-emerald-300 to-green-300",
      action: () => {
        if (courseId && lessonId) {
          router.push(`/courses/${courseId}/lessons/${lessonId}`)
        } else {
          router.push("/courses")
        }
      },
    },
  ]

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-900/30 dark:to-cyan-900/30">
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          <Lightbulb className="h-5 w-5 md:h-6 md:w-6 text-amber-500 dark:text-amber-400" />
          Recommended for You
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 relative">
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-cyan-50/50 dark:from-blue-950/30 dark:to-cyan-950/30 z-0"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "mirror",
          }}
        />

        <div className="grid gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="h-full border-none overflow-hidden shadow-md">
                <CardContent className="p-0 flex flex-col h-full">
                  {/* Gradient header */}
                  <div className={`p-3 md:p-4 bg-gradient-to-r ${activity.gradient} text-white`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 md:p-3 rounded-full bg-white/20 backdrop-blur-sm`}>
                        <activity.icon className="h-5 w-5 md:h-6 md:w-6" />
                      </div>
                      <h3 className="font-medium text-sm md:text-base">{activity.title}</h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 md:p-4 bg-white dark:bg-gray-900 flex-1">
                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{activity.description}</p>

                    <div className="mt-3 md:mt-4">
                      <Button
                        onClick={activity.action}
                        className={`w-full text-xs md:text-sm h-8 md:h-9 bg-gradient-to-r ${activity.gradient} text-white border-none hover:opacity-90`}
                      >
                        Start Activity
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
