"use client"

import { motion } from "framer-motion"
import { useVocabStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { apiGet } from "@/lib/api-client"
import { ENDPOINTS } from "@/lib/endpoint"

// Interface for memory level data from API
export interface MemoryLevelData {
  levelCounts: {
    [key: string]: number
  }
  cefrGroupCounts: {
    basic: number
    intermediate: number
    advanced: number
  }
  timeUntilNextReview: {
    hours: number
    minutes: number
    seconds: number
  }
  reviewWordCount: number
  cutoffTime: string
}

export function MemorizationLevelChart() {
  const [memoryLevelData, setMemoryLevelData] = useState<MemoryLevelData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch memory level data
  useEffect(() => {
    const fetchMemoryLevelData = async () => {
      try {
        setIsLoading(true)
        const data = await apiGet<MemoryLevelData>(ENDPOINTS.USER_WORDS.COUNT_ALL_WORDS_BY_LEVEL)
        setMemoryLevelData(data)
      } catch (error) {
        console.error("Failed to fetch memory level data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMemoryLevelData()
  }, [])

  // Define colors for each level
  const levelColors = {
    "1": "from-red-400 to-red-500",
    "2": "from-orange-400 to-orange-500",
    "3": "from-yellow-400 to-yellow-500",
    "4": "from-green-400 to-green-500",
    "5": "from-blue-400 to-blue-500",
  }

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
    
    console.log("Memory Level Data:", memoryLevelData)
    
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

    console.log("Processed level counts:", result)
    return result
  }

  const levelCounts = processLevelCounts()

  // Find the maximum count for scaling (minimum 1 to avoid division by zero)
  const maxCount = Math.max(...Object.values(levelCounts), 1)

  // Level descriptions
  const levelDescriptions = {
    "1": "Just started",
    "2": "Learning",
    "3": "Familiar",
    "4": "Well known",
    "5": "Mastered",
  }

  // Add fallback if no level counts are found
  const hasLevelCounts = Object.keys(levelCounts).length > 0
  console.log("Has level counts:", hasLevelCounts, "with counts:", levelCounts, "max:", maxCount)

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-none shadow-lg">
        <CardHeader className="pb-2 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 dark:from-purple-900/30 dark:to-indigo-900/30">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Brain className="h-5 w-5 text-purple-500 dark:text-purple-400" />
            Memorization Levels
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 flex items-center justify-center min-h-[250px]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
            <p className="text-sm text-muted-foreground">Loading memory levels...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardHeader className="pb-2 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 dark:from-purple-900/30 dark:to-indigo-900/30">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Brain className="h-5 w-5 text-purple-500 dark:text-purple-400" />
          Memorization Levels
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 relative">
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-purple-50/50 to-indigo-50/50 dark:from-purple-950/30 dark:to-indigo-950/30 z-0"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "mirror",
          }}
        />

        <div className="relative z-10">
          <div className="h-52 flex items-end justify-between gap-3 px-2 mb-4">
            {Object.entries(levelCounts).map(([level, count], i) => (
              <div key={level} className="flex flex-col items-center gap-1 flex-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ 
                    // Ensure minimum height of 20px for visibility and calculate percentage
                    height: count > 0 ? `${Math.max(20, (count / maxCount) * 150)}px` : "20px"
                  }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`w-full bg-gradient-to-t ${levelColors[level as keyof typeof levelColors]} ${count === 0 ? "opacity-30" : ""} rounded-t-sm relative group`}
                >
                  {/* Count displayed on top of the bar */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold">
                    {count}
                  </div>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {count} words
                  </div>
                </motion.div>
                <span className="text-sm font-medium mt-2">Level {level}</span>
                <span className="text-xs text-muted-foreground">
                  {levelDescriptions[level as keyof typeof levelDescriptions]}
                </span>
              </div>
            ))}
          </div>

          {memoryLevelData && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Basic</p>
                <p className="text-lg font-bold">{memoryLevelData.cefrGroupCounts.basic}</p>
              </div>
              <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Intermediate</p>
                <p className="text-lg font-bold">{memoryLevelData.cefrGroupCounts.intermediate}</p>
              </div>
              <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Advanced</p>
                <p className="text-lg font-bold">{memoryLevelData.cefrGroupCounts.advanced}</p>
              </div>
            </div>
          )}

          <div className="text-sm text-center text-muted-foreground mt-4">
            <p>Track your vocabulary memorization progress across all 5 levels</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
