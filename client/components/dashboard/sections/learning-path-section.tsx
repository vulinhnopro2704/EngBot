"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ChevronRight, BookOpen, Briefcase, GraduationCap, CheckCircle2, LockIcon, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useVocabStore } from "@/lib/store"
import { useProgress } from "@/hooks/use-progress"
import { courses } from "@/data/courses"
import type { IconName } from "@/types/icons"

export function LearningPathSection() {
  const router = useRouter()
  const { setCourse } = useVocabStore()
  const { calculateCourseProgress } = useProgress()
  const [hoveredCourse, setHoveredCourse] = useState<number | null>(null)

  // Map icon strings to components
  const iconMap: Record<IconName, React.ElementType> = {
    BookOpen,
    Briefcase,
    GraduationCap,
  }

  const handleCourseSelect = (courseId: number) => {
    setCourse(courseId)
    router.push(`/courses/${courseId}`)
  }

  // Define vibrant colors for each course
  const courseColors = [
    "from-violet-500 to-purple-500 dark:from-violet-600 dark:to-purple-600",
    "from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600",
    "from-emerald-500 to-green-500 dark:from-emerald-600 dark:to-green-600",
    "from-amber-500 to-yellow-500 dark:from-amber-600 dark:to-yellow-600",
    "from-rose-500 to-pink-500 dark:from-rose-600 dark:to-pink-600",
  ]

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardHeader className="pb-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-900/30 dark:to-purple-900/30">
        <CardTitle className="flex items-center justify-between text-xl md:text-2xl">
          <span className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-purple-500 dark:text-purple-400" />
            Your Learning Path
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs md:text-sm font-normal"
            onClick={() => router.push("/courses")}
          >
            View all courses
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 relative">
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 z-0"
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
          {/* Path connector line */}
          <div className="absolute left-6 md:left-8 top-8 bottom-8 w-1 md:w-1.5 bg-gradient-to-b from-purple-300 to-indigo-300 dark:from-purple-700 dark:to-indigo-700 rounded-full z-0"></div>

          {/* Course items */}
          <div className="space-y-6 md:space-y-8 relative z-10">
            {courses.map((course, index) => {
              const progress = calculateCourseProgress(course.id)
              const Icon = iconMap[course.icon] || BookOpen
              const isLocked = index > 0 && calculateCourseProgress(courses[index - 1].id) < 100
              const isHovered = hoveredCourse === course.id

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onHoverStart={() => setHoveredCourse(course.id)}
                  onHoverEnd={() => setHoveredCourse(null)}
                  className="flex items-start gap-4 md:gap-6"
                >
                  <motion.div
                    className={`relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full 
                      ${
                        progress === 100
                          ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white dark:from-green-500 dark:to-emerald-600"
                          : isLocked
                            ? "bg-gray-200 text-gray-400 dark:bg-gray-800"
                            : `bg-gradient-to-r ${courseColors[index % courseColors.length]} text-white`
                      }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      boxShadow: isHovered ? "0 0 15px rgba(147, 51, 234, 0.5)" : "0 0 0px rgba(147, 51, 234, 0)",
                    }}
                  >
                    {progress === 100 ? (
                      <CheckCircle2 className="h-6 w-6 md:h-8 md:w-8" />
                    ) : isLocked ? (
                      <LockIcon className="h-5 w-5 md:h-7 md:w-7" />
                    ) : (
                      <Icon className="h-5 w-5 md:h-7 md:w-7" />
                    )}

                    {/* Animated ring for active courses */}
                    {!isLocked && progress < 100 && (
                      <motion.div
                        className="absolute -inset-1 rounded-full border-2 border-transparent"
                        animate={{
                          borderColor: ["rgba(147, 51, 234, 0)", "rgba(147, 51, 234, 0.7)", "rgba(147, 51, 234, 0)"],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "loop",
                        }}
                      />
                    )}
                  </motion.div>

                  <motion.div
                    className="flex-1 bg-white dark:bg-gray-900 rounded-lg border p-3 md:p-4 shadow-sm"
                    whileHover={{ y: -5 }}
                    animate={{
                      boxShadow: isHovered
                        ? "0 10px 25px -5px rgba(147, 51, 234, 0.2)"
                        : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-base md:text-lg">{course.title}</h3>
                        <p className="text-sm md:text-base text-muted-foreground">{course.description}</p>
                      </div>
                      <div className="ml-2 px-2 py-1 text-xs md:text-sm rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 dark:from-purple-500/30 dark:to-indigo-500/30 text-primary font-medium">
                        {progress}%
                      </div>
                    </div>

                    <div className="mt-2 md:mt-3 flex items-center justify-between">
                      <span className="text-xs md:text-sm text-muted-foreground">{course.lessons} lessons</span>
                      <Button
                        size="sm"
                        variant={progress > 0 ? "default" : "outline"}
                        className={`h-8 md:h-9 text-xs md:text-sm ${progress > 0 ? "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white" : ""}`}
                        onClick={() => handleCourseSelect(course.id)}
                        disabled={isLocked}
                      >
                        {progress > 0 ? "Continue" : "Start"} <ChevronRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
