"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, Volume2, Heart, Trophy, Lightbulb, Zap, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useProgress } from "@/hooks/use-progress"
import { useAudio } from "@/hooks/use-audio"
import confetti from "canvas-confetti"
import { Mascot } from "@/components/ui/mascot"
import { cn } from "@/lib/utils"
import type { Word } from "@/data/types"

type GamifiedReviewModuleProps = {
  words: Word[]
  onComplete: () => void
}

export function GamifiedReviewModule({ words, onComplete }: GamifiedReviewModuleProps) {
  const [reviewWords, setReviewWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showingAnswer, setShowingAnswer] = useState(false)
  const [streak, setStreak] = useState(0)
  const [hearts, setHearts] = useState(3)
  const [points, setPoints] = useState(0)
  const [showMascot, setShowMascot] = useState(false)
  const [mascotMessage, setMascotMessage] = useState("")
  const [mascotMood, setMascotMood] = useState<"happy" | "sad" | "excited" | "neutral">("neutral")
  const [reviewComplete, setReviewComplete] = useState(false)
  const [reviewStats, setReviewStats] = useState({
    total: 0,
    correct: 0,
    incorrect: 0,
  })
  const [showHint, setShowHint] = useState(false)
  const [hintUsed, setHintUsed] = useState(false)
  const [showEffect, setShowEffect] = useState<"correct" | "incorrect" | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const { recordActivity } = useProgress()
  const { playAudio, speakWord } = useAudio()

  // Initialize review session
  useEffect(() => {
    // Shuffle the words
    const shuffled = [...words].sort(() => Math.random() - 0.5)
    setReviewWords(shuffled)
    setReviewStats({
      total: shuffled.length,
      correct: 0,
      incorrect: 0,
    })
  }, [words])

  const currentWord = reviewWords[currentIndex]
  const progress = reviewWords.length > 0 ? (currentIndex / reviewWords.length) * 100 : 0

  // Play pronunciation when showing answer
  useEffect(() => {
    if (showingAnswer && currentWord) {
      handlePlayAudio()
    }
  }, [showingAnswer, currentWord])

  const handlePlayAudio = () => {
    if (currentWord) {
      if (currentWord.audio) {
        playAudio(currentWord.audio)
      } else {
        speakWord(currentWord.word)
      }
    }
  }

  const handleShowAnswer = () => {
    setShowingAnswer(true)
    playAudio("/sounds/reveal.mp3")
  }

  const handleResponse = (successful: boolean) => {
    if (!currentWord) return

    if (successful) {
      // Correct answer
      setShowEffect("correct")
      setReviewStats((prev) => ({
        ...prev,
        correct: prev.correct + 1,
      }))

      // Increase streak and points
      const newStreak = streak + 1
      setStreak(newStreak)

      // More points for higher streaks
      const streakBonus = Math.min(newStreak, 5)
      const pointsToAdd = 10 + streakBonus * 2
      setPoints(points + pointsToAdd)

      // Show mascot on streak milestones
      if (newStreak === 3) {
        setMascotMessage("Great streak! Keep it up!")
        setMascotMood("happy")
        setShowMascot(true)
        setTimeout(() => setShowMascot(false), 3000)
      } else if (newStreak === 5) {
        setMascotMessage("You're on fire! 🔥")
        setMascotMood("excited")
        setShowMascot(true)
        setTimeout(() => setShowMascot(false), 3000)

        // Trigger mini confetti for 5-streak
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect()
          confetti({
            particleCount: 30,
            spread: 50,
            origin: { x: rect.right / window.innerWidth, y: rect.top / window.innerHeight },
          })
        }
      }

      // Play success sound
      playAudio("/sounds/correct.mp3")
    } else {
      // Incorrect answer
      setShowEffect("incorrect")
      setReviewStats((prev) => ({
        ...prev,
        incorrect: prev.incorrect + 1,
      }))

      // Reset streak and lose a heart
      setStreak(0)
      setHearts((prev) => Math.max(0, prev - 1))

      // Show encouraging mascot
      setMascotMessage("Don't worry, you'll get it next time!")
      setMascotMood("sad")
      setShowMascot(true)
      setTimeout(() => setShowMascot(false), 3000)

      // Play incorrect sound
      playAudio("/sounds/incorrect.mp3")
    }

    // Wait for effect animation before moving to next
    setTimeout(() => {
      setShowEffect(null)
      moveToNext()
    }, 1000)
  }

  const moveToNext = () => {
    setShowingAnswer(false)
    setHintUsed(false)
    setShowHint(false)

    if (currentIndex < reviewWords.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      completeReview()
    }
  }

  const completeReview = () => {
    setReviewComplete(true)

    // Trigger celebration confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    // Play celebration sound
    playAudio("/sounds/celebration.mp3")

    // Show completion mascot
    setMascotMessage("Great job completing your review!")
    setMascotMood("excited")
    setShowMascot(true)
  }

  const handleShowHint = () => {
    setShowHint(true)
    setHintUsed(true)
    playAudio("/sounds/hint.mp3")
  }

  // Generate a hint (first letter + number of remaining letters)
  const generateHint = (word: string) => {
    if (!word) return ""
    return `${word[0]}${"_ ".repeat(word.length - 1)}`
  }

  const handleFinishReview = () => {
    // Make sure onComplete is a function before calling it
    if (typeof onComplete === "function") {
      onComplete()
    } else {
      console.warn("onComplete is not a function")
    }
  }

  // If no words to review
  if (reviewWords.length === 0) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-2xl font-bold">No Words to Review</h2>
            <p className="text-muted-foreground mt-2">You don't have any words due for review at this time</p>
          </motion.div>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button
            onClick={handleFinishReview}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
          >
            Return to Dashboard
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Review completed screen
  if (reviewComplete) {
    return (
      <Card className="w-full max-w-3xl mx-auto overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-blue-500" />
        <CardHeader className="text-center pt-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Review Completed!</h2>
            <p className="text-muted-foreground mt-2">You've reviewed {reviewStats.total} words</p>
          </motion.div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{reviewStats.correct}</p>
                    <p className="text-sm text-green-700 dark:text-green-300">Correct</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">{reviewStats.incorrect}</p>
                    <p className="text-sm text-red-700 dark:text-red-300">Incorrect</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{points}</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Points</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500" />
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-2">Performance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Accuracy</span>
                      <span className="font-medium">
                        {reviewStats.total > 0 ? Math.round((reviewStats.correct / reviewStats.total) * 100) : 0}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${
                            reviewStats.total > 0 ? Math.round((reviewStats.correct / reviewStats.total) * 100) : 0
                          }%`,
                        }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <span>Highest streak</span>
                    </div>
                    <span className="font-medium">{streak}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pb-8">
          <Button
            onClick={handleFinishReview}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 px-8"
            size="lg"
          >
            Continue Learning
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Main review interface
  return (
    <div className="space-y-6 relative" ref={containerRef}>
      {/* Stats bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={cn(
                  "h-5 w-5 transition-all",
                  i < hearts ? "text-red-500 fill-red-500 scale-100" : "text-gray-300 scale-90",
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">{points}</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {currentIndex + 1} of {reviewWords.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative">
        <Progress
          value={progress}
          className="h-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950"
        />
        <motion.div
          className="absolute top-0 left-0 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Streak indicator */}
      {streak > 0 && (
        <motion.div
          className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg shadow-md"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
        >
          <div className="flex items-center gap-1">
            <Zap className="h-4 w-4" />
            <span className="font-medium">{streak}</span>
          </div>
        </motion.div>
      )}

      {/* Main card */}
      <Card className="w-full max-w-3xl mx-auto overflow-hidden relative">
        {/* Decorative top bar */}
        <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

        {/* Effect overlays */}
        <AnimatePresence>
          {showEffect === "correct" && (
            <motion.div
              className="absolute inset-0 bg-green-500/20 z-10 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Check className="h-24 w-24 text-green-500" />
              </motion.div>
            </motion.div>
          )}

          {showEffect === "incorrect" && (
            <motion.div
              className="absolute inset-0 bg-red-500/20 z-10 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <X className="h-24 w-24 text-red-500" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {!showingAnswer ? (
              <motion.div
                key="question"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-medium text-muted-foreground">Do you know this word?</h3>
                  <motion.h2
                    className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600 dark:from-primary dark:to-indigo-400"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {currentWord?.word}
                  </motion.h2>

                  {currentWord?.pronunciation && <p className="text-muted-foreground">{currentWord.pronunciation}</p>}

                  {currentWord?.pos && (
                    <Badge variant="outline" className="mt-2 bg-primary/5">
                      {currentWord.pos}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col items-center gap-4">
                  <Button
                    onClick={handleShowAnswer}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 min-w-[200px]"
                  >
                    <Brain className="mr-2 h-5 w-5" />
                    Show Meaning
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShowHint}
                    className="text-muted-foreground hover:text-primary"
                    disabled={showHint}
                  >
                    <Lightbulb className="mr-1 h-4 w-4" />
                    Need a hint?
                  </Button>

                  <AnimatePresence>
                    {showHint && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-amber-50 dark:bg-amber-950/50 p-3 rounded-md border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"
                      >
                        <p className="text-sm">
                          <span className="font-medium">Hint:</span> {generateHint(currentWord?.meaning || "")}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="answer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{currentWord?.word}</h2>
                    <p className="text-sm text-muted-foreground">{currentWord?.pronunciation}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handlePlayAudio}>
                    <Volume2 className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Meaning:</h3>
                    <p className="text-lg">{currentWord?.meaning}</p>
                  </div>

                  {currentWord?.example && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Example:</h3>
                      <p className="italic">{currentWord.example}</p>
                      {currentWord.example_vi && (
                        <p className="text-sm text-muted-foreground italic mt-1">{currentWord.example_vi}</p>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {currentWord?.pos && (
                      <Badge variant="outline" className="bg-primary/5">
                        {currentWord.pos}
                      </Badge>
                    )}
                    {currentWord?.cefr && (
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {currentWord.cefr}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-sm font-medium mb-2 text-center">Did you know this word?</h3>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleResponse(false)}
                      variant="outline"
                      className="flex-1 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:border-red-900 dark:hover:bg-red-950/50"
                    >
                      <X className="mr-2 h-4 w-4" />
                      No
                    </Button>
                    <Button
                      onClick={() => handleResponse(true)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Yes
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Mascot */}
      <AnimatePresence>
        {showMascot && (
          <motion.div
            className="absolute bottom-0 right-0 z-10"
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Mascot message={mascotMessage} mood={mascotMood} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
