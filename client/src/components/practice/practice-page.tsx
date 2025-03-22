"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Brain, BookOpen, Briefcase, GraduationCap, Dumbbell, Clock, ArrowRight, Sparkles, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useVocabStore } from "@/lib/store"
import { courses } from "@/data/courses"
import { PracticeHistory } from "@/components/practice/practice-history"
import { LoadingAnimals } from "@/components/ui/loading-animals"

export function PracticePage() {
  const router = useRouter()
  const { startPracticeSession, practiceHistory } = useVocabStore()
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number>(10)
  const [isLoading, setIsLoading] = useState(true)
  const [animalType, setAnimalType] = useState<"cat" | "quokka" | "hamster" | "capybara">("hamster")

  // Simulate loading state
  useEffect(() => {
    // Randomly select an animal for loading animation
    const animals = ["cat", "quokka", "hamster", "capybara"] as const
    setAnimalType(animals[Math.floor(Math.random() * animals.length)])

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleStartQuickPractice = () => {
    startPracticeSession(selectedQuestionCount)
    router.push("/practice/session")
  }

  const handleStartCoursePractice = (courseId: number) => {
    startPracticeSession(selectedQuestionCount, courseId)
    router.push("/practice/session")
  }

  // Map icon strings to components
  const iconMap = {
    BookOpen,
    Briefcase,
    GraduationCap,
  }

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <LoadingAnimals type={animalType} text="Loading practice options..." size="lg" color="purple" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 max-w-[1600px] mx-auto w-full"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-1"
        >
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 md:h-7 md:w-7 text-purple-500" />
            <span>Practice Your Vocabulary</span>
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                repeatDelay: 5,
              }}
            >
              <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-yellow-500 ml-2" />
            </motion.div>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Reinforce your learning with different practice modes
          </p>
        </motion.div>
      </div>

      <Tabs defaultValue="quick" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 h-11 md:h-12">
          <TabsTrigger
            value="quick"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white md:text-base"
          >
            <Dumbbell className="h-4 w-4 md:h-5 md:w-5" /> Quick Practice
          </TabsTrigger>
          <TabsTrigger
            value="courses"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white md:text-base"
          >
            <BookOpen className="h-4 w-4 md:h-5 md:w-5" /> By Course
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white md:text-base"
          >
            <Clock className="h-4 w-4 md:h-5 md:w-5" /> History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quick">
          <div className="space-y-6">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                  <Brain className="h-5 w-5 md:h-6 md:w-6 text-purple-500" /> Quick Practice
                </CardTitle>
                <CardDescription className="text-base">
                  Practice with random vocabulary words from all courses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <p className="text-sm md:text-base font-medium">Number of questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {[5, 10, 15, 20].map((count) => (
                      <Button
                        key={count}
                        variant={selectedQuestionCount === count ? "default" : "outline"}
                        size="sm"
                        className="h-9 md:h-10 md:text-base"
                        onClick={() => setSelectedQuestionCount(count)}
                      >
                        {count}
                      </Button>
                    ))}
                  </div>
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-4 md:grid-cols-3"
                >
                  <motion.div variants={itemVariants}>
                    <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 h-full">
                      <CardContent className="p-4 md:p-6 flex flex-col items-center text-center">
                        <div className="p-3 md:p-4 rounded-full bg-blue-100 dark:bg-blue-900 mb-3">
                          <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-medium text-base md:text-lg mb-1">Multiple Choice</h3>
                        <p className="text-xs md:text-sm text-muted-foreground">Choose the correct definition</p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 h-full">
                      <CardContent className="p-4 md:p-6 flex flex-col items-center text-center">
                        <div className="p-3 md:p-4 rounded-full bg-green-100 dark:bg-green-900 mb-3">
                          <Dumbbell className="h-5 w-5 md:h-6 md:w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="font-medium text-base md:text-lg mb-1">Fill in the Blank</h3>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          Complete sentences with the right word
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800 h-full">
                      <CardContent className="p-4 md:p-6 flex flex-col items-center text-center">
                        <div className="p-3 md:p-4 rounded-full bg-purple-100 dark:bg-purple-900 mb-3">
                          <Brain className="h-5 w-5 md:h-6 md:w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="font-medium text-base md:text-lg mb-1">Listening</h3>
                        <p className="text-xs md:text-sm text-muted-foreground">Type the word you hear</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleStartQuickPractice}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-md"
                    size="lg"
                  >
                    Start Practice <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {courses.map((course, index) => {
              const Icon = iconMap[course.icon as keyof typeof iconMap] || BookOpen

              return (
                <motion.div
                  key={course.id}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="h-full"
                >
                  <Card key={course.id} className="h-full border-none shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className={`p-2 md:p-3 rounded-lg ${course.color}`}>
                          <Icon className={`h-5 w-5 md:h-6 md:w-6 ${course.iconColor}`} />
                        </div>
                        <div className="px-2 py-1 text-xs md:text-sm rounded-full bg-muted">{course.difficulty}</div>
                      </div>
                      <CardTitle className="text-lg md:text-xl mt-2">{course.title}</CardTitle>
                      <CardDescription className="text-sm md:text-base">{course.titleVi}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm md:text-base text-muted-foreground">{course.description}</p>
                      <div className="text-sm md:text-base">
                        <p className="text-muted-foreground">Total words: {course.totalWords}</p>
                      </div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={() => handleStartCoursePractice(course.id)}
                          className="w-full h-10 md:h-11 md:text-base"
                        >
                          Practice This Course <Zap className="ml-2 h-4 w-4" />
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </TabsContent>

        <TabsContent value="history">
          <PracticeHistory />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

