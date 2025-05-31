"use client"

import { LayoutDashboard, Book, Brain } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { NotebookEntry } from "@/types/notebook"

interface NotebookTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  notebookEntries: NotebookEntry[]
  wordsForReview: number
}

export function NotebookTabs({ activeTab, setActiveTab, notebookEntries, wordsForReview }: NotebookTabsProps) {
  return (
    <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-900/30 dark:to-emerald-900/30 h-11 md:h-12">
        <TabsTrigger
          value="dashboard"
          className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white md:text-base"
        >
          <LayoutDashboard className="h-4 w-4 md:h-5 md:w-5" /> Dashboard
        </TabsTrigger>
        <TabsTrigger
          value="all"
          className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white md:text-base"
        >
          <Book className="h-4 w-4 md:h-5 md:w-5" /> All Words
          <Badge variant="outline" className="ml-1 bg-white/20 text-inherit">
            {notebookEntries.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger
          value="review"
          className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white md:text-base"
        >
          <Brain className="h-4 w-4 md:h-5 md:w-5" /> Review
          <Badge variant="outline" className="ml-1 bg-white/20 text-inherit">
            {wordsForReview}
          </Badge>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
