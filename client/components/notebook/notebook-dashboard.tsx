"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useVocabStore } from "@/lib/store"
import {
  Book,
  BookOpen,
  Brain,
  ChevronRight,
  Clock,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  Plus,
  BarChart2,
  PieChartIcon,
  RefreshCw,
} from "lucide-react"
import {
  cefrDescriptions,
  memorizationLevelDescriptions,
  getCEFRLevelClasses,
  getMemorizationLevelClasses,
} from "@/lib/vocabulary-utils"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AddWordDialog } from "@/components/notebook/add-word-dialog"
import { VocabularyReview } from "@/components/notebook/vocabulary-review"
import type { CEFRLevel, MemorizationLevel } from "@/data/types"

export function NotebookDashboard() {
  const { notebookEntries, getMemorizationLevelCounts, getCEFRLevelCounts, getWordsForReview } = useVocabStore()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [isReviewMode, setIsReviewMode] = useState(false)
  const [chartType, setChartType] = useState<"bar" | "pie">("bar")

  // Get counts for charts
  const memorizationLevelCounts = getMemorizationLevelCounts()
  const cefrLevelCounts = getCEFRLevelCounts()

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

  // Calculate total words and words due for review
  const totalWords = notebookEntries.length
  const wordsForReview = getWordsForReview().length

  // Calculate average memorization level
  const totalLevels = notebookEntries.reduce((sum, entry) => sum + (entry.level || 1), 0)
  const averageLevel = totalWords > 0 ? (totalLevels / totalWords).toFixed(1) : "0.0"

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

        {/* Tabs for different views */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <LayoutDashboard className="h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="memorization" className="flex items-center gap-1">
              <Brain className="h-4 w-4" /> Memorization Levels
            </TabsTrigger>
            <TabsTrigger value="cefr" className="flex items-center gap-1">
              <GraduationCap className="h-4 w-4" /> CEFR Levels
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Memorization Level Chart */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Memorization Levels</CardTitle>
                    <CardDescription>Distribution of words by memorization level</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={toggleChartType}>
                    {chartType === "bar" ? <PieChartIcon className="h-4 w-4" /> : <BarChart2 className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer
                    config={{
                      count: {
                        label: "Words",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === "bar" ? (
                        <BarChart data={memorizationChartData}>
                          <XAxis dataKey="level" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                            {memorizationChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      ) : (
                        <PieChart>
                          <Pie
                            data={memorizationChartData}
                            dataKey="count"
                            nameKey="level"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                          >
                            {memorizationChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Legend />
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      )}
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* CEFR Level Chart */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>CEFR Levels</CardTitle>
                    <CardDescription>Distribution of words by CEFR proficiency level</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={toggleChartType}>
                    {chartType === "bar" ? <PieChartIcon className="h-4 w-4" /> : <BarChart2 className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer
                    config={{
                      count: {
                        label: "Words",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === "bar" ? (
                        <BarChart data={cefrChartData}>
                          <XAxis dataKey="level" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                            {cefrChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      ) : (
                        <PieChart>
                          <Pie
                            data={cefrChartData}
                            dataKey="count"
                            nameKey="level"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                          >
                            {cefrChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Legend />
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      )}
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Words due for review */}
            <Card>
              <CardHeader>
                <CardTitle>Words Due for Review</CardTitle>
                <CardDescription>Review these words to improve your memorization level</CardDescription>
              </CardHeader>
              <CardContent>
                {wordsForReview > 0 ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">You have {wordsForReview} words due for review</p>
                      <Button size="sm" onClick={handleStartReview}>
                        Start Review <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No words due for review</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="memorization" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Memorization Levels</CardTitle>
                <CardDescription>Understanding the spaced repetition system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    Words are categorized into 5 memorization levels based on how well you know them. As you
                    successfully review words, they move up levels and are shown less frequently.
                  </p>

                  <div className="grid gap-2">
                    {Object.entries(memorizationLevelDescriptions).map(([level, description]) => (
                      <div key={level} className="flex items-center gap-2">
                        <Badge className={getMemorizationLevelClasses(Number.parseInt(level) as MemorizationLevel)}>
                          Level {level}
                        </Badge>
                        <span className="text-sm">{description}</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {memorizationLevelCounts[level] || 0} words
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Memorization Level Chart</CardTitle>
                <CardDescription>Visual distribution of your vocabulary by memorization level</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ChartContainer
                  config={{
                    count: {
                      label: "Words",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "bar" ? (
                      <BarChart data={memorizationChartData}>
                        <XAxis dataKey="level" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {memorizationChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    ) : (
                      <PieChart>
                        <Pie
                          data={memorizationChartData}
                          dataKey="count"
                          nameKey="level"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {memorizationChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Review Schedule</CardTitle>
                <CardDescription>How often words are reviewed based on memorization level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    The spaced repetition system schedules reviews based on your memorization level. Higher levels have
                    longer intervals between reviews.
                  </p>

                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getMemorizationLevelClasses(1)}>Level 1</Badge>
                      <span className="text-sm">Review every day</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getMemorizationLevelClasses(2)}>Level 2</Badge>
                      <span className="text-sm">Review every 3 days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getMemorizationLevelClasses(3)}>Level 3</Badge>
                      <span className="text-sm">Review every week</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getMemorizationLevelClasses(4)}>Level 4</Badge>
                      <span className="text-sm">Review every 2 weeks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getMemorizationLevelClasses(5)}>Level 5</Badge>
                      <span className="text-sm">Review every month</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button onClick={handleStartReview} disabled={wordsForReview === 0}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Start Review Session
                      {wordsForReview > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {wordsForReview}
                        </Badge>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cefr" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>CEFR Proficiency Levels</CardTitle>
                <CardDescription>Common European Framework of Reference for Languages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    The CEFR is an international standard for describing language ability. It describes language ability
                    on a six-point scale, from A1 for beginners, up to C2 for those who have mastered a language.
                  </p>

                  <div className="grid gap-2">
                    {Object.entries(cefrDescriptions).map(([level, description]) => (
                      <div key={level} className="flex items-center gap-2">
                        <Badge className={getCEFRLevelClasses(level as CEFRLevel)}>{level}</Badge>
                        <span className="text-sm">{description}</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {cefrLevelCounts[level] || 0} words
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CEFR Level Chart</CardTitle>
                <CardDescription>Visual distribution of your vocabulary by CEFR level</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ChartContainer
                  config={{
                    count: {
                      label: "Words",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "bar" ? (
                      <BarChart data={cefrChartData}>
                        <XAxis dataKey="level" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {cefrChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    ) : (
                      <PieChart>
                        <Pie
                          data={cefrChartData}
                          dataKey="count"
                          nameKey="level"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {cefrChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <AddWordDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
      </motion.div>
    </AnimatePresence>
  )
}
