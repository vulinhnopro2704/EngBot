import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface AchievementCardProps {
  title: string
  description: string
  icon: LucideIcon
  gradient: string
  bgGradient: string
  darkBgGradient: string
  border: string
  darkBorder: string
  delay?: number
}

export function AchievementCard({
  title,
  description,
  icon: Icon,
  gradient,
  bgGradient,
  darkBgGradient,
  border,
  darkBorder,
  delay = 0.2
}: AchievementCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <Card className={`${bgGradient} ${darkBgGradient} ${border} ${darkBorder}`}>
        <CardContent className="p-4 flex items-center gap-3">
          <div className={`bg-gradient-to-r ${gradient} p-2 rounded-full`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-medium">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
