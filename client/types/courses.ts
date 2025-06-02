export type CourseLevel =
	| "All Levels"
	| "Beginner"
	| "Elementary"
	| "Intermediate"
	| "Upper Intermediate"
	| "Advanced"
	| "Proficient";

export type CourseCategory =
	| "All Categories"
	| "Vocabulary"
	| "Grammar"
	| "Conversation"
	| "Business"
	| "Academic"
	| "Travel"
	| "Specialty";

export type CourseSortOption =
	| "popular"
	| "newest"
	| "highest-rated"
	| "most-students"
	| "alphabetical";

export interface Course {
	id: number;
	title: string;
	enTitle?: string;
	description: string;
	image?: string; // URL to course image
	icon?: string; // Emoji text
	createdAt?: string; // ISO date string
	updatedAt?: string; // ISO date string
	isLearned?: boolean; // Whether the user has learned this course
	progress?: number; // Progress percentage (0-100)
	learnerCount?: number; // Number of learners
	lessonCount?: number; // Number of lessons in the course
}

// Paginated Course Django REST Framework response
export interface PaginatedCoursesResponse {
	count: number; // Total number of courses
	next?: string | null; // URL to the next page of results
	previous?: string | null; // URL to the previous page of results
	results: Course[]; // Array of courses in the current page
}
