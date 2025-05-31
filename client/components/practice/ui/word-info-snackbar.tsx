"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Volume2, BookOpen, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAudio } from "@/hooks/use-audio"
import type { VocabularyWord } from "@/data/types"

type WordInfoSnackbarProps = {
  word: VocabularyWord
  isVisible: boolean
  onClose: () => void
  onContinue?: () => void
  showContinueButton?: boolean
  isCorrect?: boolean
}

export function WordInfoSnackbar({
  word,
  isVisible,
  onClose,
  onContinue,
  showContinueButton = false,
  isCorrect,
}: WordInfoSnackbarProps) {
  const { speakWord } = useAudio()
  const [isClosing, setIsClosing] = useState(false)

  // Auto-close after 30 seconds if no continue button
  useEffect(() => {
    if (isVisible && !showContinueButton) {
      const timer = setTimeout(() => {
        setIsClosing(true)
      }, 30000)

      return () => clearTimeout(timer)
    }

    setIsClosing(false)
  }, [isVisible, showContinueButton])

  // Handle closing animation
  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        onClose()
        setIsClosing(false)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [isClosing, onClose])

  // Pronounce word when snackbar appears
  useEffect(() => {
    if (isVisible && word) {
      setTimeout(() => {
        speakWord(word.word)
      }, 500)
    }
  }, [isVisible, word, speakWord])

  const handlePlayAudio = () => {
    if (word) {
      speakWord(word.word)
    }
  }

  const handleContinue = () => {
    setIsClosing(true)
    if (onContinue) {
      setTimeout(() => {
        onContinue()
      }, 300)
    }
  }

  if (!word) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <div
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border ${isCorrect ? "border-green-200 dark:border-green-800" : "border-gray-200 dark:border-gray-700"} p-4 mx-4`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <BookOpen className={`h-5 w-5 ${isCorrect ? "text-green-500" : "text-primary"}`} />
                <h3 className="text-lg font-semibold">Word Information</h3>
              </div>
              {!showContinueButton && (
                <button
                  onClick={() => setIsClosing(true)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xl font-bold">{word.word}</span>
                  {word.pronunciation && (
                    <span className="text-sm text-muted-foreground ml-2">{word.pronunciation}</span>
                  )}
                </div>
                <button
                  onClick={handlePlayAudio}
                  className="p-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-1">
                {word.pos && (
                  <Badge variant="outline" className="text-xs">
                    {word.pos}
                  </Badge>
                )}
                {word.level && (
                  <Badge variant="secondary" className="text-xs">
                    {word.level}
                  </Badge>
                )}
              </div>

              <div className="pt-1">
                <p className="text-sm font-medium">Meaning:</p>
                <p className="text-sm text-muted-foreground">{word.meaning}</p>
              </div>

              {word.example && (
                <div className="pt-1">
                  <p className="text-sm font-medium">Example:</p>
                  <p className="text-sm text-muted-foreground italic">"{word.example}"</p>
                </div>
              )}

              {word.synonyms && word.synonyms.length > 0 && (
                <div className="pt-1">
                  <p className="text-sm font-medium">Synonyms:</p>
                  <p className="text-sm text-muted-foreground">{word.synonyms.join(", ")}</p>
                </div>
              )}

              {showContinueButton && (
                <div className="pt-3 flex justify-end">
                  <Button
                    onClick={handleContinue}
                    className={`${isCorrect ? "bg-green-500 hover:bg-green-600" : "bg-primary hover:bg-primary/90"}`}
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
