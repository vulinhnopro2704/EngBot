"use client";

import { motion } from "framer-motion";
import { Brain, ChevronRight } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Course } from "@/types/courses";

interface GridCourseCardProps {
	course: Course;
	progress: number;
	index: number;
	onSelect: () => void;
	onPractice: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function GridCourseCard({
	course,
	progress,
	index,
	onSelect,
	onPractice,
}: GridCourseCardProps) {
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
					<div className="h-32 xs:h-36 sm:h-40 md:h-48 bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden">
						{course.image ? (
							<img
								src={course.image || "/placeholder.svg"}
								alt={course.title}
								className="w-full h-full object-cover transition-transform hover:scale-105"
							/>
						) : (
							<div className="h-12 w-12 xs:h-14 xs:w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 text-primary/40 flex items-center justify-center">
								{course.icon || "📚"}
							</div>
						)}
					</div>
				</div>

				<CardHeader className="pb-1 sm:pb-2 p-3 sm:p-4">
					<CardTitle className="text-base xs:text-lg sm:text-xl md:text-2xl mt-1 sm:mt-2 line-clamp-1">
						{course.title}
					</CardTitle>
					<CardDescription className="line-clamp-2 text-xs xs:text-sm md:text-base">
						{course.description}
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 pt-0 sm:pt-0">
					<div className="space-y-1 sm:space-y-2">
						<div className="flex justify-between text-[10px] xs:text-xs md:text-sm">
							<span className="text-muted-foreground">
								Progress
							</span>
							<span className="font-medium">{progress}%</span>
						</div>
						<Progress
							value={progress}
							className="h-1.5 xs:h-2 md:h-3"
						/>
					</div>

					<div className="flex gap-2">
						<Button
							className="flex-1 h-8 xs:h-9 sm:h-10 md:h-11 text-xs xs:text-sm md:text-base"
							variant={progress > 0 ? "default" : "outline"}
						>
							{progress > 0 ? "Continue" : "Start"}{" "}
							<ChevronRight className="ml-1 h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10 md:h-11 md:w-11"
							onClick={onPractice}
							title="Practice this course"
						>
							<Brain className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
						</Button>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
