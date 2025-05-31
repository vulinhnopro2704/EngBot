"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { PracticeQuestion } from "@/data/types"

interface MultipleChoiceQuestionProps {
  question: PracticeQuestion
  onSubmit: (answer: string) => void
  feedback: "correct" | "incorrect" | null
  showingFeedback: boolean
}

export function MultipleChoiceQuestion({ question, onSubmit, feedback, showingFeedback }: MultipleChoiceQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleSelectOption = (option: string) => {
    if (showingFeedback) return
    setSelectedOption(option)
  }

  const handleSubmit = () => {
    if (!selectedOption || showingFeedback) return
    onSubmit(selectedOption)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Choose the correct definition</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-primary/5 rounded-md text-center">
          <h3 className="text-2xl font-bold">{question.word.word}</h3>
          <p className="text-sm text-muted-foreground mt-1">{question.word.phonetic}</p>
          <p className="text-sm italic mt-2 text-muted-foreground">{question.word.definitionVi}</p>
        </div>

        <div className="space-y-3">
          {question.options?.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className={`w-full justify-start text-left p-4 h-auto ${
                selectedOption === option ? "border-primary bg-primary/5" : ""
              } ${
                showingFeedback && option === question.correctAnswer
                  ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                  : showingFeedback && selectedOption === option && option !== question.correctAnswer
                    ? "border-red-500 bg-red-50 dark:bg-red-950/30"
                    : ""
              }`}
              onClick={() => handleSelectOption(option)}
              disabled={showingFeedback}
            >
              {option}
            </Button>
          ))}
        </div>

        <Button className="w-full" onClick={handleSubmit} disabled={!selectedOption || showingFeedback}>
          Submit Answer
        </Button>

        {showingFeedback && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Alert variant={feedback === "correct" ? "default" : "destructive"}>
              <AlertDescription className="flex items-center gap-2">
                {feedback === "correct" ? (
                  <>
                    <Check className="h-4 w-4" />
                    Correct! The definition of "{question.word.word}" is "{question.correctAnswer}".
                    {/* Audio will be played by the parent component */}
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4" />
                    Incorrect. The correct definition of "{question.word.word}" is "{question.correctAnswer}".
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
