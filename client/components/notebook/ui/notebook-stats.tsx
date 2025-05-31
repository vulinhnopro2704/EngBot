import { Book, Brain, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { NotebookEntry } from "@/types/notebook"

interface NotebookStatsProps {
  notebookEntries: NotebookEntry[]
  wordsForReview: number
}

export function NotebookStats({ notebookEntries, wordsForReview }: NotebookStatsProps) {
  const totalWords = notebookEntries.length

  // Calculate average memorization level
  const totalLevels = notebookEntries.reduce((sum, entry) => sum + (entry.level || 1), 0)
  const averageLevel = totalWords > 0 ? (totalLevels / totalWords).toFixed(1) : "0.0"

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Words</CardTitle>
          <Book className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalWords}</div>
          <p className="text-xs text-muted-foreground">Words in your vocabulary notebook</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Due for Review</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{wordsForReview}</div>
          <p className="text-xs text-muted-foreground">Words that need review today</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Level</CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageLevel}</div>
          <p className="text-xs text-muted-foreground">Average memorization level</p>
        </CardContent>
      </Card>
    </div>
  )
}
