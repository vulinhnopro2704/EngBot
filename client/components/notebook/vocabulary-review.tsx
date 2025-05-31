"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useVocabStore } from "@/lib/store"
import { useAudio } from "@/hooks/use-audio"
import { ArrowLeft, Brain } from "lucide-react"
import { GamifiedReviewModule } from "@/components/learning-modules/gamified-review-module"
import { LoadingAnimals } from "@/components/ui/loading-animals"
import type { Word } from "@/data/types"

interface VocabularyReviewProps {
  onComplete: () => void
}

export function VocabularyReview({ onComplete }: VocabularyReviewProps) {
  const { getWordsForReview } = useVocabStore()
  const { playAudio } = useAudio()

  const [isLoading, setIsLoading] = useState(true)
  const [wordsToReview, setWordsToReview] = useState<Word[]>([])

  // Initialize review session
  useEffect(() => {
    let isMounted = true // Add a flag to prevent state updates on unmounted components

    const fetchWordsForReview = async () => {
      setIsLoading(true) // Set loading to true before fetching
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const words = getWordsForReview()

      const wordsForReview: Word[] = words.map((word) => ({
        id: word.id,
        lesson: 1, // Placeholder
        word: word.word,
        pronunciation: word.phonetic || "",
        pos: (word.wordType as any) || "noun",
        meaning: word.definition,
        example: word.example || "",
        example_vi: word.exampleVi || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        cefr: word.cefr || "A1",
      }))

      if (isMounted) {
        setWordsToReview(wordsForReview)
        setIsLoading(false)
        playAudio("/sounds/ready.mp3")
      }
    }

    fetchWordsForReview()

    return () => {
      isMounted = false // Set the flag to false when the component unmounts
    }
  }, [getWordsForReview, playAudio])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <LoadingAnimals type="owl" text="Preparing your review session..." size="lg" color="indigo" />
      </div>
    )
  }

  // If no words to review
  if (wordsToReview.length === 0) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Vocabulary Review</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No words to review</h3>
            <p className="text-muted-foreground mb-6">You don't have any words due for review at the moment.</p>
            <Button
              onClick={onComplete}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Make sure onComplete is a function before passing it
  const handleComplete =
    typeof onComplete === "function" ? onComplete : () => console.log("No onComplete handler provided")

  return <GamifiedReviewModule words={wordsToReview} onComplete={handleComplete} />
}
