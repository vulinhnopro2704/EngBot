"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Brain } from "lucide-react"
import type { Lesson } from "@/types/lessons"

interface LessonHeaderProps {
  lessonTitle: string
  lesson?: Lesson
  onPracticeLesson: () => void
}

export function LessonHeader({ lessonTitle, lesson, onPracticeLesson }: LessonHeaderProps) {
  return (
    <div className="text-center space-y-2">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
          {lessonTitle}
        </h2>
        {lesson?.description && <p className="text-muted-foreground mt-1">{lesson.description}</p>}
      </motion.div>

      <div className="flex justify-center mt-4">
        <Button
          onClick={onPracticeLesson}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
        >
          <Brain className="h-4 w-4" /> Practice This Lesson
        </Button>
      </div>
    </div>
  )
}
