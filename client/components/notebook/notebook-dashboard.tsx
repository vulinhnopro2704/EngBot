"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useVocabStore } from "@/lib/store"
import {
  Book,
  Brain,
  Clock,
  ListChecks,
  Loader2,
  Plus,
  RefreshCw,
} from "lucide-react"
import {
  cefrDescriptions,
  memorizationLevelDescriptions,
  getMemorizationLevelClasses,
} from "@/lib/vocabulary-utils"
import { AddWordDialog } from "@/components/notebook/add-word-dialog"
import { VocabularyReview } from "@/components/notebook/vocabulary-review"
import { NotebookWordsList } from "@/components/notebook/notebook-words-list"
import { NotebookTabs } from "@/components/notebook/ui/notebook-tabs"
import type { CEFRLevel, MemorizationLevel } from "@/data/types"
import { apiGet } from "@/lib/api-client"
import { ENDPOINTS } from "@/lib/endpoint"
import { MemoryLevelData } from "../dashboard/ui/memorization-level-chart"

export function NotebookDashboard() {
  const { notebookEntries, getMemorizationLevelCounts, getCEFRLevelCounts, getWordsForReview } = useVocabStore()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isReviewMode, setIsReviewMode] = useState(false)
  const [chartType, setChartType] = useState<"bar" | "pie">("bar")
  
  // State for API data
  const [memoryLevelData, setMemoryLevelData] = useState<MemoryLevelData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchMemoryLevelData = async () => {
      try {
        setIsLoading(true)
        const data = await apiGet<MemoryLevelData>(ENDPOINTS.USER_WORDS.COUNT_ALL_WORDS_BY_LEVEL)
        setMemoryLevelData(data)
        console.log("Fetched memory level data:", data)
      } catch (error) {
        console.error("Failed to fetch memory level data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMemoryLevelData()
  }, [])

  // Process the level counts from API response
  const processLevelCounts = () => {
    if (!memoryLevelData) return {}

    // Initialize all levels with 0 counts
    const result: Record<string, number> = {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
    }
    
    // Update levels with actual counts from API
    if (memoryLevelData.levelCounts) {
      Object.entries(memoryLevelData.levelCounts).forEach(([key, value]) => {
        // Match both snake_case (count_level1) and camelCase (countLevel1) formats
        const levelMatch = key.match(/count[_]?level(\d+)/i)
        if (levelMatch && levelMatch[1]) {
          result[levelMatch[1]] = value
        } else {
          console.warn(`Could not extract level number from key: ${key}`)
        }
      })
    } else {
      console.error("No level counts found in the API response", memoryLevelData)
    }

    return result
  }

  // Process CEFR counts from the cefrGroupCounts
  const processCefrCounts = () => {
    if (!memoryLevelData) return {}

    // Map CEFR group counts to specific CEFR levels
    return {
      "A1": memoryLevelData.cefrGroupCounts?.basic || 0,
      "A2": memoryLevelData.cefrGroupCounts?.basic || 0,
      "B1": memoryLevelData.cefrGroupCounts?.intermediate || 0,
      "B2": memoryLevelData.cefrGroupCounts?.intermediate || 0,
      "C1": memoryLevelData.cefrGroupCounts?.advanced || 0,
      "C2": memoryLevelData.cefrGroupCounts?.advanced || 0,
    }
  }

  // Get memory level counts from API or fallback to store
  const memorizationLevelCounts = memoryLevelData ? processLevelCounts() : getMemorizationLevelCounts()
  const cefrLevelCounts = memoryLevelData ? processCefrCounts() : getCEFRLevelCounts()

  // Calculate total words as sum of level counts
  const totalWords = Object.values(memorizationLevelCounts).reduce((sum, count) => sum + count, 0)
  
  // Get words for review from API or fallback to store
  const wordsForReview = memoryLevelData?.reviewWordCount || getWordsForReview().length
  
  // Calculate average level - weighted average of level * count / totalWords
  const calculateAverageLevel = () => {
    if (totalWords === 0) return "0.0"
    
    const totalLevelSum = Object.entries(memorizationLevelCounts).reduce(
      (sum, [level, count]) => sum + (Number(level) * count), 0
    )
    
    return (totalLevelSum / totalWords).toFixed(1)
  }
  
  const averageLevel = calculateAverageLevel()

  // Format time until next review
  const formatTimeUntilNextReview = () => {
    if (!memoryLevelData?.timeUntilNextReview) return "N/A"
    
    const { hours, minutes, seconds } = memoryLevelData.timeUntilNextReview
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    } else {
      return `${seconds}s`
    }
  }

  // Prepare data for memorization level chart
  const memorizationChartData = Object.entries(memorizationLevelCounts).map(([level, count]) => ({
    level: `Level ${level}`,
    count,
    description: memorizationLevelDescriptions[Number.parseInt(level) as MemorizationLevel],
    color:
      level === "1"
        ? "#EF4444"
        : level === "2"
          ? "#F97316"
          : level === "3"
            ? "#EAB308"
            : level === "4"
              ? "#22C55E"
              : "#3B82F6",
  }))

  // Prepare data for CEFR level chart
  const cefrChartData = Object.entries(cefrLevelCounts).map(([level, count]) => ({
    level,
    count,
    description: cefrDescriptions[level as CEFRLevel],
    color:
      level === "A1"
        ? "#3B82F6"
        : level === "A2"
          ? "#22C55E"
          : level === "B1"
            ? "#EAB308"
            : level === "B2"
              ? "#F97316"
              : level === "C1"
                ? "#EF4444"
                : "#A855F7",
  }))

  // Calculate memorization level percentages for the progress bars
  const levelPercentages = Object.entries(memorizationLevelCounts).reduce(
    (acc, [level, count]) => {
      acc[level] = totalWords > 0 ? (count / totalWords) * 100 : 0
      return acc
    },
    {} as Record<string, number>,
  )

  const handleStartReview = () => {
    setIsReviewMode(true)
  }

  const handleCompleteReview = () => {
    setIsReviewMode(false)
  }

  const toggleChartType = () => {
    setChartType(chartType === "bar" ? "pie" : "bar")
  }

  // If in review mode, return the VocabularyReview component
  if (isReviewMode) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="review"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <VocabularyReview onComplete={handleCompleteReview} />
        </motion.div>
      </AnimatePresence>
    )
  }

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading vocabulary dashboard...</p>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="dashboard"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Notebook Tabs */}
        <NotebookTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          totalWords={totalWords}
        />

        {/* Dashboard Tab Content */}
        {activeTab === "dashboard" && (
          <>
            {/* Header with stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                  <p className="text-xs text-muted-foreground">
                    {memoryLevelData?.timeUntilNextReview && wordsForReview === 0 ? 
                      `Next review in ${formatTimeUntilNextReview()}` : 
                      "Words that need review today"}
                  </p>
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

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Actions</CardTitle>
                  <ListChecks className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button onClick={() => setIsAddDialogOpen(true)} className="w-full text-sm" size="sm">
                    <Plus className="mr-1 h-4 w-4" /> Add Word
                  </Button>
                  <Button
                    onClick={handleStartReview}
                    variant={wordsForReview > 0 ? "default" : "outline"}
                    className="w-full text-sm"
                    size="sm"
                    disabled={wordsForReview === 0}
                  >
                    <RefreshCw className="mr-1 h-4 w-4" /> Start Review
                    {wordsForReview > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {wordsForReview}
                      </Badge>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Memorization Level Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Memorization Progress</CardTitle>
                <CardDescription>Distribution of your vocabulary across memorization levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[5, 4, 3, 2, 1].map((level) => {
                    const count = memorizationLevelCounts[level] || 0
                    const percentage = levelPercentages[level] || 0
                    return (
                      <div key={level} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center">
                            <Badge className={getMemorizationLevelClasses(level as MemorizationLevel)}>Level {level}</Badge>
                            <span className="ml-2 text-muted-foreground">
                              {memorizationLevelDescriptions[level as MemorizationLevel]}
                            </span>
                          </div>
                          <span>{count} words</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              level === 1
                                ? "bg-red-500"
                                : level === 2
                                  ? "bg-orange-500"
                                  : level === 3
                                    ? "bg-yellow-500"
                                    : level === 4
                                      ? "bg-green-500"
                                      : "bg-blue-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* CEFR Group Distribution */}
            {memoryLevelData?.cefrGroupCounts && (
              <Card>
                <CardHeader>
                  <CardTitle>CEFR Group Distribution</CardTitle>
                  <CardDescription>Words by proficiency group</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                      <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400">Basic (A1-A2)</h3>
                      <p className="text-2xl font-bold mt-1">{memoryLevelData.cefrGroupCounts.basic}</p>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
                      <h3 className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Intermediate (B1-B2)</h3>
                      <p className="text-2xl font-bold mt-1">{memoryLevelData.cefrGroupCounts.intermediate}</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
                      <h3 className="text-sm font-medium text-red-600 dark:text-red-400">Advanced (C1-C2)</h3>
                      <p className="text-2xl font-bold mt-1">{memoryLevelData.cefrGroupCounts.advanced}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Next Review Info */}
            {memoryLevelData?.timeUntilNextReview && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Schedule</CardTitle>
                  <CardDescription>Next review timing information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">{wordsForReview > 0 ? "Words due now:" : "Next review in:"}</p>
                      <p className="text-2xl font-bold">
                        {wordsForReview > 0 ? wordsForReview : formatTimeUntilNextReview()}
                      </p>
                    </div>
                    
                    {wordsForReview > 0 && (
                      <Button onClick={handleStartReview}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Start Review
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Words List Tab Content */}
        {activeTab === "words" && (
          <NotebookWordsList />
        )}

        {/* AddWordDialog always available */}
        <AddWordDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
      </motion.div>
    </AnimatePresence>
  )
}
