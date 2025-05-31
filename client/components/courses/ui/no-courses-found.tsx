"use client"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NoCoursesFoundProps {
  clearFilters: () => void
}

export function NoCoursesFound({ clearFilters }: NoCoursesFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted rounded-full p-4 mb-4">
        <Search className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg md:text-xl font-medium mb-2">No courses found</h3>
      <p className="text-muted-foreground max-w-md mb-6 md:text-lg">
        We couldn't find any courses matching your search criteria. Try adjusting your filters or search query.
      </p>
      <Button onClick={clearFilters} className="h-10 md:h-11 px-6 md:text-base">
        Clear Filters
      </Button>
    </div>
  )
}
