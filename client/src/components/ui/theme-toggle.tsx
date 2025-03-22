"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useThemeChange } from "@/components/theme-provider"
import { motion } from "framer-motion"

type ThemeToggleProps = {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function ThemeToggle({ variant = "ghost", size = "icon", className = "" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const { triggerThemeChange } = useThemeChange()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={`w-9 h-9 ${className}`} />
  }

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    triggerThemeChange()
  }

  return (
    <Button variant={variant} size={size} onClick={toggleTheme} className={className} aria-label="Toggle theme">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.2 }}
        key={theme}
      >
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </motion.div>
    </Button>
  )
}

