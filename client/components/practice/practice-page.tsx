"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BookOpenCheck, Brain, Clock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePracticeStore } from "@/lib/practice-store"
import { useAudio } from "@/hooks/use-audio"
import { PracticeHeader } from "@/components/practice/ui/practice-header"
import { PracticeModeCard } from "@/components/practice/ui/practice-mode-card"
import { PracticeHistorySection } from "@/components/practice/sections/practice-history-section"
import type { PracticeMode } from "@/types/practice"

export function PracticePage() {
  const router = useRouter()
  const { startSession, streakCount, totalCorrect, sessionHistory } = usePracticeStore()
  const { playAudio } = useAudio()

  const [activeTab, setActiveTab] = useState<string>("mixed")
  const [wordCount, setWordCount] = useState<number>(10)
  const [isLoading, setIsLoading] = useState(false)

  const handleStartSession = (mode: PracticeMode = activeTab as PracticeMode) => {
    setIsLoading(true)
    playAudio("/sounds/ready.mp3")

    // Start a new practice session with the selected mode
    startSession(mode, wordCount)

    // Navigate to the practice session page
    setTimeout(() => {
      router.push("/practice/session")
    }, 800)
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Practice</h1>
          <p className="text-muted-foreground">
            Strengthen your vocabulary through targeted exercises with spaced repetition.
          </p>
        </div>

        <PracticeHeader
          totalCorrect={totalCorrect}
          sessionCount={sessionHistory.length}
          streakCount={streakCount}
          wordCount={wordCount}
          setWordCount={setWordCount}
          isLoading={isLoading}
          handleStartSession={() => handleStartSession()}
          activeTab={activeTab}
        />

        <Tabs defaultValue="mixed" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="mixed">Mixed</TabsTrigger>
            <TabsTrigger value="multiple-choice">Choice</TabsTrigger>
            <TabsTrigger value="fill-blank">Fill</TabsTrigger>
            <TabsTrigger value="listening">Listen</TabsTrigger>
            <TabsTrigger value="matching">Match</TabsTrigger>
            <TabsTrigger value="drag-drop">Drag</TabsTrigger>
          </TabsList>

          <TabsContent value="mixed">
            <PracticeModeCard
              title="Mixed Practice"
              description="A combination of all exercise types to keep your practice varied and engaging."
              content={
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center">
                    <BookOpenCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Multiple exercise types</span>
                  </div>
                  <div className="flex items-center">
                    <Brain className="h-5 w-5 text-purple-500 mr-2" />
                    <span>Better retention</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-blue-500 mr-2" />
                    <span>Varied pacing</span>
                  </div>
                </div>
              }
              onStart={() => handleStartSession("mixed")}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="multiple-choice">
            <PracticeModeCard
              title="Multiple Choice"
              description="Choose the correct definition for each word from multiple options."
              content={
                <p>
                  Multiple choice questions help you recognize the correct definition among several options, which is
                  great for building your recognition skills.
                </p>
              }
              onStart={() => handleStartSession("multiple-choice")}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="fill-blank">
            <PracticeModeCard
              title="Fill in the Blank"
              description="Complete sentences by filling in missing words."
              content={
                <p>
                  Fill in the blank exercises test your active recall and help you understand the word's usage in
                  context.
                </p>
              }
              onStart={() => handleStartSession("fill-blank")}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="listening">
            <PracticeModeCard
              title="Listening Practice"
              description="Listen to the pronunciation and type the word you hear."
              content={
                <p>
                  Listening exercises improve your pronunciation recognition and spelling skills, which are essential
                  for listening comprehension.
                </p>
              }
              onStart={() => handleStartSession("listening")}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="matching">
            <PracticeModeCard
              title="Matching Exercise"
              description="Match words with their correct definitions."
              content={
                <p>
                  Matching exercises help you connect words with their meanings, reinforcing the relationships between
                  concepts.
                </p>
              }
              onStart={() => handleStartSession("matching")}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="drag-drop">
            <PracticeModeCard
              title="Drag and Drop"
              description="Arrange words in sentences by dragging them to the correct positions."
              content={
                <p>
                  Drag and drop exercises test your understanding of sentence structure and how words are used in
                  context.
                </p>
              }
              onStart={() => handleStartSession("drag-drop")}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>

        {/* Recent Practice History */}
        {sessionHistory.length > 0 && <PracticeHistorySection sessionHistory={sessionHistory.slice(0, 3)} />}
      </div>
    </div>
  )
}
