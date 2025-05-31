"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"

type MascotProps = {
  message: string
  mood?: "happy" | "sad" | "excited" | "neutral"
  size?: "sm" | "md" | "lg"
}

export function Mascot({ message, mood = "neutral", size = "md" }: MascotProps) {
  // Different mascot images based on mood
  const mascotImages = {
    happy: "/mascots/owl-happy.png",
    sad: "/mascots/owl-sad.png",
    excited: "/mascots/owl-excited.png",
    neutral: "/mascots/owl-neutral.png",
  }

  // Size classes
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }

  // Speech bubble classes based on mood
  const bubbleClasses = {
    happy: "bg-green-100 border-green-200 dark:bg-green-900/50 dark:border-green-800",
    sad: "bg-blue-100 border-blue-200 dark:bg-blue-900/50 dark:border-blue-800",
    excited: "bg-yellow-100 border-yellow-200 dark:bg-yellow-900/50 dark:border-yellow-800",
    neutral: "bg-gray-100 border-gray-200 dark:bg-gray-900/50 dark:border-gray-800",
  }

  return (
    <div className="flex items-end gap-2">
      {/* Speech bubble */}
      <motion.div
        className={cn("relative p-3 rounded-lg border shadow-sm max-w-[200px]", bubbleClasses[mood])}
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-sm">{message}</p>
        {/* Speech bubble pointer */}
        <div className={cn("absolute -bottom-2 right-5 w-4 h-4 transform rotate-45", bubbleClasses[mood])} />
      </motion.div>

      {/* Mascot image */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          delay: 0.1,
        }}
        className={cn("relative", sizeClasses[size])}
      >
        <Image src={mascotImages[mood] || "/placeholder.svg"} alt="Learning mascot" fill className="object-contain" />
      </motion.div>
    </div>
  )
}
