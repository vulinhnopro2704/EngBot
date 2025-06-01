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
}
