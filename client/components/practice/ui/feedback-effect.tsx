"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"

type FeedbackEffectProps = {
  isCorrect: boolean
}

export function FeedbackEffect({ isCorrect }: FeedbackEffectProps) {
  useEffect(() => {
    try {
      if (isCorrect) {
        // Create 10-15 small particles
        for (let i = 0; i < 12; i++) {
          createParticle(isCorrect)
        }
      }
    } catch (error) {
      console.error("Error creating feedback particles:", error)
    }
  }, [isCorrect])

  // Create a single particle element
  const createParticle = (isCorrect: boolean) => {
    try {
      const particle = document.createElement("div")
      document.body.appendChild(particle)

      // Random size between 10-20px
      const size = Math.floor(Math.random() * 10) + 10

      // Position at a random spot on screen
      const left = Math.random() * window.innerWidth
      const top = Math.random() * window.innerHeight

      // Set particle styles
      particle.style.position = "fixed"
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.borderRadius = "50%"
      particle.style.left = `${left}px`
      particle.style.top = `${top}px`
      particle.style.pointerEvents = "none"
      particle.style.zIndex = "100"

      // Set color based on correctness
      if (isCorrect) {
        const hue = 120 + Math.random() * 60 - 30 // Green with variation
        particle.style.backgroundColor = `hsl(${hue}, 100%, 60%)`
      } else {
        const hue = 0 + Math.random() * 20 - 10 // Red with variation
        particle.style.backgroundColor = `hsl(${hue}, 100%, 60%)`
      }

      // Animate the particle
      const animation = particle.animate(
        [
          {
            transform: `translate(0, 0) scale(0)`,
            opacity: 1,
          },
          {
            transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1)`,
            opacity: 0.7,
          },
          {
            transform: `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0)`,
            opacity: 0,
          },
        ],
        {
          duration: 1000,
          easing: "cubic-bezier(0.1, 0.8, 0.2, 1)",
        },
      )

      // Remove the particle when animation completes
      animation.onfinish = () => {
        particle.remove()
      }
    } catch (error) {
      console.error("Error with particle animation:", error)
    }
  }

  return (
    <motion.div
      className="absolute inset-0 z-10 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: isCorrect ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
          boxShadow: isCorrect ? "inset 0 0 30px rgba(34, 197, 94, 0.2)" : "inset 0 0 30px rgba(239, 68, 68, 0.2)",
        }}
      />
    </motion.div>
  )
}
