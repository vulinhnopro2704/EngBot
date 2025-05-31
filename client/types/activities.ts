// Activity types
export type ActivityType = "completed" | "streak" | "practice"

// Activity interface
export interface Activity {
  id: number
  type: ActivityType
  title: string
  description: string
  time: string
  iconBg: string
  iconColor: string
}
