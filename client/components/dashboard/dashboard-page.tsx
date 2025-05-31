"use client"

import { motion } from "framer-motion"
import { useVocabStore } from "@/lib/store"
import { useThemeChange } from "@/components/theme-provider"
import { LearningPathSection } from "@/components/dashboard/sections/learning-path-section"
import { AchievementsSection } from "@/components/dashboard/sections/achievements-section"
import { RecommendedActivities } from "@/components/dashboard/sections/recommended-activities"
import { LearningInsights } from "@/components/dashboard/sections/learning-insights"
import { QuickActions } from "@/components/dashboard/sections/quick-actions"
import { DashboardHeader } from "@/components/dashboard/ui/dashboard-header"
import { PageTransition } from "@/components/ui/page-transition"

export function DashboardPage() {
  const { streak, hearts, diamonds, userName } = useVocabStore()
  const { themeChanged } = useThemeChange()

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <PageTransition>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`space-y-4 sm:space-y-6 max-w-[1800px] mx-auto w-full px-1 sm:px-0 ${
          themeChanged ? "animate-theme-fade" : ""
        }`}
      >
        {/* Personalized greeting and stats overview */}
        <DashboardHeader userName={userName} streak={streak} hearts={hearts} diamonds={diamonds} />

        {/* Main dashboard content in a responsive layout */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3 xl:grid-cols-4">
          <motion.div variants={itemVariants} className="lg:col-span-2 xl:col-span-3 space-y-4 sm:space-y-6">
            {/* Visual learning path */}
            <LearningPathSection />

            {/* Recommended activities based on progress */}
            <RecommendedActivities />

            {/* Learning insights and statistics */}
            <LearningInsights />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4 sm:space-y-6">
            {/* Quick action buttons - show at top on mobile */}
            <div className="block lg:hidden">
              <QuickActions />
            </div>

            {/* Achievements and badges */}
            <AchievementsSection streak={streak} hearts={hearts} diamonds={diamonds} />

            {/* Quick action buttons - show on side on desktop */}
            <div className="hidden lg:block">
              <QuickActions />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </PageTransition>
  )
}
