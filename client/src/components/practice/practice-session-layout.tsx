"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useVocabStore } from "@/lib/store"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { ThemeChangeProvider } from "@/components/theme-provider"
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

type PracticeSessionLayoutProps = {
  children: React.ReactNode
}

export function PracticeSessionLayout({ children }: PracticeSessionLayoutProps) {
  const router = useRouter()
  const { currentPracticeSession, resetPracticeSession } = useVocabStore()
  const [mounted, setMounted] = useState(false)
  const [exitDialogOpen, setExitDialogOpen] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect if no active session
  useEffect(() => {
    if (mounted && !currentPracticeSession) {
      router.push("/practice")
    }
  }, [mounted, currentPracticeSession, router])

  const handleExitPractice = () => {
    setExitDialogOpen(true)
  }

  const confirmExit = () => {
    // Cancel any ongoing speech
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }

    resetPracticeSession()
    router.push("/practice")
  }

  if (!mounted || !currentPracticeSession) return null

  return (
    <ThemeChangeProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <header className="h-16 border-b flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Practice Session</h2>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleExitPractice} aria-label="Exit practice">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </header>
        <motion.main
          className="flex-1 overflow-auto p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.main>
      </div>

      <AlertDialog open={exitDialogOpen} onOpenChange={setExitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Practice Session?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress in this session will be lost. Are you sure you want to exit?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmExit}>Exit Practice</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ThemeChangeProvider>
  )
}

