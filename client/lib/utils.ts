import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Detect color scheme preference
export function getSystemTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "light"

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

// Apply theme class to document
export function applyTheme(theme: string) {
  if (typeof document === "undefined") return

  const root = document.documentElement

  if (theme === "dark") {
    root.classList.add("dark")
  } else {
    root.classList.remove("dark")
  }

  // Add transition class briefly
  root.classList.add("theme-transition")
  setTimeout(() => {
    root.classList.remove("theme-transition")
  }, 300)
}
