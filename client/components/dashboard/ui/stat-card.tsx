"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import type { StatItem } from "@/types/dashboard"

interface StatCardProps {
  stat: StatItem
  index: number
}

export function StatCard({ stat, index }: StatCardProps) {
  return (
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
  )
}
