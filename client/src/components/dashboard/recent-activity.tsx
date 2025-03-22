"use client"

import { motion } from "framer-motion"
import { Check, Clock, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useVocabStore } from "@/lib/store"

export function RecentActivity() {
  const { recentActivities } = useVocabStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex items-start gap-3 pb-4 last:pb-0 last:border-0 border-b"
            >
              <div className={`p-2 rounded-full ${activity.iconBg} shrink-0`}>
                {activity.type === "completed" && <Check className={`h-4 w-4 ${activity.iconColor}`} />}
                {activity.type === "streak" && <Star className={`h-4 w-4 ${activity.iconColor}`} />}
                {activity.type === "practice" && <Clock className={`h-4 w-4 ${activity.iconColor}`} />}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-sm font-medium truncate">{activity.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{activity.description}</p>
              </div>
              <div className="text-xs text-muted-foreground shrink-0">{activity.time}</div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

