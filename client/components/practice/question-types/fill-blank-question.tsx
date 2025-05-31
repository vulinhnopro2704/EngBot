"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { PracticeQuestion } from "@/data/types"
import { generateFillBlankSentence } from "@/data/practice"

interface FillBlankQuestionProps {
  question: PracticeQuestion
  onSubmit: (answer: string) => void
  feedback: "correct" | "incorrect" | null
  showingFeedback: boolean
}

export function FillBlankQuestion({ question, onSubmit, feedback, showingFeedback }: FillBlankQuestionProps) {
  const [userInput, setUserInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [question.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInput.trim() || showingFeedback) return
    onSubmit(userInput)
  }

  const sentence = generateFillBlankSentence(question.word)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Fill in the blank</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-primary/5 rounded-md">
          <p className="text-lg">{sentence}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Definition: {question.word.definition}</p>
          <p className="text-sm italic text-muted-foreground">{question.word.definitionVi}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Type the missing word..."
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
                    Correct! The missing word is "{question.word.word}".
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
