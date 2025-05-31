"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Brain, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { CourseCardProps } from "@/types/courses"

export function ListCourseCard({
  course,
  progress,
  Icon,
  index,
  onSelect,
  onPractice,
  getLevelColor,
}: CourseCardProps) {
  return (
    <motion.div
      key={course.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2, scale: 1.01 }}
      className="cursor-pointer"
      onClick={onSelect}
      layout
    >
      <Card className="overflow-hidden border-none shadow-md">
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-36 md:w-48 lg:w-64 h-32 sm:h-auto bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden">
            {course.imageUrl ? (
              <img
                src={course.imageUrl || "/placeholder.svg"}
                alt={course.title}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            ) : (
              <Icon className="h-16 w-16 md:h-20 md:w-20 text-primary/40" />
            )}

            <div className="absolute top-2 right-2 flex gap-1">
              <Badge className={`${getLevelColor(course.level)} text-[10px] xs:text-xs`}>{course.level}</Badge>
            </div>
          </div>

          <div className="flex-1 p-4 md:p-6">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${course.color}`}>
                  <Icon className={`h-4 w-4 md:h-5 md:w-5 ${course.iconColor}`} />
                </div>
                <h3 className="font-bold text-lg md:text-xl">{course.title}</h3>
              </div>
            </div>

            <p className="text-sm md:text-base text-muted-foreground mb-4 line-clamp-2">{course.description}</p>

            <div className="flex flex-wrap gap-4 text-sm md:text-base mb-4">
              {course.category && (
                <Badge variant="outline" className="text-[10px] xs:text-xs">
                  {course.category}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 md:h-3" />
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="h-9 md:h-10 md:text-base" variant={progress > 0 ? "default" : "outline"}>
                  {progress > 0 ? "Continue" : "Start"} <ChevronRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 md:h-10 md:w-10"
                  onClick={onPractice}
                  title="Practice this course"
                >
                  <Brain className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
