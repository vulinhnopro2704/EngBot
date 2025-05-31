"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useVocabStore } from "@/lib/store"
import { useProgress } from "@/hooks/use-progress"
import { LoadingAnimals } from "@/components/ui/loading-animals"
import { CourseHeader } from "@/components/courses/ui/course-header"
import { CourseFilters } from "@/components/courses/ui/course-filters"
import { CourseResultsSummary } from "@/components/courses/ui/course-results-summary"
import { NoCoursesFound } from "@/components/courses/ui/no-courses-found"
import { GridCourseCard } from "@/components/courses/ui/course-card-grid"
import { ListCourseCard } from "@/components/courses/ui/course-card-list"
import { enhancedCourses } from "@/data/enhanced-courses"
import type { CourseCategory, CourseLevel, CourseSortOption } from "@/types/courses"

export function CoursesPage() {
  const router = useRouter()
  const { setCourse, startPracticeSession } = useVocabStore()
  const { calculateCourseProgress } = useProgress()

  // State for search, filters, and sorting
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel>("All Levels")
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory>("All Categories")
  const [sortOption, setSortOption] = useState<CourseSortOption>("popular")
  const [isLoading, setIsLoading] = useState(true)
  const [activeView, setActiveView] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [animalType, setAnimalType] = useState<"cat" | "quokka" | "hamster" | "capybara">("quokka")

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

  // Filter courses based on search query, level, and category
  const filteredCourses = enhancedCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesLevel = selectedLevel === "All Levels" || course.level === selectedLevel
    const matchesCategory = selectedCategory === "All Categories" || course.category === selectedCategory

    return matchesSearch && matchesLevel && matchesCategory
  })

  // Sort filtered courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortOption) {
      case "popular":
        return (b.popularity || 0) - (a.popularity || 0)
      case "newest":
        return new Date(b.releaseDate || "").getTime() - new Date(a.releaseDate || "").getTime()
      case "highest-rated":
        return 0 // Removed rating field
      case "most-students":
        return 0 // Removed students field
      case "alphabetical":
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  const handleCourseSelect = (courseId: number) => {
    setCourse(courseId)
    router.push(`/courses/${courseId}`)
  }

  const handlePracticeCourse = (courseId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    startPracticeSession(10, courseId)
    router.push("/practice/session")
  }

  // Get color for level badge
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Advanced":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setSelectedLevel("All Levels")
    setSelectedCategory("All Categories")
    setSortOption("popular")
  }

  // Check if any filters are applied
  const hasActiveFilters =
    searchQuery !== "" ||
    selectedLevel !== "All Levels" ||
    selectedCategory !== "All Categories" ||
    sortOption !== "popular"

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 sm:space-y-6 max-w-[1600px] mx-auto w-full px-1 sm:px-0"
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <LoadingAnimals type={animalType} text="Loading courses..." size="lg" color="blue" />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:gap-4">
            <CourseHeader
              activeView={activeView}
              setActiveView={setActiveView}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
            />

            <CourseFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedLevel={selectedLevel}
              setSelectedLevel={setSelectedLevel}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortOption={sortOption}
              setSortOption={setSortOption}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              clearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />

            <CourseResultsSummary
              resultCount={sortedCourses.length}
              hasActiveFilters={hasActiveFilters}
              activeView={activeView}
              setActiveView={setActiveView}
            />
          </div>

          {/* Course grid or list view */}
          {sortedCourses.length === 0 ? (
            <NoCoursesFound clearFilters={clearFilters} />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={
                activeView === "grid"
                  ? "grid gap-4 sm:gap-6 grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                  : "flex flex-col gap-3 sm:gap-4"
              }
            >
              <AnimatePresence>
                {sortedCourses.map((course, index) => {
                  const progress = calculateCourseProgress(course.id)

                  return activeView === "grid" ? (
                    <GridCourseCard
                      key={course.id}
                      course={course}
                      progress={progress}
                      Icon={course.Icon}
                      index={index}
                      onSelect={() => handleCourseSelect(course.id)}
                      onPractice={(e) => handlePracticeCourse(course.id, e)}
                      getLevelColor={getLevelColor}
                    />
                  ) : (
                    <ListCourseCard
                      key={course.id}
                      course={course}
                      progress={progress}
                      Icon={course.Icon}
                      index={index}
                      onSelect={() => handleCourseSelect(course.id)}
                      onPractice={(e) => handlePracticeCourse(course.id, e)}
                      getLevelColor={getLevelColor}
                    />
                  )
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  )
}
