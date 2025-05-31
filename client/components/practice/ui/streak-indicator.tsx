"use client"

import { motion } from "framer-motion"
import { Flame } from "lucide-react"

type StreakIndicatorProps = {
  streak: number
  position?: "top-right" | "bottom-right" | "top-left" | "bottom-left" | "center"
}

export function StreakIndicator({ streak, position = "top-right" }: StreakIndicatorProps) {
  if (streak <= 0) return null

  // Define position classes
  const positionClasses = {
    "top-right": "top-2 right-2",
    "bottom-right": "bottom-2 right-2",
    "top-left": "top-2 left-2",
    "bottom-left": "bottom-2 left-2",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  }

  // Define color based on streak level
  const getColorClass = () => {
    if (streak >= 10) return "from-red-500 to-amber-500"
    if (streak >= 5) return "from-amber-500 to-yellow-500"
    return "from-blue-500 to-purple-500"
  }

  return (
    <motion.div
      className={`absolute ${positionClasses[position]} z-10 pointer-events-none`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
    >
      <motion.div
        className={`flex items-center bg-gradient-to-r ${getColorClass()} rounded-full px-3 py-1 shadow-lg`}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "mirror",
          duration: 1.5,
        }}
      >
        <Flame className="h-4 w-4 mr-1 text-white" />
        <span className="text-sm font-bold text-white">{streak}</span>
      </motion.div>
    </motion.div>
  )
}
