"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { PracticeMode } from "@/data/types"
import type { ReactNode } from "react"

interface PracticeModeCardProps {
  title: string
  description: string
  explanation: string
  content?: ReactNode
  icon: LucideIcon
  colors: {
    gradient: string
    bg: string
    darkBg: string
    iconBg: string
    darkIconBg: string
    iconColor: string
    darkIconColor: string
  }
  mode: PracticeMode
  onStartPractice: (mode: PracticeMode) => void
  isLoading: boolean
}

export function PracticeModeCard({
  title,
  description,
  explanation,
  content,
  icon: Icon,
  colors,
  mode,
  onStartPractice,
  isLoading
}: PracticeModeCardProps) {
  return (
    <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="h-full">
      <Card className="h-full border-none shadow-md overflow-hidden">
        <div className={`h-1 bg-gradient-to-r ${colors.gradient}`} />
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className={`p-3 rounded-lg ${colors.bg} ${colors.darkBg}`}>
              <Icon className={`h-6 w-6 ${colors.iconColor} ${colors.darkIconColor}`} />
            </div>
          </div>
          <CardTitle className="text-lg md:text-xl mt-2">{title}</CardTitle>
          <CardDescription className="text-sm md:text-base">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm md:text-base text-muted-foreground">
            {explanation}
          </p>
          {content}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => onStartPractice(mode)}
              disabled={isLoading}
              className={`w-full h-10 md:h-11 md:text-base bg-gradient-to-r ${colors.gradient} hover:${colors.gradient.replace(/-500/g, '-600')}`}
            >
              {isLoading ? "Loading..." : `Start ${title}`} <Zap className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Animation variants
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}
