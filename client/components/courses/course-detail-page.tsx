"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, CheckCircle2, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVocabStore } from "@/lib/store";
import { useCourseStore } from "@/lib/store/course-store"; // Import course store
import { useProgress } from "@/hooks/use-progress";
import { LoadingAnimals } from "@/components/ui/loading-animals";
import { getLessonsByCourseId } from "@/service/lesson";
import { Lesson } from "@/types/lessons";
import { Course } from "@/types/courses";

type CourseDetailPageProps = {
	courseId: number;
};

export function CourseDetailPage({ courseId }: CourseDetailPageProps) {
	const router = useRouter();
	const { setCourse, setLesson } = useVocabStore();
	const { isLessonCompleted } = useProgress();
	const [isLoading, setIsLoading] = useState(true);
	const [lessons, setLessons] = useState<Lesson[]>([]);
	const [courseData, setCourseData] = useState<Course | null>(null);
	const [error, setError] = useState<string | null>(null);

	// Fetch course and lessons data
	useEffect(() => {
		setCourse(courseId);
		setIsLoading(true);

		const fetchData = async () => {
			try {
				// Fetch course details
				const course = await useCourseStore
					.getState()
					.fetchCourseById(courseId);
				setCourseData(course);

				// Fetch lessons
				const lessonsData = await getLessonsByCourseId(
					courseId.toString()
				);
				setLessons(lessonsData);
				setError(null);
			} catch (err) {
				console.error("Failed to fetch data:", err);
				setError("Failed to load course data. Please try again later.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [courseId, setCourse]);

	const handleLessonSelect = (lessonId: number) => {
		setLesson(lessonId);
		router.push(`/courses/${courseId}/lessons/${lessonId}`);
	};

	// Determine which lessons are unlocked
	const getUnlockedStatus = (index: number) => {
		if (index === 0) return true;
		return isLessonCompleted(courseId, lessons[index - 1].id);
	};

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh]">
				<LoadingAnimals
					type="hamster"
					text="Loading course details..."
					size="lg"
					color="blue"
				/>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-12">
				<h2 className="text-xl text-red-500">{error}</h2>
				<Button
					variant="outline"
					className="mt-4"
					onClick={() => router.push("/courses")}
				>
					Back to Courses
				</Button>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="space-y-6 max-w-4xl mx-auto px-4"
		>
			{/* Simple Course Header */}
			<div className="flex items-center gap-4 py-4">
				<Button
					variant="outline"
					size="icon"
					onClick={() => router.push("/courses")}
				>
					<ArrowLeft className="h-4 w-4" />
				</Button>
				<div>
					<h1 className="text-2xl font-bold flex items-center gap-2">
						{courseData?.icon && (
							<span className="mr-2">{courseData.icon}</span>
						)}
						{courseData?.title || "Loading..."}
					</h1>
					<p className="text-muted-foreground">
						{courseData?.description || ""}
					</p>
					{courseData?.enTitle && (
						<p className="text-sm text-muted-foreground mt-1">
							<span className="font-medium">English title:</span>{" "}
							{courseData.enTitle}
						</p>
					)}
				</div>
			</div>

			{/* Course Image if available */}
			{courseData?.image && (
				<div className="rounded-lg overflow-hidden">
					<img
						src={courseData.image}
						alt={courseData.title}
						className="w-full h-[200px] object-cover"
					/>
				</div>
			)}

			{/* Lessons List */}
			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Lessons</h2>
				{lessons.length === 0 ? (
					<p className="text-muted-foreground">
						No lessons available for this course yet.
					</p>
				) : (
					<div className="grid gap-4">
						{lessons.map((lesson, index) => {
							const isCompleted = isLessonCompleted(
								courseId,
								lesson.id
							);
							const isUnlocked = getUnlockedStatus(index);

							return (
								<motion.div
									key={lesson.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{
										duration: 0.3,
										delay: index * 0.1,
									}}
								>
									<Card
										className={
											isUnlocked ? "" : "opacity-70"
										}
									>
										<CardContent className="p-6">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-4">
													<div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-medium">
														{lesson.id}
													</div>
													<div>
														<h3 className="font-medium">
															{lesson.title}
														</h3>
														<p className="text-sm text-muted-foreground">
															{lesson.description ||
																`Lesson ${lesson.id}`}
														</p>
													</div>
												</div>

												<div className="flex items-center gap-2">
													{isCompleted && (
														<div className="flex items-center text-green-500 mr-2">
															<CheckCircle2 className="h-5 w-5" />
														</div>
													)}

													{isUnlocked ? (
														<Button
															onClick={() =>
																handleLessonSelect(
																	lesson.id
																)
															}
															variant={
																isCompleted
																	? "outline"
																	: "default"
															}
														>
															{isCompleted
																? "Review"
																: "Start"}
														</Button>
													) : (
														<Button
															variant="outline"
															disabled
															className="flex items-center gap-2"
														>
															<Lock className="h-4 w-4" />{" "}
															Locked
														</Button>
													)}
												</div>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							);
						})}
					</div>
				)}
			</div>
		</motion.div>
	);
}
