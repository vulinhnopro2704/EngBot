"use client"

import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { Moon, Sun, Monitor } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useVocabStore } from "@/lib/store"
import { useThemeChange } from "@/components/theme-provider"

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme()
  const { fontSizePreference, updateFontSizePreference } = useVocabStore()
  const { triggerThemeChange } = useThemeChange()

  // Trigger animation when theme changes from this component
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    triggerThemeChange()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      <div className="space-y-3">
        <h3 className="text-lg md:text-xl font-medium">Theme</h3>
        <p className="text-sm md:text-base text-muted-foreground">Select your preferred theme for the application.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <Card
          className={`cursor-pointer transition-all duration-200 ${
            theme === "light" ? "border-primary ring-2 ring-primary/20" : "border-border"
          }`}
          onClick={() => handleThemeChange("light")}
        >
          <CardContent className="p-4 md:p-6 flex flex-col items-center justify-center gap-3">
            <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-background flex items-center justify-center">
              <Sun className="h-10 w-10 md:h-12 md:w-12 text-yellow-500" />
            </div>
            <span className="font-medium text-base md:text-lg">Light</span>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all duration-200 ${
            theme === "dark" ? "border-primary ring-2 ring-primary/20" : "border-border"
          }`}
          onClick={() => handleThemeChange("dark")}
        >
          <CardContent className="p-4 md:p-6 flex flex-col items-center justify-center gap-3">
            <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-slate-900 flex items-center justify-center">
              <Moon className="h-10 w-10 md:h-12 md:w-12 text-slate-400" />
            </div>
            <span className="font-medium text-base md:text-lg">Dark</span>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all duration-200 ${
            theme === "system" ? "border-primary ring-2 ring-primary/20" : "border-border"
          }`}
          onClick={() => handleThemeChange("system")}
        >
          <CardContent className="p-4 md:p-6 flex flex-col items-center justify-center gap-3">
            <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-gradient-to-br from-background to-slate-900 flex items-center justify-center">
              <Monitor className="h-10 w-10 md:h-12 md:w-12 text-primary" />
            </div>
            <span className="font-medium text-base md:text-lg">System</span>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 pt-6">
        <div className="space-y-2">
          <h3 className="text-lg md:text-xl font-medium">Font Size</h3>
          <p className="text-sm md:text-base text-muted-foreground">Adjust the font size for better readability.</p>
        </div>

        <RadioGroup
          defaultValue={fontSizePreference}
          onValueChange={(value) => updateFontSizePreference(value as "small" | "medium" | "large")}
          className="grid grid-cols-3 gap-4 md:gap-6"
        >
          <div>
            <RadioGroupItem value="small" id="small" className="peer sr-only" />
            <Label
              htmlFor="small"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 md:p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span className="text-sm">Small</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="medium" id="medium" className="peer sr-only" />
            <Label
              htmlFor="medium"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 md:p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span className="text-base">Medium</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="large" id="large" className="peer sr-only" />
            <Label
              htmlFor="large"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 md:p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span className="text-lg">Large</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </motion.div>
  )
}

