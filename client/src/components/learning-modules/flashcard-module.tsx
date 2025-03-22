"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, RotateCw, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getVocabularyWords } from "@/data/vocabulary"
import { useProgress } from "@/hooks/use-progress"
import { useAudio } from "@/hooks/use-audio"
import { useVocabStore } from "@/lib/store"

type FlashcardModuleProps = {
  courseId: number
  lessonId: number
}

export function FlashcardModule({ courseId, lessonId }: FlashcardModuleProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const { recordActivity } = useProgress()
  const { speakWord, autoPlayAudio } = useAudio()
  const { addToNotebook } = useVocabStore()

  const vocabularyWords = getVocabularyWords(courseId, lessonId)
  const currentWord = vocabularyWords[currentIndex]

  useEffect(() => {
    // Auto-speak the word when card is shown if autoPlayAudio is enabled
    if (autoPlayAudio && !flipped && currentWord) {
      const timer = setTimeout(() => {
        speakWord(currentWord.word)
      }, 200)

      return () => {
        clearTimeout(timer)
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel()
        }
      }
    }

    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [currentIndex, flipped, autoPlayAudio, currentWord, speakWord])

  const handleNext = () => {
    if (currentIndex < vocabularyWords.length - 1) {
      setFlipped(false)
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1)
        // Record progress
        recordActivity(courseId, lessonId, "flashcard_viewed", 1)
      }, 200)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setFlipped(false)
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1)
      }, 200)
    }
  }

  const handleFlip = () => {
    setFlipped(!flipped)
    if (!flipped) {
      // Record that user viewed the definition
      recordActivity(courseId, lessonId, "flashcard_flipped", 1)
    }
  }

  const handleAddToNotebook = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToNotebook(currentWord, "lesson", `Course ${courseId}, Lesson ${lessonId}`)
  }

  const progress = ((currentIndex + 1) / vocabularyWords.length) * 100

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Word {currentIndex + 1} of {vocabularyWords.length}
        </span>
        <Progress value={progress} className="w-1/3" />
      </div>

      <div className="flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex + (flipped ? "-flipped" : "")}
            initial={{ opacity: 0, rotateY: flipped ? -90 : 0 }}
            animate={{ opacity: 1, rotateY: flipped ? 180 : 0 }}
            exit={{ opacity: 0, rotateY: flipped ? 270 : -90 }}
            transition={{ duration: 0.4 }}
            style={{ perspective: 1000 }}
            className="w-full max-w-md"
          >
            <Card
              className="h-64 flex items-center justify-center cursor-pointer bg-primary/5 border-2 border-primary/20 relative"
              onClick={handleFlip}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10"
                onClick={handleAddToNotebook}
                title="Add to notebook"
              >
                <Star className="h-4 w-4" />
              </Button>

              <CardContent className="p-6 text-center">
                {!flipped ? (
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold">{currentWord.word}</h3>
                    {currentWord.phonetic && <p className="text-muted-foreground">{currentWord.phonetic}</p>}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-4"
                      onClick={(e) => {
                        e.stopPropagation()
                        speakWord(currentWord.word)
                      }}
                    >
                      Click to hear pronunciation
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4" style={{ transform: "rotateY(180deg)" }}>
                    <p className="text-xl">{currentWord.definition}</p>
                    {currentWord.example && (
                      <p className="text-sm italic text-muted-foreground">"{currentWord.example}"</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-4 items-center">
        <Button variant="outline" size="icon" onClick={handlePrevious} disabled={currentIndex === 0}>
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="icon" onClick={handleFlip}>
          <RotateCw className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={currentIndex === vocabularyWords.length - 1}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

