"use client"

import { motion } from "framer-motion"
import { Shuffle, Layers, Clock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePracticeSession } from "@/lib/hooks/use-practice-session"
import { MascotEncouragement } from "@/components/practice/ui/mascot-encouragement"
import { LoadingPracticeOptions } from "@/components/practice/ui/loading-practice-options"
import { MixedPracticeTab } from "@/components/practice/tabs/mixed-practice-tab"
import { PracticeModesTab } from "@/components/practice/tabs/practice-modes-tab"
import { SpacedRepetitionTab } from "@/components/practice/tabs/spaced-repetition-tab"

export default function PracticeModesSection() {
  const {
    isLoading,
    animalType,
    showMascot,
    selectedQuestionCount,
    setSelectedQuestionCount,
    handleStartPractice,
  } = usePracticeSession()

  if (isLoading) {
    return <LoadingPracticeOptions animalType={animalType} />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 max-w-[1600px] mx-auto w-full"
    >
      <Tabs defaultValue="quick" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 h-11 md:h-12">
          <TabsTrigger
            value="quick"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white md:text-base"
          >
            <Shuffle className="h-4 w-4 md:h-5 md:w-5" /> Mixed Practice
          </TabsTrigger>
          <TabsTrigger
            value="modes"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white md:text-base"
          >
            <Layers className="h-4 w-4 md:h-5 md:w-5" /> Practice Modes
          </TabsTrigger>
          <TabsTrigger
            value="spaced"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white md:text-base"
          >
            <Clock className="h-4 w-4 md:h-5 md:w-5" /> Spaced Repetition
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quick">
          <MixedPracticeTab
            selectedQuestionCount={selectedQuestionCount}
            setSelectedQuestionCount={setSelectedQuestionCount}
            handleStartPractice={handleStartPractice}
          />
        </TabsContent>

        <TabsContent value="modes">
          <PracticeModesTab handleStartPractice={handleStartPractice} />
        </TabsContent>

        <TabsContent value="spaced">
          <SpacedRepetitionTab handleStartPractice={handleStartPractice} />
        </TabsContent>
      </Tabs>

      {/* Mascot encouragement */}
      {showMascot && (
        <MascotEncouragement
          message="Ready to practice? Choose a mode to get started!"
          mood="excited"
          duration={5000}
          position="bottom-right"
        />
      )}
    </motion.div>
  )
}
