"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, BookOpen, Edit3, ListChecks } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlashcardModule } from "@/components/learning-modules/flashcard-module"
import { ListeningModule } from "@/components/learning-modules/listening-module"
import { FillBlankModule } from "@/components/learning-modules/fill-blank-module"
import { useVocabStore } from "@/lib/store"

interface LessonViewProps {
  courseId: number
  onBack: () => void
}

// Mock data for lessons
const getLessons = (courseId: number) => {
  const baseLessons = [
    { id: 1, title: "Greetings and Introductions" },
    { id: 2, title: "Daily Activities" },
    { id: 3, title: "Food and Dining" },
    { id: 4, title: "Travel and Directions" },
    { id: 5, title: "Shopping and Money" },
  ]

  // Return different number of lessons based on course
  return baseLessons.slice(0, courseId === 1 ? 5 : courseId === 2 ? 4 : 3)
}

export function LessonView({ courseId, onBack }: LessonViewProps) {
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null)
  const { setLesson } = useVocabStore()

  const lessons = getLessons(courseId)

  const handleLessonSelect = (lessonId: number) => {
    setSelectedLesson(lessonId)
    setLesson(lessonId)
  }

  if (selectedLesson !== null) {
    return <LearningModules courseId={courseId} lessonId={selectedLesson} onBack={() => setSelectedLesson(null)} />
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">
          Course {courseId}:{" "}
          {courseId === 1 ? "Beginner Vocabulary" : courseId === 2 ? "Business English" : "Academic English"}
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <motion.div key={lesson.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="border border-border h-full">
              <CardHeader>
                <CardTitle className="text-lg">
                  Lesson {lesson.id}: {lesson.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={() => handleLessonSelect(lesson.id)}>Start Lesson</Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

interface LearningModulesProps {
  courseId: number
  lessonId: number
  onBack: () => void
}

function LearningModules({ courseId, lessonId, onBack }: LearningModulesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">
          Lesson {lessonId}:{" "}
          {lessonId === 1
            ? "Greetings and Introductions"
            : lessonId === 2
              ? "Daily Activities"
              : lessonId === 3
                ? "Food and Dining"
                : lessonId === 4
                  ? "Travel and Directions"
                  : "Shopping and Money"}
        </h2>
      </div>

      <Tabs defaultValue="flashcards" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="flashcards" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" /> Flashcards
          </TabsTrigger>
          <TabsTrigger value="listening" className="flex items-center gap-2">
            <Edit3 className="h-4 w-4" /> Listening
          </TabsTrigger>
          <TabsTrigger value="fill-blank" className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" /> Fill in the Blank
          </TabsTrigger>
        </TabsList>
        <TabsContent value="flashcards">
          <FlashcardModule courseId={courseId} lessonId={lessonId} />
        </TabsContent>
        <TabsContent value="listening">
          <ListeningModule courseId={courseId} lessonId={lessonId} />
        </TabsContent>
        <TabsContent value="fill-blank">
          <FillBlankModule courseId={courseId} lessonId={lessonId} />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

