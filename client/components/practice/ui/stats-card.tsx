import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode } from "react"

interface StatsCardProps {
  title: string
  icon: LucideIcon
  iconColor: string
  gradient: string
  darkGradient: string
  border: string
  darkBorder: string
  content: ReactNode
  footer?: ReactNode
}

export function StatsCard({
  title,
  icon: Icon,
  iconColor,
  gradient,
  darkGradient,
  border,
  darkBorder,
  content,
  footer
}: StatsCardProps) {
  return (
    <Card className={`bg-gradient-to-br ${gradient} ${darkGradient} ${border} ${darkBorder}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Icon className={`h-4 w-4 ${iconColor}`} /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {content}
        {footer && <div className="mt-2">{footer}</div>}
      </CardContent>
    </Card>
  )
}
