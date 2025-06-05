import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePracticeStore } from "@/lib/practice-store"
import type { PracticeMode } from "@/data/types"

export function usePracticeSession() {
  const router = useRouter()
  const { startSession } = usePracticeStore()
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number>(10)
  const [isLoading, setIsLoading] = useState(true)
  const [animalType, setAnimalType] = useState<"cat" | "quokka" | "hamster" | "capybara">("hamster")
  const [showMascot, setShowMascot] = useState(false)

  // Simulate loading state
  useEffect(() => {
    // Randomly select an animal for loading animation
    const animals = ["cat", "quokka", "hamster", "capybara"] as const
    setAnimalType(animals[Math.floor(Math.random() * animals.length)])

    const timer = setTimeout(() => {
      setIsLoading(false)

      // Show mascot after loading
      setTimeout(() => {
        setShowMascot(true)
      }, 500)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleStartPractice = (mode: PracticeMode) => {
    if (mode === "mixed") {
      startSession(mode, selectedQuestionCount)
    }
    else {
      startSession(mode)
    }
    router.push("/practice/session")
  }

  return {
    selectedQuestionCount,
    setSelectedQuestionCount,
    isLoading,
    animalType,
    showMascot,
    handleStartPractice
  }
}
