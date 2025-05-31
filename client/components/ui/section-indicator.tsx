"use client"

import { motion } from "framer-motion"
import { usePathname } from "next/navigation"

export function SectionIndicator() {
  const pathname = usePathname()

  // Determine which section is active
  const getActiveSection = () => {
    if (pathname === "/") return 0
    if (pathname.startsWith("/courses")) return 1
    if (pathname.startsWith("/practice")) return 2
    if (pathname.startsWith("/notebook")) return 3
    if (pathname.startsWith("/settings")) return 4
    return 0
  }

  const activeIndex = getActiveSection()

  // Get color based on active section
  const getColor = (index: number) => {
    if (index === activeIndex) {
      if (pathname === "/") return "bg-gradient-to-r from-indigo-500 to-purple-500"
      if (pathname.startsWith("/courses")) return "bg-gradient-to-r from-blue-500 to-cyan-500"
      if (pathname.startsWith("/practice")) return "bg-gradient-to-r from-purple-500 to-violet-500"
      if (pathname.startsWith("/notebook")) return "bg-gradient-to-r from-emerald-500 to-green-500"
      if (pathname.startsWith("/settings")) return "bg-gradient-to-r from-amber-500 to-yellow-500"
    }
    return "bg-gray-200 dark:bg-gray-700"
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex gap-1 p-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full shadow-lg md:hidden">
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          className={`w-2 h-2 rounded-full ${getColor(index)}`}
          animate={{
            scale: index === activeIndex ? 1.2 : 1,
            opacity: index === activeIndex ? 1 : 0.5,
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  )
}
