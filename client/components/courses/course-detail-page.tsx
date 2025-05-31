"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft, BookOpen, CheckCircle2, Lock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useVocabStore } from "@/lib/store"
import { useProgress } from "@/hooks/use-progress"
import { getLessonsByCourseId } from "@/data/courses"
import { enhancedCourses } from "@/data/enhanced-courses"
import { LoadingAnimals } from "@/components/ui/loading-animals"

type CourseDetailPageProps = {
  courseId: number
}

export function CourseDetailPage({ courseId }: CourseDetailPageProps) {
  const router = useRouter()
  const { setCourse, setLesson } = useVocabStore()
  const { isLessonCompleted } = useProgress()
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading state
  useEffect(() => {
    setCourse(courseId)

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [courseId, setCourse])

  const course = enhancedCourses.find((c) => c.id === courseId)
  const lessons = getLessonsByCourseId(courseId)

  const handleLessonSelect = (lessonId: number) => {
    setLesson(lessonId)
    router.push(`/courses/${courseId}/lessons/${lessonId}`)
  }

  // Determine which lessons are unlocked
  const getUnlockedStatus = (index: number) => {
    if (index === 0) return true
    return isLessonCompleted(courseId, lessons[index - 1].id)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <LoadingAnimals type="hamster" text="Loading course details..." size="lg" color="blue" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl">Course not found</h2>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/courses")}>
          Back to Courses
        </Button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 max-w-4xl mx-auto px-4"
    >
      {/* Simple Course Header */}
      <div className="flex items-center gap-4 py-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/courses")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            {course.title}
          </h1>
          <p className="text-muted-foreground">{course.titleVi}</p>
        </div>
      </div>

      {/* Course Description */}
      <p className="text-muted-foreground">{course.description}</p>

      {/* Lessons List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Lessons</h2>
        <div className="grid gap-4">
          {lessons.map((lesson, index) => {
            const isCompleted = isLessonCompleted(courseId, lesson.id)
            const isUnlocked = getUnlockedStatus(index)

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={isUnlocked ? "" : "opacity-70"}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-medium">
                          {lesson.id}
                        </div>
                        <div>
                          <h3 className="font-medium">{lesson.title}</h3>
                          <p className="text-sm text-muted-foreground">{lesson.titleVi}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCompleted && (
                          <div className="flex items-center text-green-500 mr-2">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                        )}

                        {isUnlocked ? (
                          <Button
                            onClick={() => handleLessonSelect(lesson.id)}
                            variant={isCompleted ? "outline" : "default"}
                          >
                            {isCompleted ? "Review" : "Start"}
                          </Button>
                        ) : (
                          <Button variant="outline" disabled className="flex items-center gap-2">
                            <Lock className="h-4 w-4" /> Locked
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
