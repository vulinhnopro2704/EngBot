"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useVocabStore } from "@/lib/store"

export function LanguageSettings() {
  const { interfaceLanguage, updateInterfaceLanguage } = useVocabStore()

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "it", name: "Italiano", flag: "🇮🇹" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Interface Language</h3>
        <p className="text-sm text-muted-foreground">Select the language for the application interface.</p>
      </div>

      <RadioGroup
        value={interfaceLanguage}
        onValueChange={updateInterfaceLanguage}
        className="grid gap-4 sm:grid-cols-2 md:grid-cols-3"
      >
        {languages.map((language) => (
          <div key={language.code}>
            <RadioGroupItem value={language.code} id={language.code} className="peer sr-only" />
            <Label
              htmlFor={language.code}
              className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{language.flag}</span>
                <span>{language.name}</span>
              </div>
              {interfaceLanguage === language.code && <Check className="h-4 w-4 text-primary" />}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </motion.div>
  )
}
