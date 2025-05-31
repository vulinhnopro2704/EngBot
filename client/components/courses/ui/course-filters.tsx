"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Filter, ArrowUpDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import type { CourseCategory, CourseLevel, CourseSortOption } from "@/types/courses"

interface CourseFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedLevel: CourseLevel
  setSelectedLevel: (level: CourseLevel) => void
  selectedCategory: CourseCategory
  setSelectedCategory: (category: CourseCategory) => void
  sortOption: CourseSortOption
  setSortOption: (option: CourseSortOption) => void
  showFilters: boolean
  setShowFilters: (show: boolean) => void
  clearFilters: () => void
  hasActiveFilters: boolean
}

export function CourseFilters({
  searchQuery,
  setSearchQuery,
  selectedLevel,
  setSelectedLevel,
  selectedCategory,
  setSelectedCategory,
  sortOption,
  setSortOption,
  showFilters,
  setShowFilters,
  clearFilters,
  hasActiveFilters,
}: CourseFiltersProps) {
  // Get sort option display text
  const getSortOptionText = (option: CourseSortOption) => {
    switch (option) {
      case "popular":
        return "Most Popular"
      case "newest":
        return "Newest First"
      case "highest-rated":
        return "Highest Rated"
      case "most-students":
        return "Most Students"
      case "alphabetical":
        return "A-Z"
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-8 sm:pl-10 h-9 sm:h-10 md:h-11 text-sm sm:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap md:flex-nowrap">
          <Button
            variant="outline"
            className="flex items-center gap-1 sm:gap-2 h-9 sm:h-10 md:h-11 text-xs sm:text-sm md:text-base flex-1 md:flex-none justify-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
            <span className="hidden xs:inline">Filters</span>
            {hasActiveFilters && (
              <span className="bg-primary text-primary-foreground rounded-full h-4 w-4 sm:h-5 sm:w-5 text-[10px] sm:text-xs flex items-center justify-center">
                !
              </span>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-1 sm:gap-2 h-9 sm:h-10 md:h-11 text-xs sm:text-sm md:text-base flex-1 md:flex-none justify-center"
              >
                <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                <span className="hidden xs:inline">Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Sort Courses</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortOption("popular")}>Most Popular</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("newest")}>Newest First</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("highest-rated")}>Highest Rated</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("most-students")}>Most Students</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("alphabetical")}>Alphabetical (A-Z)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="gap-1 sm:gap-2 h-9 sm:h-10 md:h-11 text-xs sm:text-sm md:text-base"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              <span className="hidden xs:inline">Clear</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="border-dashed">
              <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <h3 className="text-xs sm:text-sm font-medium">Level</h3>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {["All Levels", "Beginner", "Intermediate", "Advanced"].map((level) => (
                        <Badge
                          key={level}
                          variant={selectedLevel === level ? "default" : "outline"}
                          className="cursor-pointer text-[10px] sm:text-xs"
                          onClick={() => setSelectedLevel(level as CourseLevel)}
                        >
                          {level}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs sm:text-sm font-medium">Category</h3>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {["All", "Vocabulary", "Grammar", "Conversation", "Business", "Academic"].map((category) => (
                        <Badge
                          key={category}
                          variant={
                            selectedCategory === (category === "All" ? "All Categories" : category)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer text-[10px] sm:text-xs"
                          onClick={() =>
                            setSelectedCategory(category === "All" ? "All Categories" : (category as CourseCategory))
                          }
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs sm:text-sm font-medium">Sort By</h3>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {[
                      { value: "popular", label: "Popular" },
                      { value: "newest", label: "Newest" },
                      { value: "highest-rated", label: "Top Rated" },
                      { value: "most-students", label: "Most Students" },
                      { value: "alphabetical", label: "A-Z" },
                    ].map((option) => (
                      <Badge
                        key={option.value}
                        variant={sortOption === option.value ? "default" : "outline"}
                        className="cursor-pointer text-[10px] sm:text-xs"
                        onClick={() => setSortOption(option.value as CourseSortOption)}
                      >
                        {option.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                    className="text-xs sm:text-sm h-8 sm:h-9"
                  >
                    Close
                  </Button>

                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9"
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4" /> Clear All
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Import the Search icon
import { Search } from "lucide-react"
