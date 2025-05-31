"use client"

import { motion } from "framer-motion"
import { BookMarked, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CourseHeaderProps {
  activeView: "grid" | "list"
  setActiveView: (view: "grid" | "list") => void
  setShowFilters: (show: boolean) => void
  showFilters: boolean
}

export function CourseHeader({ activeView, setActiveView, setShowFilters, showFilters }: CourseHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-1"
      >
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <BookMarked className="h-6 w-6 md:h-7 md:w-7 text-blue-500" />
          <span>Explore Courses</span>
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
          Discover and learn from our curated English courses with Engbot
        </p>
      </motion.div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="md:hidden h-10" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
        </Button>

        <Tabs
          defaultValue="grid"
          value={activeView}
          onValueChange={(v) => setActiveView(v as "grid" | "list")}
          className="hidden md:block"
        >
          <TabsList className="h-10 md:h-11">
            <TabsTrigger value="grid" className="px-3">
              <div className="grid grid-cols-2 gap-0.5 h-4 w-4 md:h-5 md:w-5">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </TabsTrigger>
            <TabsTrigger value="list" className="px-3">
              <div className="flex flex-col gap-0.5 h-4 w-4 md:h-5 md:w-5">
                <div className="h-0.5 w-full bg-current rounded-full"></div>
                <div className="h-0.5 w-full bg-current rounded-full"></div>
                <div className="h-0.5 w-full bg-current rounded-full"></div>
              </div>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}

// Import the SlidersHorizontal icon
import { SlidersHorizontal } from "lucide-react"
