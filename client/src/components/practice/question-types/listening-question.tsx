"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Volume2, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { PracticeQuestion } from "@/data/types"
import { useAudio } from "@/hooks/use-audio"

interface ListeningQuestionProps {
  question: PracticeQuestion
  onSubmit: (answer: string) => void
  feedback: "correct" | "incorrect" | null
  showingFeedback: boolean
}

export function ListeningQuestion({ question, onSubmit, feedback, showingFeedback }: ListeningQuestionProps) {
  const [userInput, setUserInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const { speakWord, autoPlayAudio, cancelSpeech } = useAudio()

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }

    // Auto-speak the word if enabled, but only once
    if (autoPlayAudio) {
      // Small delay to ensure UI is ready
      const timer = setTimeout(() => {
        speakWord(question.word.word, 0.8)
      }, 500)

      // Clean up function to prevent memory leaks and cancel speech when unmounting
      return () => {
        clearTimeout(timer)
        cancelSpeech()
      }
    }

    return () => {
      cancelSpeech()
    }
  }, [question.id, autoPlayAudio, speakWord, question.word.word, cancelSpeech])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInput.trim() || showingFeedback) return
    onSubmit(userInput)
  }

  const handleSpeakWord = () => {
    speakWord(question.word.word, 0.8)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Listen and Type</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <Button variant="outline" size="lg" className="h-20 w-20 rounded-full" onClick={handleSpeakWord}>
            <Volume2 className="h-8 w-8" />
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">Listen to the word and type what you hear</p>
          <p className="text-sm italic text-muted-foreground mt-1">Hint: {question.word.definitionVi}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Type what you hear..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="text-center text-lg"
            disabled={showingFeedback}
          />

          <Button type="submit" className="w-full" disabled={!userInput.trim() || showingFeedback}>
            Submit Answer
          </Button>
        </form>

        {showingFeedback && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Alert variant={feedback === "correct" ? "default" : "destructive"}>
              <AlertDescription className="flex items-center gap-2">
                {feedback === "correct" ? (
                  <>
                    <Check className="h-4 w-4" />
                    Correct! The word is "{question.word.word}".
                    {/* Audio will be played by the parent component */}
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4" />
                    Incorrect. The correct word is "{question.word.word}".
                  </>
                )}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

