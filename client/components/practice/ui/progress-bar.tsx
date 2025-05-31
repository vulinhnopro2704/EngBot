"use client"

import { cn } from "@/lib/utils"

type ProgressBarProps = {
  value: number
  total: number
  gradient?: boolean
  showPercentage?: boolean
  height?: number
  className?: string
}

export function ProgressBar({
  value,
  total,
  gradient = false,
  showPercentage = false,
  height = 8,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max(Math.round((value / total) * 100), 0), 100)

  return (
    <div className={cn("w-full overflow-hidden", className)}>
      <div className="flex items-center">
        <div
          className="w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
          style={{ height: `${height}px` }}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              gradient ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" : "bg-blue-500",
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {showPercentage && (
          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">{percentage}%</span>
        )}
      </div>
    </div>
  )
}
