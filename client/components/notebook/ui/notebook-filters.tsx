"use client"
import { Search, Filter, SortAsc, SortDesc, X, GraduationCap, Brain } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { WordType, CEFRLevel, MemorizationLevel } from "@/types/vocabulary"

interface NotebookFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  filterType: WordType | "all"
  setFilterType: (type: WordType | "all") => void
  filterCEFR: CEFRLevel | "all"
  setFilterCEFR: (cefr: CEFRLevel | "all") => void
  filterLevel: MemorizationLevel | "all"
  setFilterLevel: (level: MemorizationLevel | "all") => void
  sortOrder: "asc" | "desc"
  setSortOrder: (order: "asc" | "desc") => void
  wordTypeCount: Record<string, number>
  cefrLevelCount: Record<string, number>
  memorizationLevelCount: Record<string, number>
  totalEntries: number
  clearFilters: () => void
  hasActiveFilters: boolean
}

export function NotebookFilters({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  filterCEFR,
  setFilterCEFR,
  filterLevel,
  setFilterLevel,
  sortOrder,
  setSortOrder,
  wordTypeCount,
  cefrLevelCount,
  memorizationLevelCount,
  totalEntries,
  clearFilters,
  hasActiveFilters,
}: NotebookFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search words or definitions..."
          className="pl-10 h-10 md:h-11 text-base"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 h-10 md:h-11 md:text-base">
              <Filter className="h-4 w-4 md:h-5 md:w-5" />
              {filterType === "all" ? "All Types" : filterType}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => setFilterType("all")}>All Types ({totalEntries})</DropdownMenuItem>
            {Object.entries(wordTypeCount).map(([type, count]) => (
              <DropdownMenuItem key={type} onClick={() => setFilterType(type as WordType)}>
                {type} ({count})
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 h-10 md:h-11 md:text-base">
              <GraduationCap className="h-4 w-4 md:h-5 md:w-5" />
              {filterCEFR === "all" ? "All CEFR" : filterCEFR}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => setFilterCEFR("all")}>All CEFR Levels</DropdownMenuItem>
            {["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => (
              <DropdownMenuItem key={level} onClick={() => setFilterCEFR(level as CEFRLevel)}>
                {level} ({cefrLevelCount[level] || 0})
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 h-10 md:h-11 md:text-base">
              <Brain className="h-4 w-4 md:h-5 md:w-5" />
              {filterLevel === "all" ? "All Levels" : `Level ${filterLevel}`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => setFilterLevel("all")}>All Levels</DropdownMenuItem>
            {[1, 2, 3, 4, 5].map((level) => (
              <DropdownMenuItem key={level} onClick={() => setFilterLevel(level as MemorizationLevel)}>
                Level {level} ({memorizationLevelCount[level.toString()] || 0})
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 md:h-11 md:w-11"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          title={sortOrder === "asc" ? "Sort Descending" : "Sort Ascending"}
        >
          {sortOrder === "asc" ? (
            <SortAsc className="h-4 w-4 md:h-5 md:w-5" />
          ) : (
            <SortDesc className="h-4 w-4 md:h-5 md:w-5" />
          )}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} className="gap-2 h-10 md:h-11 md:text-base">
            <X className="h-4 w-4 md:h-5 md:w-5" /> Clear
          </Button>
        )}
      </div>
    </div>
  )
}
