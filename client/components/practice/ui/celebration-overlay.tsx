"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Star, Award, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAudio } from "@/hooks/use-audio"
import confetti from "canvas-confetti"

type CelebrationOverlayProps = {
  title: string
  message: string
  stats: {
    correct: number
    total: number
    streak: number
  }
  onClose: () => void
}

export function CelebrationOverlay({ title, message, stats, onClose }: CelebrationOverlayProps) {
  const { playAudio } = useAudio()

  // Launch confetti when the component mounts
  useEffect(() => {
    try {
      const duration = 2000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          clearInterval(interval)
          return
        }

        const particleCount = 50 * (timeLeft / duration)

        // Launch confetti from both sides
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#26ccff", "#a25afd", "#ff5e7e", "#88ff5a", "#fcff42", "#ffa62d", "#ff36ff"],
        })

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#26ccff", "#a25afd", "#ff5e7e", "#88ff5a", "#fcff42", "#ffa62d", "#ff36ff"],
        })
      }, 250)
    } catch (error) {
      console.error("Error launching confetti:", error)
    }
  }, [])

  // Calculate accuracy percentage
  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 text-center"
        initial={{ scale: 0.8, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-full w-20 h-20 flex items-center justify-center"
        >
          <Star className="h-10 w-10" />
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold mb-3"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 dark:text-gray-300 mb-6"
        >
          {message}
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-primary/10 rounded-lg p-3">
            <Award className="h-6 w-6 mx-auto mb-1 text-primary" />
            <div className="font-bold">{stats.correct}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Correct</div>
          </div>

          <div className="bg-primary/10 rounded-lg p-3">
            <div className="font-bold text-xl">{accuracy}%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Accuracy</div>
          </div>

          <div className="bg-primary/10 rounded-lg p-3">
            <Zap className="h-6 w-6 mx-auto mb-1 text-amber-500" />
            <div className="font-bold">{stats.streak}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Streak</div>
          </div>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
          <Button
            size="lg"
            onClick={() => {
              playAudio("/sounds/click.mp3")
              onClose()
            }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium px-8"
          >
            Continue
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
