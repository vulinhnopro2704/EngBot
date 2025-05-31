"use client"

import { motion } from "framer-motion"
import { Search, BookOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface NotebookEmptyStateProps {
  searchQuery: string
  setIsAddDialogOpen: (open: boolean) => void
}

export function NotebookEmptyState({ searchQuery, setIsAddDialogOpen }: NotebookEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="border-dashed">
        <CardContent className="p-8 md:p-12 flex flex-col items-center justify-center text-center">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
            className="mb-4"
          >
            {searchQuery ? (
              <Search className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground" />
            ) : (
              <BookOpen className="h-12 w-12 md:h-16 md:w-16 text-green-500" />
            )}
          </motion.div>

          <h3 className="text-lg md:text-xl font-medium mb-2">No words found</h3>
          <p className="text-muted-foreground mb-6 max-w-md md:text-lg">
            {searchQuery
              ? "No words match your search criteria"
              : "Your notebook is empty. Add words from lessons or manually"}
          </p>

          {!searchQuery && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md px-6 py-2 h-11 md:h-12 md:text-lg"
              >
                Add Your First Word
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
