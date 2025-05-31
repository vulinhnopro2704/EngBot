"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Edit3, ListChecks } from "lucide-react"
import type { ReactNode } from "react"

interface LessonTabsProps {
  onTabChange: (value: string) => void
  flashcardsContent: ReactNode
  listeningContent: ReactNode
  fillBlankContent: ReactNode
}

export function LessonTabs({ onTabChange, flashcardsContent, listeningContent, fillBlankContent }: LessonTabsProps) {
  return (
    <Tabs defaultValue="flashcards" className="w-full" onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-3 p-1 bg-muted/80 backdrop-blur-sm">
        <TabsTrigger
          value="flashcards"
          className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/10 data-[state=active]:to-indigo-500/10"
        >
          <BookOpen className="h-4 w-4" /> Flashcards
        </TabsTrigger>
        <TabsTrigger
          value="listening"
          className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/10 data-[state=active]:to-teal-500/10"
        >
          <Edit3 className="h-4 w-4" /> Listening
        </TabsTrigger>
        <TabsTrigger
          value="fill-blank"
          className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/10 data-[state=active]:to-orange-500/10"
        >
          <ListChecks className="h-4 w-4" /> Fill in the Blank
        </TabsTrigger>
      </TabsList>
      <TabsContent value="flashcards">{flashcardsContent}</TabsContent>
      <TabsContent value="listening">{listeningContent}</TabsContent>
      <TabsContent value="fill-blank">{fillBlankContent}</TabsContent>
    </Tabs>
  )
}
