"use client"

import { LayoutDashboard, Book, Brain, List } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { NotebookEntry } from "@/types/notebook"

interface NotebookTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  totalWords: number
}

export function NotebookTabs({ activeTab, setActiveTab, totalWords }: NotebookTabsProps) {
  return (
    <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-900/30 dark:to-emerald-900/30 h-11 md:h-12">
        <TabsTrigger
          value="dashboard"
          className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white md:text-base"
        >
          <LayoutDashboard className="h-4 w-4 md:h-5 md:w-5" /> Dashboard
        </TabsTrigger>
        <TabsTrigger
          value="words"
          className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white md:text-base"
        >
          <List className="h-4 w-4 md:h-5 md:w-5" /> Word List
          <Badge variant="outline" className="ml-1 bg-white/20 text-inherit">
            {totalWords}
          </Badge>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
