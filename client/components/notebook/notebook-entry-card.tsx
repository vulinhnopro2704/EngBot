"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Edit, Volume2, Trash, ExternalLink, Brain } from "lucide-react"
import { EditWordDialog } from "@/components/notebook/edit-word-dialog"
import { useVocabStore } from "@/lib/store"
import { useAudio } from "@/hooks/use-audio"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { NotebookEntry, MemorizationLevel } from "@/data/types"
import {
  getWordTypeColor,
  getCEFRLevelClasses,
  getMemorizationLevelClasses,
  formatDate,
  getReviewStatusText,
} from "@/lib/vocabulary-utils"

interface NotebookEntryCardProps {
  entry: NotebookEntry
  onToggleFavorite: () => void
}

export function NotebookEntryCard({ entry, onToggleFavorite }: NotebookEntryCardProps) {
  // Add error handling for missing properties
  if (!entry || !entry.id) {
    console.error("Invalid entry passed to NotebookEntryCard:", entry)
    return null
  }

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const { removeFromNotebook, updateMemorizationLevel } = useVocabStore()
  const { playAudio, speakWord } = useAudio()

  const handleDelete = () => {
    removeFromNotebook(entry.id)
    setIsDeleteDialogOpen(false)
  }

  const handlePlayPronunciation = () => {
    if (entry.phonetic) {
      playAudio(entry.phonetic)
    } else {
      speakWord(entry.word)
    }
  }

  const handleLevelChange = (newLevel: MemorizationLevel) => {
    updateMemorizationLevel(entry.id, newLevel)
  }

  return (
    <>
      <motion.div
        className="h-full perspective-1000"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div
          className="relative w-full h-full transition-all duration-500 preserve-3d cursor-pointer"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front of card */}
          <Card className="absolute w-full h-full backface-hidden border-2 hover:border-green-300 dark:hover:border-green-700 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2 flex flex-row justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-xl font-bold">{entry.word}</h3>
                <div className="flex flex-wrap gap-1">
                  {entry.wordType && <Badge className={getWordTypeColor(entry.wordType)}>{entry.wordType}</Badge>}
                  {entry.cefr && <Badge className={getCEFRLevelClasses(entry.cefr)}>{entry.cefr}</Badge>}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFavorite()
                }}
                className="text-gray-400 hover:text-yellow-500 focus:outline-none"
                aria-label={entry.isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Star className={`h-6 w-6 ${entry.isFavorite ? "fill-yellow-500 text-yellow-500" : "fill-none"}`} />
              </motion.button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-3">{entry.definition}</p>

              {entry.level && (
                <div className="mt-2 flex items-center gap-1">
                  <Brain className="h-4 w-4 text-muted-foreground" />
                  <Badge className={getMemorizationLevelClasses(entry.level)}>Level {entry.level}</Badge>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePlayPronunciation()
                  }}
                  title="Listen to pronunciation"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsEditDialogOpen(true)
                  }}
                  title="Edit word"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(`https://www.google.com/search?q=define+${entry.word}`, "_blank")
                }}
              >
                <ExternalLink className="h-3 w-3 mr-1" /> Look up
              </Button>
            </CardFooter>
          </Card>

          {/* Back of card */}
          <Card className="absolute w-full h-full backface-hidden rotateY-180 border-2 hover:border-green-300 dark:hover:border-green-700 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">{entry.word}</h3>
                <div className="flex gap-1">
                  {entry.cefr && <Badge className={getCEFRLevelClasses(entry.cefr)}>{entry.cefr}</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Definition:</p>
                <p>{entry.definition}</p>
              </div>
              {entry.example && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Example:</p>
                  <p className="italic">"{entry.example}"</p>
                </div>
              )}

              {/* Memorization level */}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Memorization Level:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <Badge
                      key={level}
                      className={`cursor-pointer ${
                        (entry.level || 1) === level
                          ? getMemorizationLevelClasses(level as MemorizationLevel)
                          : "bg-muted hover:bg-muted/80"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLevelChange(level as MemorizationLevel)
                      }}
                    >
                      {level}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Review status */}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Review Status:</p>
                <p>{getReviewStatusText(entry.nextReview)}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Added on:</p>
                <p>{formatDate(entry.dateAdded)}</p>
              </div>
              {entry.source && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Source:</p>
                  <p className="capitalize">{entry.source}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsDeleteDialogOpen(true)
                }}
              >
                <Trash className="h-4 w-4 mr-1" /> Delete
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsFlipped(false)
                }}
              >
                Back to front
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      <EditWordDialog entry={entry} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the word "{entry.word}" from your notebook.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
