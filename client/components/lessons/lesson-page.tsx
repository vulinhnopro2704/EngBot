"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useVocabStore } from "@/lib/store";
import { useProgress } from "@/hooks/use-progress";
import { useAudio } from "@/hooks/use-audio";
import { LoadingAnimals } from "@/components/ui/loading-animals";
import { GamifiedFlashcardModule } from "@/components/learning-modules/gamified-flashcard-module";
import { ListeningModule } from "@/components/learning-modules/listening-module";
import { FillBlankModule } from "@/components/learning-modules/fill-blank-module";
import { LessonHeader } from "@/components/lessons/ui/lesson-header";
import { LessonTabs } from "@/components/lessons/ui/lesson-tabs";
import { getLessonById, getWordsByLessonId } from "@/service/lesson";
import { submitLessonWords } from "@/service/word";
import type { LessonPageProps } from "@/types/lessons";
import { Word } from "@/types/words";
import { toast } from "sonner";

export function LessonPage({ courseId, lessonId }: LessonPageProps) {
	const router = useRouter();
	const { setCourse, setLesson, startPracticeSession } = useVocabStore();
	const { recordActivity } = useProgress();
	const { playAudio } = useAudio();
	const [isLoading, setIsLoading] = useState(true);
	const [words, setWords] = useState<Word[]>([]);
	const [lessonTitle, setLessonTitle] = useState("");
	const [lessonData, setLessonData] = useState<any>(null);
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		setCourse(courseId);
		setLesson(lessonId);

		const fetchLessonData = async () => {
			try {
				setIsLoading(true);

				// Fetch lesson details
				const fetchedLesson = await getLessonById(lessonId);
				setLessonData(fetchedLesson);

				// Set lesson title
				setLessonTitle(fetchedLesson?.title || `Lesson ${lessonId}`);

				// Fetch words for this lesson
				const lessonWords = await getWordsByLessonId(lessonId);
				setWords(lessonWords);
			} catch (err) {
				console.error("Error fetching lesson data:", err);
				setError("Failed to load lesson content. Please try again.");
				toast.error("Failed to load lesson content");
			} finally {
				setIsLoading(false);
			}
		};

		fetchLessonData();
	}, [courseId, lessonId, setCourse, setLesson]);

	const handleTabChange = (value: string) => {
		// Record activity when changing tabs
		recordActivity(courseId, lessonId, `viewed_${value}`, 1);
		playAudio("/sounds/tab-change.mp3");
	};

	const handlePracticeLesson = () => {
		startPracticeSession(10, courseId, lessonId);
		router.push("/practice/session");
	};

	const handleCompleteLesson = async () => {
		try {
			setIsSubmitting(true);
			await submitLessonWords(lessonId, words);
			toast.success("Lesson completed successfully!");
			recordActivity(courseId, lessonId, "completed_lesson", 5);
			playAudio("/sounds/success.mp3");

			// Optionally navigate to a completion screen or back to course
			// router.push(`/courses/${courseId}`);
		} catch (error) {
			console.error("Error submitting lesson words:", error);
			toast.error("Failed to complete lesson. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh]">
				<LoadingAnimals
					type="capybara"
					text="Loading lesson content..."
					size="lg"
					color="indigo"
				/>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
				<h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
				<p className="text-gray-700 mb-4">{error}</p>
				<button
					onClick={() => window.location.reload()}
					className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
				>
					Try Again
				</button>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="space-y-6 max-w-4xl mx-auto"
		>
			<LessonHeader
				lessonTitle={lessonTitle}
				lesson={lessonData}
				onPracticeLesson={handlePracticeLesson}
			/>

			<LessonTabs
				onTabChange={handleTabChange}
				flashcardsContent={
					<GamifiedFlashcardModule
						courseId={courseId}
						lessonId={lessonId}
						words={words}
					/>
				}
				listeningContent={
					<ListeningModule
						courseId={courseId}
						lessonId={lessonId}
						words={words}
					/>
				}
				fillBlankContent={
					<FillBlankModule
						courseId={courseId}
						lessonId={lessonId}
						words={words}
					/>
				}
			/>

			<div className="flex justify-center mt-8 mb-12">
				<button
					onClick={handleCompleteLesson}
					disabled={isSubmitting}
					className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
				>
					{isSubmitting ? (
						<>
							<span className="animate-spin mr-2">⏳</span>
							Completing...
						</>
					) : (
						"Complete Lesson"
					)}
				</button>
			</div>
		</motion.div>
	);
}
