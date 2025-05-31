"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Brain,
  BookOpen,
  Dumbbell,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  Shuffle,
  Headphones,
  PenTool,
  Layers,
  MoveHorizontalIcon as DragDropHorizontal,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePracticeStore } from "@/lib/practice-store"
import { LoadingAnimals } from "@/components/ui/loading-animals"
import { MascotEncouragement } from "@/components/practice/ui/mascot-encouragement"
import type { PracticeMode } from "@/data/types"

export function PracticeModesSection() {
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
    startSession(mode, selectedQuestionCount)
    router.push("/practice/session")
  }

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <LoadingAnimals type={animalType} text="Loading practice options..." size="lg" color="purple" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 max-w-[1600px] mx-auto w-full"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-1"
        >
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 md:h-7 md:w-7 text-purple-500" />
            <span>Practice Your Vocabulary</span>
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
          <p className="text-muted-foreground text-sm md:text-base">
            Reinforce your learning with different practice modes
          </p>
        </motion.div>
      </div>

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
          <div className="space-y-6">
            <Card className="border-none shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                  <Shuffle className="h-5 w-5 md:h-6 md:w-6 text-purple-500" /> Mixed Practice
                </CardTitle>
                <CardDescription className="text-base">
                  Practice with a mix of different question types for maximum learning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <p className="text-sm md:text-base font-medium">Number of questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {[5, 10, 15, 20].map((count) => (
                      <Button
                        key={count}
                        variant={selectedQuestionCount === count ? "default" : "outline"}
                        size="sm"
                        className="h-9 md:h-10 md:text-base"
                        onClick={() => setSelectedQuestionCount(count)}
                      >
                        {count}
                      </Button>
                    ))}
                  </div>
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-4 md:grid-cols-3"
                >
                  <motion.div variants={itemVariants}>
                    <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 h-full">
                      <CardContent className="p-4 md:p-6 flex flex-col items-center text-center">
                        <div className="p-3 md:p-4 rounded-full bg-blue-100 dark:bg-blue-900 mb-3">
                          <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-medium text-base md:text-lg mb-1">Multiple Choice</h3>
                        <p className="text-xs md:text-sm text-muted-foreground">Choose the correct definition</p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 h-full">
                      <CardContent className="p-4 md:p-6 flex flex-col items-center text-center">
                        <div className="p-3 md:p-4 rounded-full bg-green-100 dark:bg-green-900 mb-3">
                          <PenTool className="h-5 w-5 md:h-6 md:w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="font-medium text-base md:text-lg mb-1">Fill in the Blank</h3>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          Complete sentences with the right word
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800 h-full">
                      <CardContent className="p-4 md:p-6 flex flex-col items-center text-center">
                        <div className="p-3 md:p-4 rounded-full bg-purple-100 dark:bg-purple-900 mb-3">
                          <Headphones className="h-5 w-5 md:h-6 md:w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="font-medium text-base md:text-lg mb-1">Listening</h3>
                        <p className="text-xs md:text-sm text-muted-foreground">Type the word you hear</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => handleStartPractice("mixed")}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-md"
                    size="lg"
                  >
                    Start Mixed Practice <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="modes">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="h-full">
              <Card className="h-full border-none shadow-md overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                      <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <CardTitle className="text-lg md:text-xl mt-2">Multiple Choice</CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    Test your knowledge of word definitions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm md:text-base text-muted-foreground">
                    Choose the correct definition for each word from multiple options.
                  </p>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => handleStartPractice("multiple-choice")}
                      className="w-full h-10 md:h-11 md:text-base bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                    >
                      Start Multiple Choice <Zap className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="h-full">
              <Card className="h-full border-none shadow-md overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-green-500 to-teal-500" />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                      <PenTool className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <CardTitle className="text-lg md:text-xl mt-2">Fill in the Blank</CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    Complete sentences with the correct word
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm md:text-base text-muted-foreground">
                    Fill in missing words in sentences to practice using vocabulary in context.
                  </p>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => handleStartPractice("fill-blank")}
                      className="w-full h-10 md:h-11 md:text-base bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                    >
                      Start Fill in Blank <Zap className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="h-full">
              <Card className="h-full border-none shadow-md overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                      <Headphones className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <CardTitle className="text-lg md:text-xl mt-2">Listening Practice</CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    Improve your listening and spelling skills
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm md:text-base text-muted-foreground">
                    Listen to words and type what you hear to improve pronunciation recognition.
                  </p>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => handleStartPractice("listening")}
                      className="w-full h-10 md:h-11 md:text-base bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      Start Listening <Zap className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="h-full">
              <Card className="h-full border-none shadow-md overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900">
                      <Layers className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                  <CardTitle className="text-lg md:text-xl mt-2">Matching Pairs</CardTitle>
                  <CardDescription className="text-sm md:text-base">Match words with their definitions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm md:text-base text-muted-foreground">
                    Connect words with their correct meanings in this matching exercise.
                  </p>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => handleStartPractice("matching")}
                      className="w-full h-10 md:h-11 md:text-base bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    >
                      Start Matching <Zap className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="h-full">
              <Card className="h-full border-none shadow-md overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-rose-500 to-red-500" />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="p-3 rounded-lg bg-rose-100 dark:bg-rose-900">
                      <DragDropHorizontal className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                    </div>
                  </div>
                  <CardTitle className="text-lg md:text-xl mt-2">Drag & Drop</CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    Arrange words to form correct sentences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm md:text-base text-muted-foreground">
                    Drag and drop words to complete sentences and practice word order.
                  </p>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => handleStartPractice("drag-drop")}
                      className="w-full h-10 md:h-11 md:text-base bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600"
                    >
                      Start Drag & Drop <Zap className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="spaced">
          <Card className="border-none shadow-md overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                <Clock className="h-5 w-5 md:h-6 md:w-6 text-cyan-500" /> Spaced Repetition
              </CardTitle>
              <CardDescription className="text-base">
                Review words at optimal intervals for maximum retention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-cyan-50 dark:bg-cyan-950/30 p-4 rounded-lg border border-cyan-100 dark:border-cyan-900">
                <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-cyan-600" /> How Spaced Repetition Works
                </h3>
                <p className="text-sm text-muted-foreground">
                  Words are scheduled for review at scientifically-optimized intervals. Words you find difficult will
                  appear more frequently, while words you know well will appear less often.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                        <Dumbbell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="font-medium">Due for Review</h3>
                    </div>
                    <p className="text-3xl font-bold">12</p>
                    <p className="text-sm text-muted-foreground">Words ready to review today</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 border-purple-200 dark:border-purple-800">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
                        <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="font-medium">Coming Up</h3>
                    </div>
                    <p className="text-3xl font-bold">8</p>
                    <p className="text-sm text-muted-foreground">Words due in the next 3 days</p>
                  </CardContent>
                </Card>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => handleStartPractice("mixed")}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-md"
                  size="lg"
                >
                  Start Spaced Repetition <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </motion.div>
            </CardContent>
          </Card>
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
