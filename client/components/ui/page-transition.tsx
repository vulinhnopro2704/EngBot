"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { LoadingAnimals } from "@/components/ui/loading-animals"

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [animalType, setAnimalType] = useState<"cat" | "quokka" | "hamster" | "capybara">("cat")
  const [loadingText, setLoadingText] = useState("Loading...")

  // Only show loading on initial page load or deep navigation
  useEffect(() => {
    // Skip loading for main section navigation - handled by SectionTransition
    const isMainSection =
      pathname === "/" ||
      pathname === "/courses" ||
      pathname === "/practice" ||
      pathname === "/notebook" ||
      pathname === "/settings"

    if (isMainSection) {
      setIsLoading(false)
      return
    }

    // For deeper navigation paths, show loading
    const animals = ["cat", "quokka", "hamster", "capybara"] as const
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)]
    setAnimalType(randomAnimal)

    // Set loading text based on the page
    if (pathname.includes("/courses/")) {
      setLoadingText("Loading course details...")
    } else if (pathname.includes("/practice/session")) {
      setLoadingText("Preparing your practice session...")
    } else if (pathname.includes("/practice/results")) {
      setLoadingText("Calculating your results...")
    } else if (pathname.includes("/notebook/")) {
      setLoadingText("Fetching your notes...")
    } else {
      setLoadingText("Loading...")
    }

    // Simulate loading
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50"
        >
          <LoadingAnimals
            type={animalType}
            text={loadingText}
            size="lg"
            color={
              pathname.includes("/courses")
                ? "blue"
                : pathname.includes("/practice")
                  ? "purple"
                  : pathname.includes("/notebook")
                    ? "green"
                    : pathname.includes("/settings")
                      ? "orange"
                      : "primary"
            }
          />
        </motion.div>
      ) : (
        <motion.div
          key="page-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
