"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { useTransition } from "@/components/ui/section-transition"

export function NavigationProgress() {
  const pathname = usePathname()
  const { isTransitioning } = useTransition()
  const [showProgress, setShowProgress] = useState(false)

  useEffect(() => {
    if (isTransitioning) {
      setShowProgress(true)
    } else {
      // Hide progress bar after transition completes
      const timer = setTimeout(() => {
        setShowProgress(false)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [isTransitioning])

  // Get color based on current path
  const getColor = () => {
    if (pathname.startsWith("/courses")) return "from-blue-500 to-cyan-500"
    if (pathname.startsWith("/practice")) return "from-purple-500 to-violet-500"
    if (pathname.startsWith("/notebook")) return "from-emerald-500 to-green-500"
    if (pathname.startsWith("/settings")) return "from-amber-500 to-yellow-500"
    return "from-indigo-500 to-purple-500" // default
  }

  return (
    <AnimatePresence>
      {showProgress && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`h-full bg-gradient-to-r ${getColor()}`}
            initial={{ width: "0%" }}
            animate={{
              width: isTransitioning ? ["0%", "30%", "60%", "90%"] : "100%",
            }}
            transition={{
              duration: isTransitioning ? 1 : 0.2,
              times: isTransitioning ? [0, 0.3, 0.6, 0.9] : [0, 1],
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

