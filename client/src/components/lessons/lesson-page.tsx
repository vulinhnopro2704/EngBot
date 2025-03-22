"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { BookOpen, Edit3, ListChecks, Brain } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlashcardModule } from "@/components/learning-modules/flashcard-module"
import { ListeningModule } from "@/components/learning-modules/listening-module"
import { FillBlankModule } from "@/components/learning-modules/fill-blank-module"
import { useVocabStore } from "@/lib/store"
import { useProgress } from "@/hooks/use-progress"
import { useAudio } from "@/hooks/use-audio"
import { getLessonTitle, getLessonTitleVi } from "@/data/courses"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

type LessonPageProps = {
  courseId: number
  lessonId: number
}

export function LessonPage({ courseId, lessonId }: LessonPageProps) {
  const router = useRouter()
  const { setCourse, setLesson, startPracticeSession } = useVocabStore()
  const { recordActivity } = useProgress()
  const { playSound } = useAudio()

  useEffect(() => {
    setCourse(courseId)
    setLesson(lessonId)
  }, [courseId, lessonId, setCourse, setLesson])

  const handleTabChange = (value: string) => {
    // Record activity when changing tabs
    recordActivity(courseId, lessonId, `viewed_${value}`, 1)
    playSound("click")
  }

  const handlePracticeLesson = () => {
    startPracticeSession(10, courseId, lessonId)
    router.push("/practice/session")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          Lesson {lessonId}: {getLessonTitle(lessonId)}
        </h2>
        <p className="text-muted-foreground">{getLessonTitleVi(lessonId)}</p>

        <div className="flex justify-center mt-4">
          <Button onClick={handlePracticeLesson} className="flex items-center gap-2">
            <Brain className="h-4 w-4" /> Practice This Lesson
          </Button>
        </div>
      </div>

      <Tabs defaultValue="flashcards" className="w-full" onValueChange={handleTabChange}>
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

