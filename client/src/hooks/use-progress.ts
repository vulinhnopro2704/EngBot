"use client";

import { useVocabStore } from "@/lib/store";

export function useProgress() {
	const {
		streak,
		hearts,
		diamonds,
		dailyGoal,
		dailyProgress,
		progress,
		updateProgress,
	} = useVocabStore();

	const calculateCourseProgress = (courseId: number) => {
		const coursePrefix = `${courseId}-`;
		const courseLessons = Object.keys(progress).filter((key) =>
			key.startsWith(coursePrefix)
		);

		if (courseLessons.length === 0) return 0;

		const totalProgress = courseLessons.reduce(
			(sum, key) => sum + progress[key],
			0
		);
		return Math.round(totalProgress / courseLessons.length);
	};

	const isLessonCompleted = (courseId: number, lessonId: number) => {
		const key = `${courseId}-${lessonId}`;
		return progress[key] === 100;
	};

	const getDailyGoalProgress = () => {
		return Math.min(100, Math.round((dailyProgress / dailyGoal) * 100));
	};

	const recordActivity = (
		courseId: number,
		lessonId: number,
		activityType: string,
		points: number
	) => {
		// In a real app, we would record the activity to the server
		// For now, we&lsquo ll just update the progress
		const key = `${courseId}-${lessonId}`;
		const currentProgress = progress[key] || 0;
		const newProgress = Math.min(100, currentProgress + points);

		updateProgress(courseId, lessonId, newProgress);

		// Return the points earned
		return points;
	};

	return {
		streak,
		hearts,
		diamonds,
		dailyGoal,
		dailyProgress,
		getDailyGoalProgress,
		calculateCourseProgress,
		isLessonCompleted,
		recordActivity,
	};
}
