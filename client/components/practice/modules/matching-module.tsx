"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, Volume2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { usePracticeStore } from "@/lib/practice-store"
import { useAudio } from "@/hooks/use-audio"
import { FeedbackEffect } from "@/components/practice/ui/feedback-effect"
import { MascotEncouragement } from "@/components/practice/ui/mascot-encouragement"
import { WordInfoSnackbar } from "@/components/practice/ui/word-info-snackbar"
import { getRandomVocabularyWords } from "@/data/vocabulary"
import type { PracticeQuestion } from "@/data/types"

type MatchingModuleProps = {
  question: PracticeQuestion
  onAnswer: (answer: string) => void
}

type MatchPair = {
  id: string
  text: string
  matchId: string
  isMatched?: boolean
  selectedForMatching?: boolean
  isIncorrectMatch?: boolean
}

export function MatchingModule({ question, onAnswer }: MatchingModuleProps) {
  const [leftItems, setLeftItems] = useState<MatchPair[]>([])
  const [rightItems, setRightItems] = useState<MatchPair[]>([])
  const [selectedItem, setSelectedItem] = useState<MatchPair | null>(null)
  const [matches, setMatches] = useState<{ [key: string]: string }>({})
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [showingFeedback, setShowingFeedback] = useState(false)
  const [showMascot, setShowMascot] = useState(false)
  const [mascotMessage, setMascotMessage] = useState("")
  const [mascotMood, setMascotMood] = useState<"happy" | "sad" | "excited" | "neutral">("neutral")
  const [allMatched, setAllMatched] = useState(false)
  const [incorrectAttempts, setIncorrectAttempts] = useState(0)
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false)
  const [showWordInfo, setShowWordInfo] = useState(false)
  const [answerSubmitted, setAnswerSubmitted] = useState(false)

  const { streakCount, incrementStreak, resetStreak, decrementHearts } = usePracticeStore()
  const { playAudio, speakWord, playSound } = useAudio()

  // Initialize the matching pairs
  useEffect(() => {
    if (!question.pairs || question.pairs.length === 0) {
      // If no pairs provided, create 6 pairs from random vocabulary words
      const mainWord = question.word
      const additionalWords = getRandomVocabularyWords(5).filter((word) => word.id !== mainWord.id)
      const allWords = [mainWord, ...additionalWords]

      // Create pairs
      const left: MatchPair[] = allWords.map((word) => ({
        id: `a-${word.id}`,
        text: word.word,
        matchId: `b-${word.id}`,
      }))

      const right: MatchPair[] = allWords.map((word) => ({
        id: `b-${word.id}`,
        text: word.meaning || word.definition,
        matchId: `a-${word.id}`,
      }))

      // Shuffle both columns
      setLeftItems(left.sort(() => 0.5 - Math.random()))
      setRightItems(right.sort(() => 0.5 - Math.random()))
    } else {
      // Group pairs into left and right columns
      const left: MatchPair[] = []
      const right: MatchPair[] = []

      for (const pair of question.pairs) {
        if (pair.id.startsWith("a-")) {
          left.push({ ...pair })
        } else {
          right.push({ ...pair })
        }
      }

      // Shuffle both columns
      setLeftItems(left.sort(() => 0.5 - Math.random()))
      setRightItems(right.sort(() => 0.5 - Math.random()))
    }
  }, [question.pairs, question.word])

  const handleItemClick = (item: MatchPair, side: "left" | "right") => {
    if (showingFeedback) return

    // Use playSound instead of playAudio for better reliability
    playSound("click")

    if (!selectedItem) {
      // First selection
      setSelectedItem(item)

      // Update the items to show selection
      if (side === "left") {
        setLeftItems(leftItems.map((i) => (i.id === item.id ? { ...i, selectedForMatching: true } : i)))
      } else {
        setRightItems(rightItems.map((i) => (i.id === item.id ? { ...i, selectedForMatching: true } : i)))
      }
    } else {
      // Second selection - check if it's a match
      const firstSide = selectedItem.id.startsWith("a-") ? "left" : "right"
      const secondSide = side

      // Only allow matching between different sides
      if (firstSide === secondSide) {
        // Deselect current and select new from same side
        if (firstSide === "left") {
          setLeftItems(
            leftItems.map((i) =>
              i.id === item.id ? { ...i, selectedForMatching: true } : { ...i, selectedForMatching: false },
            ),
          )
        } else {
          setRightItems(
            rightItems.map((i) =>
              i.id === item.id ? { ...i, selectedForMatching: true } : { ...i, selectedForMatching: false },
            ),
          )
        }
        setSelectedItem(item)
        return
      }

      // Check if it's a valid match
      const isMatch =
        (firstSide === "left" && selectedItem.matchId === item.id) ||
        (firstSide === "right" && item.matchId === selectedItem.id)

      if (isMatch) {
        // It's a match!
        playSound("correct")

        // Update the matched state
        const newMatches = { ...matches }
        newMatches[selectedItem.id] = item.id
        newMatches[item.id] = selectedItem.id
        setMatches(newMatches)

        // Update both lists to mark items as matched
        setLeftItems(
          leftItems.map((i) =>
            i.id === selectedItem.id || i.id === item.id
              ? { ...i, isMatched: true, selectedForMatching: false, isIncorrectMatch: false }
              : { ...i, selectedForMatching: false },
          ),
        )

        setRightItems(
          rightItems.map((i) =>
            i.id === selectedItem.id || i.id === item.id
              ? { ...i, isMatched: true, selectedForMatching: false, isIncorrectMatch: false }
              : { ...i, selectedForMatching: false },
          ),
        )
      } else {
        // Not a match - show incorrect feedback
        playSound("incorrect")

        // Increment incorrect attempts
        setIncorrectAttempts(incorrectAttempts + 1)

        // If this is the first or second incorrect attempt, just show visual feedback
        if (incorrectAttempts < 2) {
          // Show temporary incorrect match feedback
          if (firstSide === "left") {
            setLeftItems(
              leftItems.map((i) =>
                i.id === selectedItem.id
                  ? { ...i, selectedForMatching: false, isIncorrectMatch: true }
                  : { ...i, selectedForMatching: false },
              ),
            )
            setRightItems(
              rightItems.map((i) =>
                i.id === item.id
                  ? { ...i, selectedForMatching: false, isIncorrectMatch: true }
                  : { ...i, selectedForMatching: false },
              ),
            )
          } else {
            setRightItems(
              rightItems.map((i) =>
                i.id === selectedItem.id
                  ? { ...i, selectedForMatching: false, isIncorrectMatch: true }
                  : { ...i, selectedForMatching: false },
              ),
            )
            setLeftItems(
              leftItems.map((i) =>
                i.id === item.id
                  ? { ...i, selectedForMatching: false, isIncorrectMatch: true }
                  : { ...i, selectedForMatching: false },
              ),
            )
          }

          // Remove incorrect match indication after a short delay
          setTimeout(() => {
            setLeftItems(leftItems.map((i) => ({ ...i, isIncorrectMatch: false, selectedForMatching: false })))
            setRightItems(rightItems.map((i) => ({ ...i, isIncorrectMatch: false, selectedForMatching: false })))
          }, 1000)

          // Deduct a heart after the second incorrect attempt
          if (incorrectAttempts === 1) {
            decrementHearts()

            // Show mascot with encouragement
            setMascotMessage("Don't worry! Try to match the correct pairs.")
            setMascotMood("sad")
            setShowMascot(true)
          }
        } else {
          // After 3 incorrect attempts, just clear the selection
          setLeftItems(leftItems.map((i) => ({ ...i, selectedForMatching: false, isIncorrectMatch: false })))
          setRightItems(rightItems.map((i) => ({ ...i, selectedForMatching: false, isIncorrectMatch: false })))
        }
      }

      // Reset selection
      setSelectedItem(null)
    }
  }

  // Check if all items are matched
  useEffect(() => {
    const allItemsMatched = leftItems.every((item) => item.isMatched)

    if (allItemsMatched && leftItems.length > 0 && !hasSubmittedAnswer) {
      setAllMatched(true)
      setHasSubmittedAnswer(true)

      // Wait a brief moment before showing feedback
      setTimeout(() => {
        setFeedback("correct")
        setShowingFeedback(true)

        // Update streak
        incrementStreak()

        // Show mascot based on streak
        if (streakCount >= 3) {
          setMascotMessage("Perfect matching! You're on a roll! 🔥")
          setMascotMood("excited")
          setShowMascot(true)
        } else if (Math.random() > 0.7) {
          setMascotMessage("Great job! You matched everything correctly!")
          setMascotMood("happy")
          setShowMascot(true)
        }

        // Pronounce the word after showing feedback
        setTimeout(() => {
          speakWord(question.word.word)
        }, 1000)

        // Show word info for all answers
        setTimeout(() => {
          setShowWordInfo(true)
        }, 1500)
      }, 500)
    }
  }, [leftItems, matches, question.word.word, speakWord, streakCount, incrementStreak, hasSubmittedAnswer])

  const handlePlayAudio = () => {
    if (question.word.audio) {
      playAudio(question.word.audio)
    } else {
      speakWord(question.word.word)
    }
  }

  const handleSkip = () => {
    if (hasSubmittedAnswer) return

    setFeedback("incorrect")
    setShowingFeedback(true)
    setHasSubmittedAnswer(true)

    // Reset streak
    resetStreak()

    // Deduct a heart
    decrementHearts()

    // Set all pairs as matched to reveal the correct answers
    const allMatched = { ...matches }
    leftItems.forEach((item) => {
      allMatched[item.id] = item.matchId
      allMatched[item.matchId] = item.id
    })
    setMatches(allMatched)

    // Show mascot
    setMascotMessage("Let's try a different one!")
    setMascotMood("neutral")
    setShowMascot(true)

    // Show word info for skipped questions
    setTimeout(() => {
      setShowWordInfo(true)
    }, 1500)
  }

  const handleContinue = () => {
    if (!answerSubmitted) {
      setAnswerSubmitted(true)
      // Submit the answer
      onAnswer(allMatched ? "matched" : "skipped")
    }
  }

  // Reset state when question changes
  useEffect(() => {
    setSelectedItem(null)
    setMatches({})
    setFeedback(null)
    setShowingFeedback(false)
    setShowMascot(false)
    setAllMatched(false)
    setIncorrectAttempts(0)
    setHasSubmittedAnswer(false)
    setShowWordInfo(false)
    setAnswerSubmitted(false)
  }, [question.id])

  return (
    <div className="relative">
      <Card className="w-full overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-yellow-500" />

        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Match the pairs</span>
            <Button variant="ghost" size="icon" onClick={handlePlayAudio} title="Play pronunciation">
              <Volume2 className="h-5 w-5" />
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Left column */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-center mb-3">Words</h3>
              <AnimatePresence>
                {leftItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Button
                      variant={
                        item.isMatched
                          ? "secondary"
                          : item.isIncorrectMatch
                            ? "destructive"
                            : item.selectedForMatching
                              ? "default"
                              : "outline"
                      }
                      className="w-full justify-start text-left mb-2 relative overflow-hidden"
                      onClick={() => !item.isMatched && handleItemClick(item, "left")}
                      disabled={item.isMatched || showingFeedback}
                    >
                      {item.isMatched && <div className="absolute inset-0 bg-green-500/10 dark:bg-green-500/20" />}
                      <span>{item.text}</span>
                      {item.isMatched && <Check className="ml-auto h-4 w-4 text-green-500" />}
                      {item.isIncorrectMatch && <X className="ml-auto h-4 w-4 text-red-500" />}
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Right column */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-center mb-3">Definitions</h3>
              <AnimatePresence>
                {rightItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Button
                      variant={
                        item.isMatched
                          ? "secondary"
                          : item.isIncorrectMatch
                            ? "destructive"
                            : item.selectedForMatching
                              ? "default"
                              : "outline"
                      }
                      className="w-full justify-start text-left mb-2 relative overflow-hidden"
                      onClick={() => !item.isMatched && handleItemClick(item, "right")}
                      disabled={item.isMatched || showingFeedback}
                    >
                      {item.isMatched && <div className="absolute inset-0 bg-green-500/10 dark:bg-green-500/20" />}
                      <span>{item.text}</span>
                      {item.isMatched && <Check className="ml-auto h-4 w-4 text-green-500" />}
                      {item.isIncorrectMatch && <X className="ml-auto h-4 w-4 text-red-500" />}
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {!allMatched && !showingFeedback && (
            <Button variant="outline" className="w-full" onClick={handleSkip}>
              Skip this question
            </Button>
          )}

          {showingFeedback && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Alert variant={feedback === "correct" ? "default" : "destructive"}>
                <AlertDescription className="flex items-center gap-2">
                  {feedback === "correct" ? (
                    <>
                      <Check className="h-4 w-4" />
                      Great job! You matched all pairs correctly.
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4" />
                      All pairs have been revealed. Let's move on to the next question.
                    </>
                  )}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Visual feedback effect */}
      {showingFeedback && <FeedbackEffect isCorrect={feedback === "correct"} />}

      {/* Mascot encouragement */}
      {showMascot && (
        <MascotEncouragement message={mascotMessage} mood={mascotMood} onComplete={() => setShowMascot(false)} />
      )}

      {/* Word information snackbar */}
      <WordInfoSnackbar
        word={question.word}
        isVisible={showWordInfo}
        onClose={() => setShowWordInfo(false)}
        onContinue={handleContinue}
        showContinueButton={true}
        isCorrect={feedback === "correct"}
      />
    </div>
  )
}
