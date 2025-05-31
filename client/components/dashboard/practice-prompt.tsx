"use client"

import { useRouter } from "next/navigation"
import { Brain, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useVocabStore } from "@/lib/store"

export function PracticePrompt() {
  const router = useRouter()
  const { startPracticeSession } = useVocabStore()

  const handleStartQuickPractice = () => {
    startPracticeSession(10)
    router.push("/practice/session")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" /> Quick Practice
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Test your vocabulary knowledge with a quick practice session</p>
        <Button onClick={handleStartQuickPractice} className="w-full">
          Start Practice <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
