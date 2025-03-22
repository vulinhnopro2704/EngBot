"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useVocabStore } from "@/lib/store"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { ThemeChangeProvider } from "@/components/theme-provider"

type FullScreenLayoutProps = {
  children: React.ReactNode
}

export function FullScreenLayout({ children }: FullScreenLayoutProps) {
  const router = useRouter()
  const { courseId } = useVocabStore()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleBack = () => {
    if (courseId) {
      router.push(`/courses/${courseId}`)
    } else {
      router.push("/courses")
    }
  }

  if (!mounted) return null

  return (
    <ThemeChangeProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <header className="h-16 border-b flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleBack} aria-label="Go back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-semibold">VocabMaster</h2>
          </div>
          <div>
            <ThemeToggle />
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
    </ThemeChangeProvider>
  )
}

