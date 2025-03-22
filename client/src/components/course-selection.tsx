"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LessonView } from "@/components/lesson-view"
import { useVocabStore } from "@/lib/store"

const courses = [
  {
    id: 1,
    title: "Beginner Vocabulary",
    description: "Essential words for everyday communication",
    lessons: 5,
    color: "bg-blue-100 dark:bg-blue-950",
  },
  {
    id: 2,
    title: "Business English",
    description: "Professional vocabulary for the workplace",
    lessons: 4,
    color: "bg-green-100 dark:bg-green-950",
  },
  {
    id: 3,
    title: "Academic English",
    description: "Vocabulary for academic writing and research",
    lessons: 3,
    color: "bg-purple-100 dark:bg-purple-950",
  },
]

export function CourseSelection() {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null)
  const { setCourse } = useVocabStore()

  const handleCourseSelect = (courseId: number) => {
    setSelectedCourse(courseId)
    setCourse(courseId)
  }

  if (selectedCourse !== null) {
    return <LessonView courseId={selectedCourse} onBack={() => setSelectedCourse(null)} />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {courses.map((course) => (
        <motion.div key={course.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Card className={`${course.color} border-none shadow-md h-full`}>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription className="text-foreground/70">{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span>{course.lessons} lessons</span>
                <Button onClick={() => handleCourseSelect(course.id)} className="flex items-center gap-1">
                  Start <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}

