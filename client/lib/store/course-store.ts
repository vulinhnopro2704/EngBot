import { create } from "zustand";
import { apiGet } from "../api-client";
import { ENDPOINTS } from "../endpoint";
import { Course } from "@/types/courses";

interface CourseState {
	courses: Course[];
	userCourses: Course[];
	selectedCourseId: number | null;
	isLoading: boolean;
	error: string | null;
}

interface CourseActions {
	fetchAllCourses: () => Promise<void>;
	fetchUserCourses: () => Promise<void>;
	fetchCourseById: (courseId: number) => Promise<Course | null>; // Added this line
	setCourse: (courseId: number) => void;
	startPracticeSession: (wordCount: number, courseId: number) => void;
}

// Combine the interfaces to create the store type
type CourseStore = CourseState & CourseActions;

export const useCourseStore = create<CourseStore>((set) => ({
	// Initial state
	courses: [],
	userCourses: [],
	selectedCourseId: null,
	isLoading: false,
	error: null,

	// Actions
	fetchAllCourses: async (): Promise<void> => {
		try {
			set({ isLoading: true, error: null });
			const response = await apiGet<Course[]>(
				ENDPOINTS.COURSE.ALL_COURSES
			);
			console.log("Fetched courses:", response);
			set({ courses: response, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error:
					error instanceof Error
						? error.message
						: "Failed to fetch courses",
			});
		}
	},

	fetchUserCourses: async (): Promise<void> => {
		try {
			set({ isLoading: true, error: null });
			const response = await apiGet<Course[]>(
				ENDPOINTS.USER_COURSES.BASE
			);
			set({ userCourses: response, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error:
					error instanceof Error
						? error.message
						: "Failed to fetch user courses",
			});
		}
	},

	fetchCourseById: async (courseId: number): Promise<Course | null> => {
		try {
			const response = await apiGet<Course>(
				ENDPOINTS.COURSE.ID(courseId.toString())
			);
			return response;
		} catch (error) {
			console.error("Failed to fetch course by ID:", error);
			return null;
		}
	},

	setCourse: (courseId: number): void => {
		set({ selectedCourseId: courseId });
	},

	startPracticeSession: (wordCount: number, courseId: number): void => {
		// This function would handle the practice session setup
		// Implementation would depend on your application's requirements
		console.log(
			`Starting practice session with ${wordCount} words for course ${courseId}`
		);
	},
}));
