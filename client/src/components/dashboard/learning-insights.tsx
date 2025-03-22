"use client"

import { motion } from "framer-motion"
import { BarChart3, TrendingUp, Clock, Calendar, CheckCircle2, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useVocabStore } from "@/lib/store"

export function LearningInsights() {
  const { recentActivities } = useVocabStore()

  // Mock data for charts
  const weeklyProgress = [
    { day: "Mon", words: 12 },
    { day: "Tue", words: 8 },
    { day: "Wed", words: 15 },
    { day: "Thu", words: 10 },
    { day: "Fri", words: 5 },
    { day: "Sat", words: 20 },
    { day: "Sun", words: 18 },
  ]

  const wordCategories = [
    { category: "Nouns", count: 45, color: "bg-gradient-to-r from-blue-400 to-blue-500" },
    { category: "Verbs", count: 32, color: "bg-gradient-to-r from-green-400 to-green-500" },
    { category: "Adjectives", count: 28, color: "bg-gradient-to-r from-purple-400 to-purple-500" },
    { category: "Adverbs", count: 15, color: "bg-gradient-to-r from-yellow-400 to-yellow-500" },
    { category: "Phrases", count: 20, color: "bg-gradient-to-r from-pink-400 to-pink-500" },
  ]

  // Find max value for scaling
  const maxWords = Math.max(...weeklyProgress.map((day) => day.words))
  const maxCategory = Math.max(...wordCategories.map((cat) => cat.count))

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardHeader className="pb-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-900/30 dark:to-emerald-900/30">
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-green-500 dark:text-green-400" />
          Learning Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 relative">
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/30 z-0"
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
          <Tabs defaultValue="progress" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm h-10 md:h-12">
              <TabsTrigger
                value="progress"
                className="text-xs md:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white"
              >
                Weekly Progress
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="text-xs md:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white"
              >
                Recent Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="progress" className="space-y-4 md:space-y-6">
              <div className="h-40 md:h-52 flex items-end justify-between gap-1 px-2">
                {weeklyProgress.map((day, i) => (
                  <div key={day.day} className="flex flex-col items-center gap-1 flex-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.words / maxWords) * 100}%` }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="w-full bg-gradient-to-t from-green-500 to-emerald-400 dark:from-green-600 dark:to-emerald-500 rounded-t-sm relative group"
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        {day.words} words
                      </div>

                      {/* Sparkle animation on hover */}
                      <motion.div
                        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100"
                        animate={{
                          y: [0, -5, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "loop",
                        }}
                      >
                        <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-yellow-200" />
                      </motion.div>
                    </motion.div>
                    <span className="text-xs md:text-sm text-muted-foreground">{day.day}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Card className="bg-white dark:bg-gray-900 shadow-md border-none">
                    <CardContent className="p-3 md:p-4 flex items-center gap-3">
                      <div className="p-2 md:p-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white">
                        <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground">Words Learned</p>
                        <p className="text-lg md:text-xl font-bold">88</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Card className="bg-white dark:bg-gray-900 shadow-md border-none">
                    <CardContent className="p-3 md:p-4 flex items-center gap-3">
                      <div className="p-2 md:p-3 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 text-white">
                        <Clock className="h-4 w-4 md:h-5 md:w-5" />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground">Study Time</p>
                        <p className="text-lg md:text-xl font-bold">3.5 hrs</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <div className="space-y-3 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-1">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-3 pb-3 last:pb-0 last:border-0 border-b border-border/50"
                  >
                    <div className={`p-2 rounded-full ${activity.iconBg} shrink-0`}>
                      {activity.type === "completed" && (
                        <CheckCircle2 className={`h-4 w-4 md:h-5 md:w-5 ${activity.iconColor}`} />
                      )}
                      {activity.type === "streak" && (
                        <Calendar className={`h-4 w-4 md:h-5 md:w-5 ${activity.iconColor}`} />
                      )}
                      {activity.type === "practice" && (
                        <Clock className={`h-4 w-4 md:h-5 md:w-5 ${activity.iconColor}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-sm md:text-base font-medium truncate">{activity.title}</p>
                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground shrink-0">{activity.time}</div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}

