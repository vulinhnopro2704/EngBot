"use client"

import { motion } from "framer-motion"
import { Book, Plus, Sparkles, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface NotebookHeaderProps {
  setIsAddDialogOpen: (open: boolean) => void
  setIsResetDialogOpen: (open: boolean) => void
}

export function NotebookHeader({ setIsAddDialogOpen, setIsResetDialogOpen }: NotebookHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <motion.div
        className="flex flex-col gap-1"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Book className="h-6 w-6 md:h-7 md:w-7 text-green-500" />
          <span>Vocabulary Notebook</span>
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              repeatDelay: 5,
            }}
          >
            <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-yellow-500 ml-2" />
          </motion.div>
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">Store, organize, and review your vocabulary words</p>
      </motion.div>

      <div className="flex gap-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md px-4 py-2 h-10 md:h-11 md:text-base"
          >
            <Plus className="h-4 w-4 md:h-5 md:w-5" /> Add Word
          </Button>
        </motion.div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 h-10 md:h-11 md:text-base">
              <Trash className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Notebook</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete all words in your notebook. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => setIsResetDialogOpen(true)} className="bg-red-500 hover:bg-red-600">
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
