"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Filter, ArrowUpDown, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
	DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import type { CourseSortOption } from "@/types/courses";

interface CourseFiltersProps {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	sortOption: CourseSortOption;
	setSortOption: (option: CourseSortOption) => void;
	showFilters: boolean;
	setShowFilters: (show: boolean) => void;
	clearFilters: () => void;
	hasActiveFilters: boolean;
}

export function CourseFilters({
	searchQuery,
	setSearchQuery,
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
			case "newest":
				return "Newest First";
			case "alphabetical":
				return "A-Z";
			default:
				return "Sort By";
		}
	};

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
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="flex items-center gap-1 sm:gap-2 h-9 sm:h-10 md:h-11 text-xs sm:text-sm md:text-base flex-1 md:flex-none justify-center"
							>
								<ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
								<span className="hidden xs:inline">
									{getSortOptionText(sortOption)}
								</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuLabel>Sort Courses</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => setSortOption("alphabetical")}
							>
								Alphabetical (A-Z)
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setSortOption("newest")}
							>
								Newest First
							</DropdownMenuItem>
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

			{/* Simplified filter panel */}
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
								<div className="space-y-2">
									<h3 className="text-xs sm:text-sm font-medium">
										Sort By
									</h3>
									<div className="flex flex-wrap gap-1 sm:gap-2">
										{[
											{
												value: "alphabetical",
												label: "A-Z",
											},
											{
												value: "newest",
												label: "Newest",
											},
										].map((option) => (
											<Badge
												key={option.value}
												variant={
													sortOption === option.value
														? "default"
														: "outline"
												}
												className="cursor-pointer text-[10px] sm:text-xs"
												onClick={() =>
													setSortOption(
														option.value as CourseSortOption
													)
												}
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
											<X className="h-3 w-3 sm:h-4 sm:w-4" />{" "}
											Clear All
										</Button>
									)}
								</div>
							</CardContent>
						</Card>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
