"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useVocabStore } from "@/lib/store"
import { useProgress } from "@/hooks/use-progress"
import { useAudio } from "@/hooks/use-audio"
import { LoadingAnimals } from "@/components/ui/loading-animals"
import { GamifiedFlashcardModule } from "@/components/learning-modules/gamified-flashcard-module"
import { ListeningModule } from "@/components/learning-modules/listening-module"
import { FillBlankModule } from "@/components/learning-modules/fill-blank-module"
import { LessonHeader } from "@/components/lessons/ui/lesson-header"
import { LessonTabs } from "@/components/lessons/ui/lesson-tabs"
import { getLessonById, getWordsByLessonId } from "@/data/lessons"
import type { LessonPageProps } from "@/types/lessons"
import type { Word } from "@/types/lessons"

export function LessonPage({ courseId, lessonId }: LessonPageProps) {
  const router = useRouter()
  const { setCourse, setLesson, startPracticeSession } = useVocabStore()
  const { recordActivity } = useProgress()
  const { playAudio } = useAudio()
  const [isLoading, setIsLoading] = useState(true)
  const [words, setWords] = useState<Word[]>([])
  const [lessonTitle, setLessonTitle] = useState("")
  const [lessonData, setLessonData] = useState(getLessonById(lessonId))

  useEffect(() => {
    setCourse(courseId)
    setLesson(lessonId)

    // Simulate API call to fetch lesson data
    const fetchLessonData = async () => {
      // In a real app, this would be an API call
      // For now, we'll simulate a delay and use mock data
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const fetchedLesson = getLessonById(lessonId)
      setLessonData(fetchedLesson)

      // Set lesson title
      setLessonTitle(fetchedLesson?.title || `Lesson ${lessonId}`)

      // Get words for this lesson
      const lessonWords = getWordsByLessonId(lessonId)
      setWords(lessonWords)

      setIsLoading(false)
    }

    fetchLessonData()
  }, [courseId, lessonId, setCourse, setLesson])

  const handleTabChange = (value: string) => {
    // Record activity when changing tabs
    recordActivity(courseId, lessonId, `viewed_${value}`, 1)
    playAudio("/sounds/tab-change.mp3")
  }

  const handlePracticeLesson = () => {
    startPracticeSession(10, courseId, lessonId)
    router.push("/practice/session")
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <LoadingAnimals type="owl" text="Loading lesson content..." size="lg" color="indigo" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      <LessonHeader lessonTitle={lessonTitle} lesson={lessonData} onPracticeLesson={handlePracticeLesson} />

      <LessonTabs
        onTabChange={handleTabChange}
        flashcardsContent={<GamifiedFlashcardModule courseId={courseId} lessonId={lessonId} words={words} />}
        listeningContent={<ListeningModule courseId={courseId} lessonId={lessonId} />}
        fillBlankContent={<FillBlankModule courseId={courseId} lessonId={lessonId} />}
      />
    </motion.div>
  )
}
