import { apiGet } from "@/lib/api-client";
import { ENDPOINTS } from "@/lib/endpoint";
import { Lesson } from "@/types/lessons";
import { Word } from "@/types/words";

export const getLessonsByCourseId = async (
	courseId: string | number
): Promise<Lesson[]> => {
	try {
		const courseIdStr = courseId.toString();
		const response = await apiGet<Lesson[]>(
			`${ENDPOINTS.LESSON.LESSONS_BY_COURSE(courseIdStr)}`
		);
		return response;
	} catch (error) {
		console.error("Failed to fetch lessons for course:", error);
		throw error;
	}
};

export const getWordsByLessonId = async (
	lessonId: string | number
): Promise<Word[]> => {
	try {
		const lessonIdStr = lessonId.toString();
		const response = await apiGet<Word[]>(
			ENDPOINTS.LESSON.WORDS(lessonIdStr)
		);
		return response;
	} catch (error) {
		console.error("Failed to fetch words for lesson:", error);
		throw error;
	}
};

export const getLessonById = async (
	lessonId: string | number
): Promise<Lesson> => {
	try {
		const lessonIdStr = lessonId.toString();
		const response = await apiGet<Lesson>(ENDPOINTS.LESSON.ID(lessonIdStr));
		return response;
	} catch (error) {
		console.error("Failed to fetch lesson details:", error);
		throw error;
	}
};
