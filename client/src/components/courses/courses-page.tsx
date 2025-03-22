"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
	Search,
	Filter,
	ArrowUpDown,
	BookOpen,
	Briefcase,
	GraduationCap,
	Brain,
	ChevronRight,
	Clock,
	Users,
	Star,
	X,
	SlidersHorizontal,
	Sparkles,
	BookMarked,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useVocabStore } from "@/lib/store";
import { useProgress } from "@/hooks/use-progress";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
	DropdownMenuCheckboxItem,
	DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { enhancedCourses } from "@/data/enhanced-courses";
import { LoadingAnimals } from "@/components/ui/loading-animals";

// Types for filtering and sorting
type CourseLevel = "Beginner" | "Intermediate" | "Advanced" | "All Levels";
type CourseCategory =
	| "Vocabulary"
	| "Grammar"
	| "Conversation"
	| "Business"
	| "Academic"
	| "All Categories";
type SortOption =
	| "popular"
	| "newest"
	| "highest-rated"
	| "most-students"
	| "alphabetical";

export function CoursesPage() {
	const router = useRouter();
	const { setCourse, startPracticeSession } = useVocabStore();
	const { calculateCourseProgress } = useProgress();

	// State for search, filters, and sorting
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedLevel, setSelectedLevel] =
		useState<CourseLevel>("All Levels");
	const [selectedCategory, setSelectedCategory] =
		useState<CourseCategory>("All Categories");
	const [sortOption, setSortOption] = useState<SortOption>("popular");
	const [isLoading, setIsLoading] = useState(true);
	const [activeView, setActiveView] = useState<"grid" | "list">("grid");
	const [showFilters, setShowFilters] = useState(false);
	const [animalType, setAnimalType] = useState<
		"cat" | "quokka" | "hamster" | "capybara"
	>("quokka");

	// Simulate loading state
	useEffect(() => {
		// Randomly select an animal for loading animation
		const animals = ["cat", "quokka", "hamster", "capybara"] as const;
		setAnimalType(animals[Math.floor(Math.random() * animals.length)]);

		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1500);

		return () => clearTimeout(timer);
	}, []);

	// Filter courses based on search query, level, and category
	const filteredCourses = enhancedCourses.filter((course) => {
		const matchesSearch =
			course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			course.description
				.toLowerCase()
				.includes(searchQuery.toLowerCase());

		const matchesLevel =
			selectedLevel === "All Levels" || course.level === selectedLevel;
		const matchesCategory =
			selectedCategory === "All Categories" ||
			course.category === selectedCategory;

		return matchesSearch && matchesLevel && matchesCategory;
	});

	// Sort filtered courses
	const sortedCourses = [...filteredCourses].sort((a, b) => {
		switch (sortOption) {
			case "popular":
				return b.popularity - a.popularity;
			case "newest":
				return (
					new Date(b.releaseDate).getTime() -
					new Date(a.releaseDate).getTime()
				);
			case "highest-rated":
				return b.rating - a.rating;
			case "most-students":
				return b.students - a.students;
			case "alphabetical":
				return a.title.localeCompare(b.title);
			default:
				return 0;
		}
	});

	// Map icon strings to components
	const iconMap = {
		BookOpen,
		Briefcase,
		GraduationCap,
	};

	const handleCourseSelect = (courseId: number) => {
		setCourse(courseId);
		router.push(`/courses/${courseId}`);
	};

	const handlePracticeCourse = (courseId: number, e: React.MouseEvent) => {
		e.stopPropagation();
		startPracticeSession(10, courseId);
		router.push("/practice/session");
	};

	// Get color for level badge
	const getLevelColor = (level: string) => {
		switch (level) {
			case "Beginner":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
			case "Intermediate":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
			case "Advanced":
				return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
		}
	};

	// Get sort option display text
	const getSortOptionText = (option: SortOption) => {
		switch (option) {
			case "popular":
				return "Most Popular";
			case "newest":
				return "Newest First";
			case "highest-rated":
				return "Highest Rated";
			case "most-students":
				return "Most Students";
			case "alphabetical":
				return "A-Z";
		}
	};

	// Clear all filters
	const clearFilters = () => {
		setSearchQuery("");
		setSelectedLevel("All Levels");
		setSelectedCategory("All Categories");
		setSortOption("popular");
	};

	// Check if any filters are applied
	const hasActiveFilters =
		searchQuery !== "" ||
		selectedLevel !== "All Levels" ||
		selectedCategory !== "All Categories" ||
		sortOption !== "popular";

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
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="space-y-6 max-w-[1600px] mx-auto w-full"
		>
			{isLoading ? (
				<div className="flex flex-col items-center justify-center min-h-[60vh]">
					<LoadingAnimals
						type={animalType}
						text="Loading courses..."
						size="lg"
						color="blue"
					/>
				</div>
			) : (
				<>
					<div className="flex flex-col gap-4">
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
									Discover and learn from our curated language
									courses
								</p>
							</motion.div>

							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									className="md:hidden h-10"
									onClick={() => setShowFilters(!showFilters)}
								>
									<SlidersHorizontal className="h-4 w-4 mr-2" />
									Filters
								</Button>

								<Tabs
									defaultValue="grid"
									value={activeView}
									onValueChange={(v) =>
										setActiveView(v as "grid" | "list")
									}
									className="hidden md:block"
								>
									<TabsList className="h-10 md:h-11">
										<TabsTrigger
											value="grid"
											className="px-3"
										>
											<div className="grid grid-cols-2 gap-0.5 h-4 w-4 md:h-5 md:w-5">
												<div className="bg-current rounded-sm"></div>
												<div className="bg-current rounded-sm"></div>
												<div className="bg-current rounded-sm"></div>
												<div className="bg-current rounded-sm"></div>
											</div>
										</TabsTrigger>
										<TabsTrigger
											value="list"
											className="px-3"
										>
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

						<div className="flex flex-col md:flex-row gap-4">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
								<Input
									placeholder="Search courses..."
									className="pl-10 h-10 md:h-11 text-base"
									value={searchQuery}
									onChange={(e) =>
										setSearchQuery(e.target.value)
									}
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

							<div className="flex gap-2 flex-wrap md:flex-nowrap">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											className="flex items-center gap-2 h-10 md:h-11 md:text-base"
										>
											<Filter className="h-4 w-4 md:h-5 md:w-5" />
											Level:{" "}
											{selectedLevel === "All Levels"
												? "All"
												: selectedLevel}
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="end"
										className="w-56"
									>
										<DropdownMenuLabel>
											Filter by Level
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										{[
											"All Levels",
											"Beginner",
											"Intermediate",
											"Advanced",
										].map((level) => (
											<DropdownMenuCheckboxItem
												key={level}
												checked={
													selectedLevel === level
												}
												onCheckedChange={() =>
													setSelectedLevel(
														level as CourseLevel
													)
												}
											>
												{level}
											</DropdownMenuCheckboxItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>

								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											className="flex items-center gap-2 h-10 md:h-11 md:text-base"
										>
											<Filter className="h-4 w-4 md:h-5 md:w-5" />
											Category:{" "}
											{selectedCategory ===
											"All Categories"
												? "All"
												: selectedCategory}
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="end"
										className="w-56"
									>
										<DropdownMenuLabel>
											Filter by Category
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										{[
											"All Categories",
											"Vocabulary",
											"Grammar",
											"Conversation",
											"Business",
											"Academic",
										].map((category) => (
											<DropdownMenuCheckboxItem
												key={category}
												checked={
													selectedCategory ===
													category
												}
												onCheckedChange={() =>
													setSelectedCategory(
														category as CourseCategory
													)
												}
											>
												{category}
											</DropdownMenuCheckboxItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>

								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											className="flex items-center gap-2 h-10 md:h-11 md:text-base"
										>
											<ArrowUpDown className="h-4 w-4 md:h-5 md:w-5" />
											Sort:{" "}
											{getSortOptionText(sortOption)}
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="end"
										className="w-56"
									>
										<DropdownMenuLabel>
											Sort Courses
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={() =>
												setSortOption("popular")
											}
										>
											Most Popular
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() =>
												setSortOption("newest")
											}
										>
											Newest First
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() =>
												setSortOption("highest-rated")
											}
										>
											Highest Rated
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() =>
												setSortOption("most-students")
											}
										>
											Most Students
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() =>
												setSortOption("alphabetical")
											}
										>
											Alphabetical (A-Z)
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>

								{hasActiveFilters && (
									<Button
										variant="ghost"
										onClick={clearFilters}
										className="gap-2 h-10 md:h-11 md:text-base"
									>
										<X className="h-4 w-4 md:h-5 md:w-5" />{" "}
										Clear
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
									className="overflow-hidden md:hidden"
								>
									<Card className="border-dashed">
										<CardContent className="p-4 space-y-4">
											<div className="grid grid-cols-2 gap-2">
												<div className="space-y-2">
													<h3 className="text-sm font-medium">
														Level
													</h3>
													<div className="flex flex-wrap gap-2">
														{[
															"All Levels",
															"Beginner",
															"Intermediate",
															"Advanced",
														].map((level) => (
															<Badge
																key={level}
																variant={
																	selectedLevel ===
																	level
																		? "default"
																		: "outline"
																}
																className="cursor-pointer"
																onClick={() =>
																	setSelectedLevel(
																		level as CourseLevel
																	)
																}
															>
																{level}
															</Badge>
														))}
													</div>
												</div>

												<div className="space-y-2">
													<h3 className="text-sm font-medium">
														Category
													</h3>
													<div className="flex flex-wrap gap-2">
														{[
															"All",
															"Vocabulary",
															"Grammar",
															"Conversation",
															"Business",
															"Academic",
														].map((category) => (
															<Badge
																key={category}
																variant={
																	selectedCategory ===
																	(category ===
																	"All"
																		? "All Categories"
																		: category)
																		? "default"
																		: "outline"
																}
																className="cursor-pointer"
																onClick={() =>
																	setSelectedCategory(
																		category ===
																			"All"
																			? "All Categories"
																			: (category as CourseCategory)
																	)
																}
															>
																{category}
															</Badge>
														))}
													</div>
												</div>
											</div>

											<div className="space-y-2">
												<h3 className="text-sm font-medium">
													Sort By
												</h3>
												<div className="flex flex-wrap gap-2">
													{[
														{
															value: "popular",
															label: "Popular",
														},
														{
															value: "newest",
															label: "Newest",
														},
														{
															value: "highest-rated",
															label: "Top Rated",
														},
														{
															value: "most-students",
															label: "Most Students",
														},
														{
															value: "alphabetical",
															label: "A-Z",
														},
													].map((option) => (
														<Badge
															key={option.value}
															variant={
																sortOption ===
																option.value
																	? "default"
																	: "outline"
															}
															className="cursor-pointer"
															onClick={() =>
																setSortOption(
																	option.value as SortOption
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
													onClick={() =>
														setShowFilters(false)
													}
												>
													Close
												</Button>

												{hasActiveFilters && (
													<Button
														variant="ghost"
														size="sm"
														onClick={clearFilters}
														className="gap-2"
													>
														<X className="h-4 w-4" />{" "}
														Clear All
													</Button>
												)}
											</div>
										</CardContent>
									</Card>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Results summary */}
						<div className="flex justify-between items-center">
							<p className="text-sm md:text-base text-muted-foreground">
								Showing {sortedCourses.length}{" "}
								{sortedCourses.length === 1
									? "course"
									: "courses"}
								{hasActiveFilters && " with applied filters"}
							</p>

							<Tabs
								defaultValue="grid"
								value={activeView}
								onValueChange={(v) =>
									setActiveView(v as "grid" | "list")
								}
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
					</div>

					{/* Course grid or list view */}
					{sortedCourses.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<div className="bg-muted rounded-full p-4 mb-4">
								<Search className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
							</div>
							<h3 className="text-lg md:text-xl font-medium mb-2">
								No courses found
							</h3>
							<p className="text-muted-foreground max-w-md mb-6 md:text-lg">
								We couldn't find any courses matching your
								search criteria. Try adjusting your filters or
								search query.
							</p>
							<Button
								onClick={clearFilters}
								className="h-10 md:h-11 px-6 md:text-base"
							>
								Clear Filters
							</Button>
						</div>
					) : (
						<motion.div
							variants={containerVariants}
							initial="hidden"
							animate="visible"
							className={
								activeView === "grid"
									? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
									: "flex flex-col gap-4"
							}
						>
							<AnimatePresence>
								{sortedCourses.map((course, index) => {
									const progress = calculateCourseProgress(
										course.id
									);
									const Icon =
										iconMap[
											course.icon as keyof typeof iconMap
										] || BookOpen;

									return activeView === "grid" ? (
										<GridCourseCard
											key={course.id}
											course={course}
											progress={progress}
											Icon={Icon}
											index={index}
											onSelect={() =>
												handleCourseSelect(course.id)
											}
											onPractice={(e) =>
												handlePracticeCourse(
													course.id,
													e
												)
											}
											getLevelColor={getLevelColor}
										/>
									) : (
										<ListCourseCard
											key={course.id}
											course={course}
											progress={progress}
											Icon={Icon}
											index={index}
											onSelect={() =>
												handleCourseSelect(course.id)
											}
											onPractice={(e) =>
												handlePracticeCourse(
													course.id,
													e
												)
											}
											getLevelColor={getLevelColor}
										/>
									);
								})}
							</AnimatePresence>
						</motion.div>
					)}
				</>
			)}
		</motion.div>
	);
}

// Grid view course card
interface CourseCardProps {
	course: any;
	progress: number;
	Icon: React.ElementType;
	index: number;
	onSelect: () => void;
	onPractice: (e: React.MouseEvent) => void;
	getLevelColor: (level: string) => string;
}

function GridCourseCard({
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
			whileHover={{ y: -5, scale: 1.02 }}
			className="cursor-pointer h-full"
			onClick={onSelect}
			layout
		>
			<Card className="h-full overflow-hidden border-none shadow-md">
				<div className="relative">
					<div className="h-40 md:h-48 bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden">
						{course.imageUrl ? (
							<img
								src={course.imageUrl || "/placeholder.svg"}
								alt={course.title}
								className="w-full h-full object-cover transition-transform hover:scale-105"
							/>
						) : (
							<Icon className="h-16 w-16 md:h-20 md:w-20 text-primary/40" />
						)}
					</div>

					<div className="absolute top-2 right-2 flex gap-1">
						<Badge className={getLevelColor(course.level)}>
							{course.level}
						</Badge>
					</div>
				</div>

				<CardHeader className="pb-2">
					<div className="flex justify-between items-start">
						<div className={`p-2 rounded-lg ${course.color}`}>
							<Icon
								className={`h-5 w-5 md:h-6 md:w-6 ${course.iconColor}`}
							/>
						</div>
						<div className="flex items-center gap-1">
							<Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-500 fill-yellow-500" />
							<span className="text-sm md:text-base font-medium">
								{course.rating.toFixed(1)}
							</span>
						</div>
					</div>
					<CardTitle className="text-xl md:text-2xl mt-2 line-clamp-1">
						{course.title}
					</CardTitle>
					<CardDescription className="line-clamp-2 text-sm md:text-base">
						{course.description}
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					<div className="space-y-2">
						<div className="flex justify-between text-xs md:text-sm">
							<span className="text-muted-foreground">
								Progress
							</span>
							<span className="font-medium">{progress}%</span>
						</div>
						<Progress value={progress} className="h-2 md:h-3" />
					</div>

					<div className="flex gap-2">
						<Button
							className="flex-1 h-10 md:h-11 md:text-base"
							variant={progress > 0 ? "default" : "outline"}
						>
							{progress > 0 ? "Continue" : "Start"}{" "}
							<ChevronRight className="ml-1 h-4 w-4 md:h-5 md:w-5" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="h-10 w-10 md:h-11 md:w-11"
							onClick={onPractice}
							title="Practice this course"
						>
							<Brain className="h-4 w-4 md:h-5 md:w-5" />
						</Button>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}

// List view course card
function ListCourseCard({
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
					<div className="relative w-50 h-20 sm:h-auto bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden">
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
							<Badge className={getLevelColor(course.level)}>
								{course.level}
							</Badge>
						</div>
					</div>

					<div className="flex-1 p-4 md:p-6">
						<div className="flex justify-between items-start mb-2">
							<div className="flex items-center gap-2">
								<div
									className={`p-2 rounded-lg ${course.color}`}
								>
									<Icon
										className={`h-4 w-4 md:h-5 md:w-5 ${course.iconColor}`}
									/>
								</div>
								<h3 className="font-bold text-lg md:text-xl">
									{course.title}
								</h3>
							</div>
							<div className="flex items-center gap-1">
								<Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-500 fill-yellow-500" />
								<span className="text-sm md:text-base font-medium">
									{course.rating.toFixed(1)}
								</span>
							</div>
						</div>

						<p className="text-sm md:text-base text-muted-foreground mb-4 line-clamp-2">
							{course.description}
						</p>

						<div className="flex items-center gap-4">
							<div className="flex-1 space-y-1">
								<div className="flex justify-between text-xs md:text-sm">
									<span className="text-muted-foreground">
										Progress
									</span>
									<span className="font-medium">
										{progress}%
									</span>
								</div>
								<Progress
									value={progress}
									className="h-2 md:h-3"
								/>
							</div>

							<div className="flex gap-2">
								<Button
									size="sm"
									className="h-9 md:h-10 md:text-base"
									variant={
										progress > 0 ? "default" : "outline"
									}
								>
									{progress > 0 ? "Continue" : "Start"}{" "}
									<ChevronRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
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
	);
}
