"use client"

import { motion } from "framer-motion"
import { Flame, Heart, Diamond } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ProgressStatsProps {
  streak: number
  hearts: number
  diamonds: number
}

export function ProgressStats({ streak, hearts, diamonds }: ProgressStatsProps) {
  const stats = [
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
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-2 sm:p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

