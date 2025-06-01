"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useVocabStore } from "@/lib/store";
import { useProgress } from "@/hooks/use-progress";
import { LoadingAnimals } from "@/components/ui/loading-animals";
import { CourseHeader } from "@/components/courses/ui/course-header";
import { CourseFilters } from "@/components/courses/ui/course-filters";
import { CourseResultsSummary } from "@/components/courses/ui/course-results-summary";
import { NoCoursesFound } from "@/components/courses/ui/no-courses-found";
import { GridCourseCard } from "@/components/courses/ui/course-card-grid";
import { ListCourseCard } from "@/components/courses/ui/course-card-list";
import type { CourseSortOption } from "@/types/courses";
import { useCourseStore } from "@/lib/store/course-store";

// Loading animal types
type AnimalType = "cat" | "quokka" | "hamster" | "capybara";
// View types
type ViewType = "grid" | "list";

export function CoursesPage() {
	const router = useRouter();
	const { setCourse, startPracticeSession } = useVocabStore();
	const { calculateCourseProgress } = useProgress();

	// State for search, filters, and sorting
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [sortOption, setSortOption] =
		useState<CourseSortOption>("alphabetical");
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [activeView, setActiveView] = useState<ViewType>("grid");
	const [showFilters, setShowFilters] = useState<boolean>(false);
	const [animalType, setAnimalType] = useState<AnimalType>("quokka");
	const {
		courses,
		fetchAllCourses,
		isLoading: isFetchingCourses,
	} = useCourseStore();

	useEffect(() => {
		// Fetch all courses on mount
		fetchAllCourses();
	}, []);

	// Simulate loading state
	useEffect(() => {
		// Randomly select an animal for loading animation
		const animals: readonly AnimalType[] = [
			"cat",
			"quokka",
			"hamster",
			"capybara",
		] as const;
		setAnimalType(animals[Math.floor(Math.random() * animals.length)]);

		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1500);

		return () => clearTimeout(timer);
	}, []);

	// Filter courses based on search query
	const filteredCourses = courses.filter((course) => {
		const matchesSearch =
			course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			course.description
				?.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			"";

		return matchesSearch;
	});

	// Sort filtered courses
	const sortedCourses = [...filteredCourses].sort((a, b) => {
		switch (sortOption) {
			case "alphabetical":
				return (a.title || "").localeCompare(b.title || "");
			case "newest":
				return (
					new Date(b.createdAt || Date.now()).getTime() -
					new Date(a.createdAt || Date.now()).getTime()
				);
			default:
				return 0;
		}
	});

	const handleCourseSelect = (courseId: number): void => {
		setCourse(courseId);
		router.push(`/courses/${courseId}`);
	};

	const handlePracticeCourse = (
		courseId: number,
		e: React.MouseEvent<HTMLButtonElement>
	): void => {
		e.stopPropagation();
		startPracticeSession(10, courseId);
		router.push("/practice/session");
	};

	// Clear all filters
	const clearFilters = (): void => {
		setSearchQuery("");
		setSortOption("alphabetical");
	};

	// Check if any filters are applied
	const hasActiveFilters: boolean =
		searchQuery !== "" || sortOption !== "alphabetical";

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
			className="space-y-4 sm:space-y-6 max-w-[1600px] mx-auto w-full px-1 sm:px-0"
		>
			{isLoading || isFetchingCourses ? (
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
									const progress = calculateCourseProgress(
										course.id
									);

									return activeView === "grid" ? (
										<GridCourseCard
											key={course.id}
											course={course}
											progress={progress}
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
										/>
									) : (
										<ListCourseCard
											key={course.id}
											course={course}
											progress={progress}
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
