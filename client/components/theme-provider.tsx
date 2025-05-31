"use client"

import type React from "react"
import { useState, createContext, useContext } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

// Theme change context for animations
const ThemeChangeContext = createContext<{
  themeChanged: boolean
  triggerThemeChange: () => void
}>({
  themeChanged: false,
  triggerThemeChange: () => {},
})

export function useThemeChange() {
  return useContext(ThemeChangeContext)
}

export function ThemeChangeProvider({ children }: { children: React.ReactNode }) {
  const [themeChanged, setThemeChanged] = useState(false)

  const triggerThemeChange = () => {
    setThemeChanged(true)
    setTimeout(() => setThemeChanged(false), 300)
  }

  return (
    <ThemeChangeContext.Provider value={{ themeChanged, triggerThemeChange }}>{children}</ThemeChangeContext.Provider>
  )
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="engbot-theme"
    >
      {children}
    </NextThemesProvider>
  )
}
