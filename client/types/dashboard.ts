import type React from "react"

// Dashboard header props
export interface DashboardHeaderProps {
  userName: string
  streak: number
  hearts: number
  diamonds: number
}

// Progress stats props
export interface ProgressStatsProps {
  streak: number
  hearts: number
  diamonds: number
}

// Stat item for progress stats
export interface StatItem {
  title: string
  value: number
  icon: React.ElementType
  color: string
  bgColor: string
}

// Achievements section props
export interface AchievementsSectionProps {
  streak: number
  hearts: number
  diamonds: number
}

// Achievement item
export interface Achievement {
  name: string
  description: string
  icon: React.ElementType
  color: string
  unlocked: boolean
  progress: number
}

// Recommended activity
export interface RecommendedActivity {
  title: string
  description: string
  icon: React.ElementType
  gradient: string
  iconGradient: string
  action: () => void
}

// Quick action
export interface QuickAction {
  name: string
  icon: React.ElementType
  gradient: string
  action: () => void
}

// Learning insight
export interface LearningInsight {
  day: string
  words: number
}

// Word category
export interface WordCategory {
  category: string
  count: number
  color: string
}
