"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import { LoadingAnimals } from "@/components/ui/loading-animals"

type SectionType = "courses" | "practice" | "notebook" | "settings" | "dashboard"
type TransitionContextType = {
  currentSection: SectionType
  previousSection: SectionType | null
  isTransitioning: boolean
  navigateTo: (section: SectionType) => void
}

const TransitionContext = createContext<TransitionContextType>({
  currentSection: "dashboard",
  previousSection: null,
  isTransitioning: false,
  navigateTo: () => {},
})

export const useTransition = () => useContext(TransitionContext)

interface SectionTransitionProviderProps {
  children: React.ReactNode
}

export function SectionTransitionProvider({ children }: SectionTransitionProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [currentSection, setCurrentSection] = useState<SectionType>("dashboard")
  const [previousSection, setPreviousSection] = useState<SectionType | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Determine current section based on pathname
  useEffect(() => {
    let section: SectionType = "dashboard"

    if (pathname === "/") {
      section = "dashboard"
    } else if (pathname.startsWith("/courses")) {
      section = "courses"
    } else if (pathname.startsWith("/practice")) {
      section = "practice"
    } else if (pathname.startsWith("/notebook")) {
      section = "notebook"
    } else if (pathname.startsWith("/settings")) {
      section = "settings"
    }

    setCurrentSection(section)
  }, [pathname])

  const navigateTo = (section: SectionType) => {
    if (section === currentSection) return

    setPreviousSection(currentSection)
    setIsTransitioning(true)

    // Short timeout to allow animation to start
    setTimeout(() => {
      const path = section === "dashboard" ? "/" : `/${section}`
      router.push(path)

      // Reset transition state after navigation completes
      setTimeout(() => {
        setIsTransitioning(false)
      }, 600) // Match this with animation duration
    }, 50)
  }

  return (
    <TransitionContext.Provider
      value={{
        currentSection,
        previousSection,
        isTransitioning,
        navigateTo,
      }}
    >
      {children}
    </TransitionContext.Provider>
  )
}

interface SectionTransitionProps {
  children: React.ReactNode
}

export function SectionTransition({ children }: SectionTransitionProps) {
  const { currentSection, previousSection, isTransitioning } = useTransition()
  const [showLoading, setShowLoading] = useState(false)
  const [animalType, setAnimalType] = useState<"cat" | "quokka" | "hamster" | "capybara">("cat")

  // Determine transition direction based on section order
  const getDirection = () => {
    const sectionOrder: SectionType[] = ["dashboard", "courses", "practice", "notebook", "settings"]

    if (!previousSection) return "forward"

    const currentIndex = sectionOrder.indexOf(currentSection)
    const previousIndex = sectionOrder.indexOf(previousSection)

    return currentIndex > previousIndex ? "forward" : "backward"
  }

  // Show loading indicator for longer transitions
  useEffect(() => {
    if (isTransitioning) {
      // Only show loading for certain transitions that might take longer
      const shouldShowLoading =
        (previousSection === "dashboard" && currentSection === "courses") ||
        (previousSection === "courses" && currentSection === "practice")

      if (shouldShowLoading) {
        const timer = setTimeout(() => {
          setShowLoading(true)

          // Randomly select an animal
          const animals = ["cat", "quokka", "hamster", "capybara"] as const
          setAnimalType(animals[Math.floor(Math.random() * animals.length)])
        }, 200)

        return () => clearTimeout(timer)
      }
    } else {
      setShowLoading(false)
    }
  }, [isTransitioning, previousSection, currentSection])

  // Get section-specific colors
  const getSectionColor = (section: SectionType): string => {
    switch (section) {
      case "dashboard":
        return "primary"
      case "courses":
        return "blue"
      case "practice":
        return "purple"
      case "notebook":
        return "green"
      case "settings":
        return "orange"
    }
  }

  // Get section-specific loading text
  const getLoadingText = (section: SectionType): string => {
    switch (section) {
      case "dashboard":
        return "Loading dashboard..."
      case "courses":
        return "Preparing your courses..."
      case "practice":
        return "Setting up practice..."
      case "notebook":
        return "Opening your notebook..."
      case "settings":
        return "Loading settings..."
    }
  }

  // Animation variants based on direction
  const direction = getDirection()
  const variants = {
    initial: {
      opacity: 0,
      x: direction === "forward" ? 100 : -100,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      x: direction === "forward" ? -100 : 100,
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        {showLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50"
          >
            <LoadingAnimals
              type={animalType}
              text={getLoadingText(currentSection)}
              size="md"
              color={getSectionColor(currentSection)}
            />
          </motion.div>
        ) : (
          <motion.div
            key={currentSection}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            className="w-full"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
