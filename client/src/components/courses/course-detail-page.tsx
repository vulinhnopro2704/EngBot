"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	BookOpen,
	Briefcase,
	GraduationCap,
	CheckCircle2,
	Lock,
	Brain,
	Star,
	Clock,
	Users,
	Calendar,
	Award,
	Play,
	FileText,
	Download,
	Share2,
	Heart,
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useVocabStore } from "@/lib/store";
import { useProgress } from "@/hooks/use-progress";
import { getLessonsByCourseId } from "@/data/courses";
import { enhancedCourses } from "@/data/enhanced-courses";
import { LoadingAnimals } from "@/components/ui/loading-animals";

type CourseDetailPageProps = {
	courseId: number;
};

export function CourseDetailPage({ courseId }: CourseDetailPageProps) {
	const router = useRouter();
	const { setCourse, setLesson, startPracticeSession } = useVocabStore();
	const { isLessonCompleted } = useProgress();
	const [activeTab, setActiveTab] = useState("overview");
	const [isLoading, setIsLoading] = useState(true);
	const [isBookmarked, setIsBookmarked] = useState(false);
	const [isLiked, setIsLiked] = useState(false);

	// Simulate loading state
	useEffect(() => {
		setCourse(courseId);

		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1500);

		return () => clearTimeout(timer);
	}, [courseId, setCourse]);

	const course = enhancedCourses.find((c) => c.id === courseId);
	const lessons = getLessonsByCourseId(courseId);

	// Map icon strings to components
	const iconMap = {
		BookOpen,
		Briefcase,
		GraduationCap,
	};

	const Icon = course
		? iconMap[course.icon as keyof typeof iconMap]
		: BookOpen;

	const handleLessonSelect = (lessonId: number) => {
		setLesson(lessonId);
		router.push(`/courses/${courseId}/lessons/${lessonId}`);
	};

	const handlePracticeCourse = () => {
		startPracticeSession(10, courseId);
		router.push("/practice/session");
	};

	// Determine which lessons are unlocked
	const getUnlockedStatus = (index: number) => {
		if (index === 0) return true;
		return isLessonCompleted(courseId, lessons[index - 1].id);
	};

	// Format date
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
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

	if (!course) {
		return (
			<div className="text-center py-12">
				<h2 className="text-xl">Course not found</h2>
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
			className="space-y-6"
		>
			{/* Course Header */}
			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-4">
					<Button
						variant="outline"
						size="icon"
						onClick={() => router.push("/courses")}
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div>
						<h1 className="text-2xl font-bold flex items-center gap-2">
							<Icon className={`h-6 w-6 ${course.iconColor}`} />
							{course.title}
						</h1>
						<p className="text-muted-foreground">
							{course.titleVi}
						</p>
					</div>
				</div>

				{/* Course Banner */}
				<div className="relative rounded-xl overflow-hidden">
					<div className="h-48 sm:h-64 md:h-80 bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden">
						{course.imageUrl ? (
							<img
								src={course.imageUrl || "/placeholder.svg"}
								alt={course.title}
								className="w-full h-full object-cover"
							/>
						) : (
							<Icon className="h-24 w-24 text-primary/40" />
						)}
					</div>

					<div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end">
						<div className="p-4 sm:p-6 w-full">
							<div className="flex flex-wrap gap-2 mb-2">
								<Badge
									variant="secondary"
									className="bg-blue-500/20 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
								>
									{course.level}
								</Badge>
								<Badge
									variant="secondary"
									className="bg-purple-500/20 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
								>
									{course.category}
								</Badge>
								<Badge
									variant="secondary"
									className="bg-green-500/20 text-green-700 dark:bg-green-900/50 dark:text-green-300"
								>
									{course.totalWords} words
								</Badge>
							</div>

							<div className="flex flex-wrap gap-4 text-sm text-white">
								<div className="flex items-center gap-1">
									<Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
									<span>
										{course.rating.toFixed(1)} (
										{Math.floor(course.students / 100)}{" "}
										reviews)
									</span>
								</div>
								<div className="flex items-center gap-1">
									<Users className="h-4 w-4" />
									<span>
										{course.students.toLocaleString()}{" "}
										students
									</span>
								</div>
								<div className="flex items-center gap-1">
									<Clock className="h-4 w-4" />
									<span>{course.duration}</span>
								</div>
								<div className="flex items-center gap-1">
									<Calendar className="h-4 w-4" />
									<span>
										Last updated:{" "}
										{formatDate(course.releaseDate)}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-wrap gap-3">
					<Button
						className="flex-1 sm:flex-none bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
						onClick={() => handleLessonSelect(1)}
					>
						Start Learning
					</Button>
					<Button
						variant="outline"
						className="flex-1 sm:flex-none"
						onClick={handlePracticeCourse}
					>
						<Brain className="mr-2 h-4 w-4" /> Practice Course
					</Button>
					<Button
						variant="outline"
						size="icon"
						className={
							isBookmarked
								? "text-blue-500 bg-blue-50 dark:bg-blue-950"
								: ""
						}
						onClick={() => setIsBookmarked(!isBookmarked)}
					>
						<BookMarked
							className={`h-4 w-4 ${
								isBookmarked ? "fill-blue-500" : ""
							}`}
						/>
					</Button>
					<Button
						variant="outline"
						size="icon"
						className={
							isLiked
								? "text-red-500 bg-red-50 dark:bg-red-950"
								: ""
						}
						onClick={() => setIsLiked(!isLiked)}
					>
						<Heart
							className={`h-4 w-4 ${
								isLiked ? "fill-red-500" : ""
							}`}
						/>
					</Button>
					<Button variant="outline" size="icon">
						<Share2 className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Course Content Tabs */}
			<Tabs
				defaultValue="overview"
				value={activeTab}
				onValueChange={setActiveTab}
				className="w-full"
			>
				<TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="curriculum">Curriculum</TabsTrigger>
					<TabsTrigger value="instructor">Instructor</TabsTrigger>
					<TabsTrigger value="resources" className="hidden md:block">
						Resources
					</TabsTrigger>
					<TabsTrigger value="reviews" className="hidden md:block">
						Reviews
					</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-6 pt-4">
					<div className="grid gap-6 md:grid-cols-3">
						<div className="md:col-span-2 space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>About This Course</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<p>{course.description}</p>

									<div className="grid gap-4 sm:grid-cols-2">
										<Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900">
											<CardContent className="p-4">
												<h3 className="font-medium flex items-center gap-2 mb-2">
													<Award className="h-4 w-4 text-blue-500" />{" "}
													What You &lsquo ll Learn
												</h3>
												<ul className="space-y-2 text-sm">
													{course.objectives.map(
														(objective, index) => (
															<li
																key={index}
																className="flex items-start gap-2"
															>
																<CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
																<span>
																	{objective}
																</span>
															</li>
														)
													)}
												</ul>
											</CardContent>
										</Card>

										<Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-100 dark:border-purple-900">
											<CardContent className="p-4">
												<h3 className="font-medium flex items-center gap-2 mb-2">
													<BookOpen className="h-4 w-4 text-purple-500" />{" "}
													Course Features
												</h3>
												<ul className="space-y-2 text-sm">
													{course.features.map(
														(feature, index) => (
															<li
																key={index}
																className="flex items-start gap-2"
															>
																<CheckCircle2 className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
																<span>
																	{feature}
																</span>
															</li>
														)
													)}
												</ul>
											</CardContent>
										</Card>
									</div>

									<div className="space-y-2">
										<h3 className="font-medium">
											Requirements
										</h3>
										<ul className="space-y-2 text-sm">
											{course.requirements.map(
												(requirement, index) => (
													<li
														key={index}
														className="flex items-start gap-2"
													>
														<div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
														<span>
															{requirement}
														</span>
													</li>
												)
											)}
										</ul>
									</div>

									<div className="flex flex-wrap gap-2">
										{course.tags.map((tag) => (
											<Badge
												key={tag}
												variant="outline"
												className="text-xs"
											>
												{tag}
											</Badge>
										))}
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Course Preview</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="relative rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center">
										<div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
										<Button
											variant="outline"
											size="lg"
											className="relative z-10 bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30"
										>
											<Play className="h-6 w-6 mr-2" />{" "}
											Watch Preview
										</Button>
									</div>
								</CardContent>
							</Card>
						</div>

						<div className="space-y-6">
							<Card className="sticky top-6">
								<CardContent className="p-0">
									<div className="p-6 border-b">
										<div className="flex justify-between items-center mb-4">
											<div className="text-2xl font-bold">
												Free
											</div>
											<Badge
												variant="outline"
												className="text-green-500 border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-900"
											>
												Enrolled
											</Badge>
										</div>

										<Button
											className="w-full mb-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
											onClick={() =>
												handleLessonSelect(1)
											}
										>
											Continue Learning
										</Button>

										<div className="space-y-4 text-sm">
											<div className="flex justify-between">
												<span className="text-muted-foreground">
													Progress
												</span>
												<span className="font-medium">
													{Math.round(
														Math.random() * 100
													)}
													%
												</span>
											</div>
											<Progress
												value={Math.round(
													Math.random() * 100
												)}
												className="h-2"
											/>
										</div>
									</div>

									<div className="p-6 space-y-4">
										<h3 className="font-medium">
											This course includes:
										</h3>
										<ul className="space-y-3">
											<li className="flex items-center gap-3 text-sm">
												<Clock className="h-4 w-4 text-muted-foreground" />
												<span>
													{course.duration} of content
												</span>
											</li>
											<li className="flex items-center gap-3 text-sm">
												<BookOpen className="h-4 w-4 text-muted-foreground" />
												<span>
													{course.lessons} lessons
												</span>
											</li>
											<li className="flex items-center gap-3 text-sm">
												<FileText className="h-4 w-4 text-muted-foreground" />
												<span>
													{course.totalWords}{" "}
													vocabulary words
												</span>
											</li>
											<li className="flex items-center gap-3 text-sm">
												<Download className="h-4 w-4 text-muted-foreground" />
												<span>
													Downloadable resources
												</span>
											</li>
											<li className="flex items-center gap-3 text-sm">
												<Award className="h-4 w-4 text-muted-foreground" />
												<span>
													Certificate of completion
												</span>
											</li>
										</ul>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</TabsContent>

				<TabsContent value="curriculum" className="space-y-6 pt-4">
					<Card>
						<CardHeader>
							<CardTitle>Course Curriculum</CardTitle>
							<CardDescription>
								{course.lessons} lessons • {course.totalWords}{" "}
								vocabulary words • {course.estimatedTime} total
								length
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Accordion
								type="single"
								collapsible
								className="w-full"
							>
								{course.syllabus.map((week) => (
									<AccordionItem
										key={week.weekNumber}
										value={`week-${week.weekNumber}`}
									>
										<AccordionTrigger className="hover:no-underline">
											<div className="flex items-center gap-3">
												<div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium text-sm">
													{week.weekNumber}
												</div>
												<div className="text-left">
													<div className="font-medium">
														{week.title}
													</div>
													<div className="text-xs text-muted-foreground">
														{week.topics.length}{" "}
														topics
													</div>
												</div>
											</div>
										</AccordionTrigger>
										<AccordionContent>
											<div className="pl-11 space-y-3">
												<p className="text-sm text-muted-foreground mb-4">
													{week.description}
												</p>

												{week.topics.map(
													(topic, index) => {
														const isUnlocked =
															week.weekNumber ===
																1 ||
															index === 0 ||
															Math.random() > 0.5;

														return (
															<div
																key={index}
																className="flex items-center justify-between py-2 border-b last:border-0"
															>
																<div className="flex items-center gap-3">
																	{isUnlocked ? (
																		<Play className="h-4 w-4 text-blue-500" />
																	) : (
																		<Lock className="h-4 w-4 text-muted-foreground" />
																	)}
																	<span
																		className={
																			isUnlocked
																				? ""
																				: "text-muted-foreground"
																		}
																	>
																		{topic}
																	</span>
																</div>

																<Button
																	variant={
																		isUnlocked
																			? "outline"
																			: "ghost"
																	}
																	size="sm"
																	disabled={
																		!isUnlocked
																	}
																>
																	{isUnlocked
																		? "Start"
																		: "Locked"}
																</Button>
															</div>
														);
													}
												)}
											</div>
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						</CardContent>
					</Card>

					<div className="grid gap-4 md:grid-cols-2">
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
															{lesson.titleVi}
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
				</TabsContent>

				<TabsContent value="instructor" className="space-y-6 pt-4">
					<Card>
						<CardHeader>
							<CardTitle>Meet Your Instructor</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="flex flex-col sm:flex-row gap-6">
								<div className="flex flex-col items-center sm:items-start gap-3">
									<Avatar className="w-24 h-24">
										<AvatarImage
											src={course.instructor.avatar}
											alt={course.instructor.name}
										/>
										<AvatarFallback>
											{course.instructor.name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>
									<div className="text-center sm:text-left">
										<h3 className="font-bold text-lg">
											{course.instructor.name}
										</h3>
										<p className="text-sm text-muted-foreground">
											{course.instructor.title}
										</p>
									</div>
								</div>

								<div className="flex-1 space-y-4">
									<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
										<div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
											<div className="text-xl font-bold text-blue-600 dark:text-blue-400">
												4.8
											</div>
											<div className="text-xs text-muted-foreground">
												Instructor Rating
											</div>
										</div>
										<div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
											<div className="text-xl font-bold text-green-600 dark:text-green-400">
												12
											</div>
											<div className="text-xs text-muted-foreground">
												Courses
											</div>
										</div>
										<div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg">
											<div className="text-xl font-bold text-purple-600 dark:text-purple-400">
												45K+
											</div>
											<div className="text-xs text-muted-foreground">
												Students
											</div>
										</div>
										<div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
											<div className="text-xl font-bold text-amber-600 dark:text-amber-400">
												10+
											</div>
											<div className="text-xs text-muted-foreground">
												Years Teaching
											</div>
										</div>
									</div>

									<p>{course.instructor.bio}</p>
								</div>
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-base">
											Other Courses by{" "}
											{
												course.instructor.name.split(
													" "
												)[0]
											}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<ul className="space-y-3">
											{[1, 2, 3].map((i) => (
												<li
													key={i}
													className="flex items-center gap-3"
												>
													<div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
														<BookOpen className="h-6 w-6 text-muted-foreground" />
													</div>
													<div className="flex-1 min-w-0">
														<div className="font-medium truncate">
															Advanced{" "}
															{course.category}{" "}
															Course {i}
														</div>
														<div className="flex items-center gap-1 text-xs text-muted-foreground">
															<Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
															<span>
																4.{7 + i} •{" "}
																{1000 * i}+
																students
															</span>
														</div>
													</div>
												</li>
											))}
										</ul>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-base">
											Connect with{" "}
											{
												course.instructor.name.split(
													" "
												)[0]
											}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											<p className="text-sm text-muted-foreground">
												Have questions about the course?
												Connect with the instructor
												directly.
											</p>
											<Button className="w-full">
												Message Instructor
											</Button>
											<div className="flex justify-center gap-3">
												<Button
													variant="outline"
													size="icon"
												>
													<svg
														className="h-4 w-4"
														fill="currentColor"
														viewBox="0 0 24 24"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
													</svg>
												</Button>
												<Button
													variant="outline"
													size="icon"
												>
													<svg
														className="h-4 w-4"
														fill="currentColor"
														viewBox="0 0 24 24"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
													</svg>
												</Button>
												<Button
													variant="outline"
													size="icon"
												>
													<svg
														className="h-4 w-4"
														fill="currentColor"
														viewBox="0 0 24 24"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
													</svg>
												</Button>
												<Button
													variant="outline"
													size="icon"
												>
													<svg
														className="h-4 w-4"
														fill="currentColor"
														viewBox="0 0 24 24"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
													</svg>
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="resources" className="space-y-6 pt-4">
					<Card>
						<CardHeader>
							<CardTitle>Course Resources</CardTitle>
							<CardDescription>
								Downloadable materials to enhance your learning
								experience
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-4 sm:grid-cols-2">
								{[
									{
										title: "Vocabulary Cheat Sheet",
										type: "PDF",
										size: "1.2 MB",
									},
									{
										title: "Pronunciation Guide",
										type: "PDF",
										size: "0.8 MB",
									},
									{
										title: "Practice Exercises",
										type: "PDF",
										size: "2.4 MB",
									},
									{
										title: "Audio Samples",
										type: "ZIP",
										size: "15.6 MB",
									},
								].map((resource, index) => (
									<Card
										key={index}
										className="overflow-hidden"
									>
										<div className="flex items-center p-4">
											<div className="mr-4">
												<div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
													{resource.type}
												</div>
											</div>
											<div className="flex-1 min-w-0">
												<h4 className="font-medium truncate">
													{resource.title}
												</h4>
												<p className="text-xs text-muted-foreground">
													{resource.size}
												</p>
											</div>
											<Button variant="ghost" size="icon">
												<Download className="h-4 w-4" />
											</Button>
										</div>
									</Card>
								))}
							</div>

							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-base">
										Additional Resources
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-3">
										<li className="flex items-center justify-between py-2 border-b">
											<div className="flex items-center gap-3">
												<BookOpen className="h-4 w-4 text-blue-500" />
												<span>
													Recommended Reading List
												</span>
											</div>
											<Button variant="outline" size="sm">
												View
											</Button>
										</li>
										<li className="flex items-center justify-between py-2 border-b">
											<div className="flex items-center gap-3">
												<BookOpen className="h-4 w-4 text-blue-500" />
												<span>
													Online Dictionary Resources
												</span>
											</div>
											<Button variant="outline" size="sm">
												View
											</Button>
										</li>
										<li className="flex items-center justify-between py-2">
											<div className="flex items-center gap-3">
												<BookOpen className="h-4 w-4 text-blue-500" />
												<span>Practice Websites</span>
											</div>
											<Button variant="outline" size="sm">
												View
											</Button>
										</li>
									</ul>
								</CardContent>
							</Card>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="reviews" className="space-y-6 pt-4">
					<Card>
						<CardHeader>
							<CardTitle>Student Reviews</CardTitle>
							<CardDescription>
								{course.rating.toFixed(1)} average rating •{" "}
								{Math.floor(course.students / 100)} reviews
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="flex flex-col md:flex-row gap-6">
								<div className="md:w-64 space-y-4">
									<div className="text-center">
										<div className="text-5xl font-bold">
											{course.rating.toFixed(1)}
										</div>
										<div className="flex justify-center mt-2">
											{[1, 2, 3, 4, 5].map((star) => (
												<Star
													key={star}
													className={`h-5 w-5 ${
														star <=
														Math.round(
															course.rating
														)
															? "text-yellow-500 fill-yellow-500"
															: "text-gray-300 dark:text-gray-600"
													}`}
												/>
											))}
										</div>
										<div className="text-sm text-muted-foreground mt-1">
											Course Rating
										</div>
									</div>

									<div className="space-y-2">
										{[5, 4, 3, 2, 1].map((rating) => {
											const percentage =
												rating === 5
													? 68
													: rating === 4
													? 22
													: rating === 3
													? 7
													: rating === 2
													? 2
													: 1;
											return (
												<div
													key={rating}
													className="flex items-center gap-2"
												>
													<div className="flex items-center gap-1 w-16">
														<Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
														<span className="text-sm">
															{rating}
														</span>
													</div>
													<div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
														<div
															className="h-full bg-yellow-500 rounded-full"
															style={{
																width: `${percentage}%`,
															}}
														></div>
													</div>
													<div className="text-xs text-muted-foreground w-8 text-right">
														{percentage}%
													</div>
												</div>
											);
										})}
									</div>
								</div>

								<div className="flex-1 space-y-6">
									{[
										{
											name: "Alex Johnson",
											avatar: "/placeholder.svg?height=40&width=40&text=AJ",
											rating: 5,
											date: "2 weeks ago",
											comment:
												"This course exceeded my expectations! The vocabulary is presented in a clear, engaging way, and the interactive exercises really helped me retain what I learned. The instructor's pronunciation guides were especially helpful.",
										},
										{
											name: "Maria Garcia",
											avatar: "/placeholder.svg?height=40&width=40&text=MG",
											rating: 5,
											date: "1 month ago",
											comment:
												"As a beginner in English, I found this course to be exactly what I needed. The pace is perfect, and I appreciate how the vocabulary is organized by themes. The flashcards and practice exercises are excellent for reinforcement.",
										},
										{
											name: "David Kim",
											avatar: "/placeholder.svg?height=40&width=40&text=DK",
											rating: 4,
											date: "2 months ago",
											comment:
												"Great course overall. The content is well-structured and the examples are relevant to everyday situations. I would have liked more pronunciation practice, but otherwise it's excellent for building a solid vocabulary foundation.",
										},
									].map((review, index) => (
										<Card key={index}>
											<CardContent className="p-4">
												<div className="flex justify-between items-start mb-4">
													<div className="flex items-center gap-3">
														<Avatar>
															<AvatarImage
																src={
																	review.avatar
																}
																alt={
																	review.name
																}
															/>
															<AvatarFallback>
																{review.name
																	.split(" ")
																	.map(
																		(n) =>
																			n[0]
																	)
																	.join("")}
															</AvatarFallback>
														</Avatar>
														<div>
															<div className="font-medium">
																{review.name}
															</div>
															<div className="text-xs text-muted-foreground">
																{review.date}
															</div>
														</div>
													</div>
													<div className="flex">
														{[1, 2, 3, 4, 5].map(
															(star) => (
																<Star
																	key={star}
																	className={`h-4 w-4 ${
																		star <=
																		review.rating
																			? "text-yellow-500 fill-yellow-500"
																			: "text-gray-300 dark:text-gray-600"
																	}`}
																/>
															)
														)}
													</div>
												</div>
												<p className="text-sm">
													{review.comment}
												</p>
											</CardContent>
										</Card>
									))}

									<Button
										variant="outline"
										className="w-full"
									>
										Load More Reviews
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</motion.div>
	);
}
