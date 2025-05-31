import type { Activity } from "@/data/types"

export const recentActivities: Activity[] = [
  {
    id: 1,
    type: "completed",
    title: "Completed Lesson",
    description: 'You completed "Greetings and Introductions"',
    time: "2h ago",
    iconBg: "bg-green-100 dark:bg-green-950",
    iconColor: "text-green-500",
  },
  {
    id: 2,
    type: "streak",
    title: "Streak Milestone",
    description: "You reached a 7-day streak!",
    time: "1d ago",
    iconBg: "bg-orange-100 dark:bg-orange-950",
    iconColor: "text-orange-500",
  },
  {
    id: 3,
    type: "practice",
    title: "Practice Session",
    description: 'You practiced "Daily Activities" for 15 minutes',
    time: "2d ago",
    iconBg: "bg-blue-100 dark:bg-blue-950",
    iconColor: "text-blue-500",
  },
  {
    id: 4,
    type: "completed",
    title: "Completed Lesson",
    description: 'You completed "Food and Dining"',
    time: "3d ago",
    iconBg: "bg-green-100 dark:bg-green-950",
    iconColor: "text-green-500",
  },
]
