"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Only render children once mounted on client
  return <NextThemesProvider {...props}>{mounted ? children : null}</NextThemesProvider>
}

// Create a context for theme changes to trigger animations
type ThemeContextType = {
  themeChanged: boolean
  triggerThemeChange: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  themeChanged: false,
  triggerThemeChange: () => {},
})

export function ThemeChangeProvider({ children }: { children: React.ReactNode }) {
  const [themeChanged, setThemeChanged] = useState(false)

  const triggerThemeChange = () => {
    setThemeChanged(true)
    setTimeout(() => setThemeChanged(false), 500)
  }

  return <ThemeContext.Provider value={{ themeChanged, triggerThemeChange }}>{children}</ThemeContext.Provider>
}

export const useThemeChange = () => useContext(ThemeContext)

