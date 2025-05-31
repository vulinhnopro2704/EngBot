"use client"

import { Flame, Heart, Diamond } from "lucide-react"
import { StatCard } from "@/components/dashboard/ui/stat-card"
import type { ProgressStatsProps, StatItem } from "@/types/dashboard"

export function ProgressStats({ streak, hearts, diamonds }: ProgressStatsProps) {
  const stats: StatItem[] = [
    {
      title: "Streak",
      value: streak,
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-100 dark:bg-orange-950",
    },
    {
      title: "Hearts",
      value: hearts,
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-100 dark:bg-red-950",
    },
    {
      title: "Diamonds",
      value: diamonds,
      icon: Diamond,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-950",
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {stats.map((stat, index) => (
        <StatCard key={stat.title} stat={stat} index={index} />
      ))}
    </div>
  )
}
