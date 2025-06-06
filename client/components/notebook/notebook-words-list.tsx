"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LearnedWord, LearnedWordsPaginationResponse } from "@/types/notebook"
import { apiGet } from "@/lib/api-client"
import { ENDPOINTS } from "@/lib/endpoint"
import { Loader2, Search, Volume2, BookOpenCheck, Brain, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { useAudio } from "@/hooks/use-audio"
import { getCEFRLevelClasses, getMemorizationLevelClasses } from "@/lib/vocabulary-utils"

// Declare the responsiveVoice type for the window object
declare global {
  interface Window {
    responsiveVoice: {
      speak: (text: string, voice: string, options?: any) => void;
    }
  }
}

export function NotebookWordsList() {
  // State for the word data
  const [wordsList, setWordsList] = useState<LearnedWord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [totalWords, setTotalWords] = useState(0)
  const [levelCounts, setLevelCounts] = useState<Record<string, number>>({})
  const [pageSize] = useState(10) // Words per page
  
  const observer = useRef<IntersectionObserver | null>(null)
  const { playAudio } = useAudio()

  // Ref for the last element in the list (for infinite scrolling)
  const lastWordElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingMore) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreWords()
        }
      })

      if (node) observer.current.observe(node)
    },
    [isLoadingMore, hasMore]
  )

  // Function to fetch words with the given parameters
  const fetchWords = async (pageNum: number, level: string, reset: boolean = false) => {
    try {
      if (reset) {
        setIsLoading(true)
      } else {
        setIsLoadingMore(true)
      }

      // Build the API URL with query parameters
      let url = `${ENDPOINTS.USER_WORDS.LEARNED_WORDS_PAGINATION}?page=${pageNum}&page_size=${pageSize}`
      if (level !== "all") {
        url += `&level=${level}`
      }

      const data = await apiGet<LearnedWordsPaginationResponse>(url)
        if (!data) {
            throw new Error("Failed to fetch words")
        }
        console.log("Fetched words:", data)
      
      // Update state based on the response
      if (reset) {
        setWordsList(data.results ?? [])
      } else {
        setWordsList((prev) => [...prev, ...data.results ?? []])
      }

      setTotalWords(data.count)
      setHasMore(data.next !== null)
      
      // Calculate level counts by analyzing the data
      if (reset) {
        const newLevelCounts: Record<string, number> = {}
        
        // For the initial load, we can roughly estimate counts based on the total count
        // A more accurate count would require additional API calls or server-side support
        if (level === "all") {
          // Just store the total count for now
          newLevelCounts.total = data.count
        } else {
          // If a specific level is selected, we know the count for that level
          newLevelCounts[level] = data.count
        }
        
        setLevelCounts(newLevelCounts)
      }
      
      return data
    } catch (error) {
      console.error("Failed to fetch vocabulary data:", error)
      return null
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  // Fetch initial data
  useEffect(() => {
    fetchWords(1, selectedLevel, true)
  }, [])

  // Function to load more words (for infinite scrolling)
  const loadMoreWords = async () => {
    if (isLoadingMore || !hasMore) return
    await fetchWords(page + 1, selectedLevel)
    setPage(prev => prev + 1)
  }

  // Handle level change
  const handleLevelChange = async (level: string) => {
    setSelectedLevel(level)
    setPage(1)
    await fetchWords(1, level, true)
  }

  // Handle refresh button
  const handleRefresh = async () => {
    setPage(1)
    await fetchWords(1, selectedLevel, true)
  }

  // Filter words by search term
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Filter the words list based on search term (client-side filtering)
  const filteredWords = wordsList?.filter((word) => 
    word.word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.word.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Play word pronunciation
  const handlePlayPronunciation = (word: LearnedWord) => {
    if (word.word.audio) {
      playAudio(word.word.audio)
    } else if (typeof window !== 'undefined' && window.responsiveVoice) {
      // Use ResponsiveVoice for more reliable TTS
      window.responsiveVoice.speak(word.word.word, "UK English Female", {
        pitch: 1,
        rate: 0.8,
        volume: 1
      })
    } else {
      // Fallback to browser's SpeechSynthesis
      const utterance = new SpeechSynthesisUtterance(word.word.word)
      utterance.lang = 'en-US'
      speechSynthesis.speak(utterance)
    }
  }

  // Format the next review date
  const formatNextReview = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading vocabulary words...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1">
          <Label htmlFor="search">Search Words</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by word or meaning..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="w-full sm:w-48">
          <Label htmlFor="level">Filter by Level</Label>
          <Select value={selectedLevel} onValueChange={handleLevelChange}>
            <SelectTrigger id="level">
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels ({totalWords})</SelectItem>
              <SelectItem value="1">Level 1</SelectItem>
              <SelectItem value="2">Level 2</SelectItem>
              <SelectItem value="3">Level 3</SelectItem>
              <SelectItem value="4">Level 4</SelectItem>
              <SelectItem value="5">Level 5</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-auto self-end">
          <Button variant="outline" onClick={handleRefresh} className="w-full h-10">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Results summary */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            Showing {filteredWords.length} of {totalWords} total words
            {selectedLevel !== "all" && ` (Level ${selectedLevel})`}
          </p>
        </div>
      </div>

      {/* Words list */}
      <div className="space-y-4">
        {filteredWords.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpenCheck className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No Words Found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try a different search term" : "You haven't added any words at this level yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredWords.map((word, index) => {
            // Check if this is the last element
            const isLastElement = index === filteredWords.length - 1

            return (
              <motion.div
                key={word.id}
                ref={isLastElement ? lastWordElementRef : null}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-900/30 dark:to-emerald-900/30 py-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {word.word.word}
                        {word.word.pronunciation && (
                          <span className="text-sm text-muted-foreground font-normal">
                            {word.word.pronunciation}
                          </span>
                        )}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getCEFRLevelClasses(word.word.cefr as any)}>
                          {word.word.cefr}
                        </Badge>
                        <Badge className={getMemorizationLevelClasses(word.level as any)}>
                          Level {word.level}
                        </Badge>
                        <Button variant="ghost" size="icon" onClick={() => handlePlayPronunciation(word)}>
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Meaning</h4>
                        <p>{word.word.meaning}</p>
                        
                        {word.word.pos && (
                          <Badge variant="outline" className="mt-2">
                            {word.word.pos}
                          </Badge>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Example</h4>
                        <p className="italic">"{word.word.example}"</p>
                        {word.word.exampleVi && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {word.word.exampleVi}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Brain className="h-4 w-4" />
                        <span>Learned: {new Date(word.learnedAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="font-normal">
                          Streak: {word.streak}
                        </Badge>
                      </div>
                      
                      <div>
                        Next review: {formatNextReview(word.nextReview)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })
        )}

        {/* Loading more indicator */}
        {isLoadingMore && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2">Loading more words...</span>
          </div>
        )}
        
        {/* End of list message */}
        {!hasMore && filteredWords.length > 0 && (
          <p className="text-center text-muted-foreground py-4">
            You've reached the end of your vocabulary list
          </p>
        )}
      </div>
    </div>
  )
}
