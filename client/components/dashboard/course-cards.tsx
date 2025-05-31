"use client"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ChevronRight, BookOpen, Briefcase, GraduationCap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useVocabStore } from "@/lib/store"

export function CourseCards() {
  const router = useRouter()
  const { setCourse } = useVocabStore()

  const courses = [
    {
      id: 1,
      title: "Beginner Vocabulary",
      description: "Essential words for everyday communication",
      lessons: 5,
      completedLessons: 2,
      icon: BookOpen,
      color: "bg-blue-100 dark:bg-blue-950",
      iconColor: "text-blue-500",
    },
    {
      id: 2,
      title: "Business English",
      description: "Professional vocabulary for the workplace",
      lessons: 4,
      completedLessons: 1,
      icon: Briefcase,
      color: "bg-green-100 dark:bg-green-950",
      iconColor: "text-green-500",
    },
    {
      id: 3,
      title: "Academic English",
      description: "Vocabulary for academic writing and research",
      lessons: 3,
      completedLessons: 0,
      icon: GraduationCap,
      color: "bg-purple-100 dark:bg-purple-950",
      iconColor: "text-purple-500",
    },
  ]

  const handleCourseSelect = (courseId: number) => {
    setCourse(courseId)
    router.push(`/courses/${courseId}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Your Courses</h2>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-xs sm:text-sm whitespace-nowrap"
          onClick={() => router.push("/courses")}
        >
          View all
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, index) => {
          const progress = (course.completedLessons / course.lessons) * 100

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="min-w-0"
            >
              <Card className="h-full">
                <CardHeader className="pb-2 p-4 sm:p-6">
                  <div className="flex justify-between items-start">
                    <div className={`p-2 rounded-lg ${course.color}`}>
                      <course.icon className={`h-5 w-5 ${course.iconColor}`} />
                    </div>
                  </div>
                  <CardTitle className="text-base sm:text-lg mt-2 line-clamp-1">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {course.completedLessons}/{course.lessons} lessons
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    <Button
                      onClick={() => handleCourseSelect(course.id)}
                      className="w-full text-xs sm:text-sm"
                      variant={progress > 0 ? "default" : "outline"}
                    >
                      {progress > 0 ? "Continue" : "Start"} <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
