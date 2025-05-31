"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CourseResultsSummaryProps {
  resultCount: number
  hasActiveFilters: boolean
  activeView: "grid" | "list"
  setActiveView: (view: "grid" | "list") => void
}

export function CourseResultsSummary({
  resultCount,
  hasActiveFilters,
  activeView,
  setActiveView,
}: CourseResultsSummaryProps) {
  return (
    <div className="flex justify-between items-center">
      <p className="text-sm md:text-base text-muted-foreground">
        Showing {resultCount} {resultCount === 1 ? "course" : "courses"}
        {hasActiveFilters && " with applied filters"}
      </p>

      <Tabs
        defaultValue="grid"
        value={activeView}
        onValueChange={(v) => setActiveView(v as "grid" | "list")}
        className="md:hidden"
      >
        <TabsList className="h-9">
          <TabsTrigger value="grid" className="px-3">
            <div className="grid grid-cols-2 gap-0.5 h-4 w-4">
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
              <div className="bg-current rounded-sm"></div>
            </div>
          </TabsTrigger>
          <TabsTrigger value="list" className="px-3">
            <div className="flex flex-col gap-0.5 h-4 w-4">
              <div className="h-0.5 w-full bg-current rounded-full"></div>
              <div className="h-0.5 w-full bg-current rounded-full"></div>
              <div className="h-0.5 w-full bg-current rounded-full"></div>
            </div>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
