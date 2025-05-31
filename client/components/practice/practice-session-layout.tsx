"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { CircleX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAudio } from "@/hooks/use-audio"
import { usePracticeStore } from "@/lib/practice-store"

type PracticeSessionLayoutProps = {
  children: React.ReactNode
}

export function PracticeSessionLayout({ children }: PracticeSessionLayoutProps) {
  const router = useRouter()
  const { currentSession, endSession } = usePracticeStore()
  const { playAudio } = useAudio()
  const [showExitPrompt, setShowExitPrompt] = useState(false)

  // Handle back button and beforeunload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentSession) {
        // Modern browsers ignore this message but require us to set returnValue
        const message = "You have an active practice session. Are you sure you want to leave?"
        e.returnValue = message
        return message
      }
    }

    // Handle back button
    const handlePopState = (event: PopStateEvent) => {
      if (currentSession) {
        event.preventDefault()
        setShowExitPrompt(true)
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("popstate", handlePopState)
    }
  }, [currentSession])

  const handleExitPractice = () => {
    playAudio("/sounds/click.mp3")
    if (currentSession) {
      endSession()
    }
    router.push("/practice")
  }

  const handleContinuePractice = () => {
    playAudio("/sounds/click.mp3")
    setShowExitPrompt(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-indigo-950/30">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="relative z-10">
          <div className="w-full h-full">
            {/* Exit button */}
            <div className="flex justify-end mb-4">
              <Button variant="outline" size="icon" onClick={() => setShowExitPrompt(true)} aria-label="Exit practice">
                <CircleX className="h-4 w-4" />
              </Button>
            </div>

            {/* Animated background circles for visual interest */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-primary/5"
                  initial={{
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`,
                    scale: Math.random() * 0.5 + 0.5,
                  }}
                  animate={{
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`,
                    transition: {
                      duration: Math.random() * 20 + 15,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    },
                  }}
                  style={{
                    width: `${100 + Math.random() * 200}px`,
                    height: `${100 + Math.random() * 200}px`,
                    opacity: 0.3 + Math.random() * 0.2,
                  }}
                />
              ))}
            </div>

            {/* Main content */}
            {children}
          </div>
        </div>
      </div>

      {/* Exit confirmation dialog */}
      <AnimatePresence>
        {showExitPrompt && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3 className="text-lg font-semibold mb-2">Exit Practice?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your practice progress will be saved, but this session will end. Are you sure you want to exit?
              </p>
              <div className="flex gap-4">
                <Button variant="outline" onClick={handleContinuePractice} className="flex-1">
                  Continue Practice
                </Button>
                <Button variant="destructive" onClick={handleExitPractice} className="flex-1">
                  Exit
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
