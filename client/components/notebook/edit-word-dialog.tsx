"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useVocabStore } from "@/lib/store"
import type { NotebookEntry } from "@/data/types"
import { getWordTypeOptions } from "@/data/vocabulary"
import { useAudio } from "@/hooks/use-audio"
import { Sparkles, BookmarkCheck, Check } from "lucide-react"

interface EditWordDialogProps {
  entry: NotebookEntry
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditWordDialog({ entry, open, onOpenChange }: EditWordDialogProps) {
  const { updateNotebookEntry } = useVocabStore()
  const { playSound } = useAudio()
  const [formData, setFormData] = useState<Partial<NotebookEntry>>({
    word: entry.word,
    definition: entry.definition,
    definitionVi: entry.definitionVi,
    phonetic: entry.phonetic,
    example: entry.example,
    exampleVi: entry.exampleVi,
    wordType: entry.wordType,
    notes: entry.notes,
    cefr: entry.cefr || "A1",
    level: entry.level || 1,
  })
  const [relatedWordsInput, setRelatedWordsInput] = useState(entry.relatedWords?.join(", ") || "")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (value: string | number, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRelatedWordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRelatedWordsInput(e.target.value)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.word?.trim()) {
      newErrors.word = "Word is required"
    }

    if (!formData.definition?.trim()) {
      newErrors.definition = "Definition is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    playSound("click")

    // Process related words
    const relatedWords = relatedWordsInput
      .split(",")
      .map((word) => word.trim())
      .filter((word) => word.length > 0)

    // Create updated entry
    const updatedEntry: Partial<NotebookEntry> = {
      ...formData,
      relatedWords,
    }

    // Update the entry in the notebook
    updateNotebookEntry(entry.id, updatedEntry)

    // Show success animation
    setShowSuccess(true)
    playSound("correct")

    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(false)
      onOpenChange(false)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookmarkCheck className="h-5 w-5 text-green-500" />
            Edit Word
          </DialogTitle>
          <DialogDescription>Edit the details of "{entry.word}" in your vocabulary notebook.</DialogDescription>
        </DialogHeader>

        {showSuccess ? (
          <motion.div
            className="py-12 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4"
            >
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2">Word Updated!</h3>
            <p className="text-center text-muted-foreground">"{formData.word}" has been updated in your notebook</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="word" className="required">
                  Word
                </Label>
                <Input
                  id="word"
                  name="word"
                  value={formData.word}
                  onChange={handleChange}
                  className={errors.word ? "border-destructive" : ""}
                />
                {errors.word && <p className="text-xs text-destructive">{errors.word}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phonetic">Phonetic</Label>
                <Input
                  id="phonetic"
                  name="phonetic"
                  value={formData.phonetic}
                  onChange={handleChange}
                  placeholder="/fəˈnetɪk/"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="definition" className="required">
                Definition
              </Label>
              <Textarea
                id="definition"
                name="definition"
                value={formData.definition}
                onChange={handleChange}
                className={errors.definition ? "border-destructive" : ""}
              />
              {errors.definition && <p className="text-xs text-destructive">{errors.definition}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="definitionVi">Definition (Vietnamese)</Label>
              <Textarea id="definitionVi" name="definitionVi" value={formData.definitionVi} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="example">Example</Label>
                <Textarea
                  id="example"
                  name="example"
                  value={formData.example}
                  onChange={handleChange}
                  placeholder="Use the word in a sentence"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exampleVi">Example (Vietnamese)</Label>
                <Textarea id="exampleVi" name="exampleVi" value={formData.exampleVi} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wordType">Word Type</Label>
                <Select
                  value={formData.wordType as string}
                  onValueChange={(value) => handleSelectChange(value, "wordType")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select word type" />
                  </SelectTrigger>
                  <SelectContent>
                    {getWordTypeOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cefr">CEFR Level</Label>
                <Select value={formData.cefr as string} onValueChange={(value) => handleSelectChange(value, "cefr")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select CEFR level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A1">A1 - Beginner</SelectItem>
                    <SelectItem value="A2">A2 - Elementary</SelectItem>
                    <SelectItem value="B1">B1 - Intermediate</SelectItem>
                    <SelectItem value="B2">B2 - Upper Intermediate</SelectItem>
                    <SelectItem value="C1">C1 - Advanced</SelectItem>
                    <SelectItem value="C2">C2 - Mastery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="relatedWords">Related Words</Label>
                <Input
                  id="relatedWords"
                  name="relatedWords"
                  value={relatedWordsInput}
                  onChange={handleRelatedWordsChange}
                  placeholder="word1, word2, word3"
                />
                <p className="text-xs text-muted-foreground">Separate words with commas</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Memorization Level</Label>
                <Select
                  value={formData.level?.toString() || "1"}
                  onValueChange={(value) => handleSelectChange(Number.parseInt(value), "level")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select memorization level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Level 1 - Just learned</SelectItem>
                    <SelectItem value="2">Level 2 - Recognizing</SelectItem>
                    <SelectItem value="3">Level 3 - Familiar</SelectItem>
                    <SelectItem value="4">Level 4 - Well-known</SelectItem>
                    <SelectItem value="5">Level 5 - Mastered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any additional notes about this word"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="mr-2"
                  >
                    <Sparkles className="h-4 w-4" />
                  </motion.div>
                ) : null}
                {isSubmitting ? "Updating..." : "Update Word"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
