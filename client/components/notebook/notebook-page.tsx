"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useVocabStore } from "@/lib/store"
import { NotebookEntryCard } from "@/components/notebook/notebook-entry-card"
import { AddWordDialog } from "@/components/notebook/add-word-dialog"
import { LoadingAnimals } from "@/components/ui/loading-animals"
import { NotebookDashboard } from "@/components/notebook/notebook-dashboard"
import { NotebookStats } from "@/components/notebook/ui/notebook-stats"
import { NotebookFilters } from "@/components/notebook/ui/notebook-filters"
import { NotebookEmptyState } from "@/components/notebook/ui/notebook-empty-state"
import { NotebookHeader } from "@/components/notebook/ui/notebook-header"
import { NotebookTabs } from "@/components/notebook/ui/notebook-tabs"
import type { WordType, CEFRLevel, MemorizationLevel } from "@/types/vocabulary"

export function NotebookPage() {
  const { notebookEntries, toggleFavorite, _debug_clearNotebook, getWordsForReview } = useVocabStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterType, setFilterType] = useState<WordType | "all">("all")
  const [filterCEFR, setFilterCEFR] = useState<CEFRLevel | "all">("all")
  const [filterLevel, setFilterLevel] = useState<MemorizationLevel | "all">("all")
  const [isLoading, setIsLoading] = useState(true)
  const [animalType, setAnimalType] = useState<"cat" | "quokka" | "hamster" | "capybara">("cat")
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)

  // Simulate loading state
  useEffect(() => {
    // Randomly select an animal for loading animation
    const animals = ["cat", "quokka", "hamster", "capybara"] as const
    setAnimalType(animals[Math.floor(Math.random() * animals.length)])

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Helper function to safely parse dates
  const safelyParseDate = (dateValue: Date | string | undefined): Date => {
    if (!dateValue) return new Date(0)
    if (dateValue instanceof Date) return dateValue
    try {
      return new Date(dateValue)
    } catch (e) {
      console.error("Error parsing date:", e)
      return new Date(0)
    }
  }

  // Filter entries based on search query, tab, and filters
  const filteredEntries = notebookEntries.filter((entry) => {
    // Ensure entry has required properties
    if (!entry || typeof entry.word !== "string" || typeof entry.definition !== "string") {
      console.warn("Invalid notebook entry found:", entry)
      return false
    }

    const matchesSearch =
      entry.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.definition.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === "all" || (entry.wordType && entry.wordType === filterType)

    const matchesCEFR = filterCEFR === "all" || (entry.cefr && entry.cefr === filterCEFR)

    const matchesLevel = filterLevel === "all" || (entry.level && entry.level === filterLevel)

    return matchesSearch && matchesType && matchesCEFR && matchesLevel
  })

  // Sort entries
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.word.localeCompare(b.word)
    } else {
      return safelyParseDate(b.dateAdded).getTime() - safelyParseDate(a.dateAdded).getTime()
    }
  })

  const handleToggleFavorite = (id: number) => {
    toggleFavorite(id)
  }

  const handleResetNotebook = () => {
    _debug_clearNotebook()
    setIsResetDialogOpen(false)
  }

  // Count entries by type
  const wordTypeCount: Record<string, number> = {}
  notebookEntries.forEach((entry) => {
    const type = entry.wordType || "unknown"
    wordTypeCount[type] = (wordTypeCount[type] || 0) + 1
  })

  // Count entries by CEFR level
  const cefrLevelCount: Record<string, number> = {}
  notebookEntries.forEach((entry) => {
    const cefr = entry.cefr || "unknown"
    cefrLevelCount[cefr] = (cefrLevelCount[cefr] || 0) + 1
  })

  // Count entries by memorization level
  const memorizationLevelCount: Record<string, number> = {}
  notebookEntries.forEach((entry) => {
    const level = entry.level?.toString() || "unknown"
    memorizationLevelCount[level] = (memorizationLevelCount[level] || 0) + 1
  })

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // Check if any filters are applied
  const hasActiveFilters =
    searchQuery !== "" || filterType !== "all" || filterCEFR !== "all" || filterLevel !== "all" || sortOrder !== "desc"

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setFilterType("all")
    setFilterCEFR("all")
    setFilterLevel("all")
    setSortOrder("desc")
  }

  // Get words due for review
  const wordsForReview = getWordsForReview().length

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <LoadingAnimals type={animalType} text="Loading your vocabulary notebook..." size="lg" color="green" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 max-w-[1600px] mx-auto w-full"
    >
      <div className="flex flex-col gap-4">
        <NotebookHeader setIsAddDialogOpen={setIsAddDialogOpen} setIsResetDialogOpen={setIsResetDialogOpen} />

        <NotebookTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          notebookEntries={notebookEntries}
          wordsForReview={wordsForReview}
        />

        <Tabs defaultValue={activeTab}>
          <TabsContent value="dashboard" className="mt-6">
            <NotebookDashboard />
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            <NotebookFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterType={filterType}
              setFilterType={setFilterType}
              filterCEFR={filterCEFR}
              setFilterCEFR={setFilterCEFR}
              filterLevel={filterLevel}
              setFilterLevel={setFilterLevel}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              wordTypeCount={wordTypeCount}
              cefrLevelCount={cefrLevelCount}
              memorizationLevelCount={memorizationLevelCount}
              totalEntries={notebookEntries.length}
              clearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />

            {sortedEntries.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
              >
                <AnimatePresence>
                  {sortedEntries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      variants={itemVariants}
                      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                      layout
                    >
                      <NotebookEntryCard entry={entry} onToggleFavorite={() => handleToggleFavorite(entry.id)} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <NotebookEmptyState searchQuery={searchQuery} setIsAddDialogOpen={setIsAddDialogOpen} />
            )}
          </TabsContent>

          <TabsContent value="review" className="mt-6">
            <div className="space-y-6">
              <NotebookStats notebookEntries={notebookEntries} wordsForReview={wordsForReview} />

              {/* Review content would go here */}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AddWordDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </motion.div>
  )
}
