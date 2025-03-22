// User types
export type User = {
	id: number;
	name: string;
	email: string;
	avatar: string;
	joinDate: string;
};

// Course types
export type Course = {
	id: number;
	title: string;
	titleVi: string;
	description: string;
	descriptionVi: string;
	lessons: number;
	icon: string;
	color: string;
	iconColor: string;
	difficulty: "Beginner" | "Intermediate" | "Advanced";
	totalWords: number;
	estimatedTime: string;
};

// Lesson types
export type Lesson = {
	id: number;
	title: string;
	titleVi: string;
	words: number;
	courseId: number;
};

// Vocabulary types
export type WordType =
	| "noun"
	| "verb"
	| "adjective"
	| "adverb"
	| "preposition"
	| "conjunction"
	| "pronoun"
	| "interjection"
	| "phrase";

export type VocabularyWord = {
	id: number;
	word: string;
	definition: string;
	definitionVi: string;
	phonetic?: string;
	example?: string;
	exampleVi?: string;
	wordType?: WordType;
	imageUrl?: string;
	relatedWords?: string[];
	dateAdded?: Date | string;
	isFavorite?: boolean;
	notes?: string;
	// Fields for notebook entries
	source?: "lesson" | "manual" | "practice";
	sourceDetails?: string;
	pronunciation?: string;
};

// Activity types
export type ActivityType = "completed" | "streak" | "practice";

export type Activity = {
	id: number;
	type: ActivityType;
	title: string;
	description: string;
	time: string;
	iconBg: string;
	iconColor: string;
};

// Progress types
export type Progress = {
	courseId: number;
	lessonId: number;
	progress: number;
};

// Settings types
export type FontSize = "small" | "medium" | "large";
export type ReminderFrequency =
	| "never"
	| "daily"
	| "every-other-day"
	| "weekly";
export type Language = "en" | "vi" | "es" | "fr" | "de" | "it" | "pt";

// Practice types
export type QuestionType = "multiple-choice" | "fill-blank" | "listening";

export type PracticeQuestion = {
	id: number;
	type: QuestionType;
	word: VocabularyWord;
	options?: string[];
	correctAnswer: string;
};

export type PracticeSession = {
	id: string;
	courseId?: number;
	lessonId?: number;
	questions: PracticeQuestion[];
	currentQuestionIndex: number;
	correctAnswers: number;
	incorrectAnswers: number;
	startTime: Date;
	endTime?: Date;
	completed: boolean;
};

export type PracticeHistory = {
	id: string;
	date: Date;
	score: number;
	totalQuestions: number;
	timeSpent: number; // in seconds
	questionTypes: QuestionType[];
};

// We're consolidating NotebookEntry with VocabularyWord
// NotebookEntry is now just a VocabularyWord with required source and dateAdded fields
export type NotebookEntry = VocabularyWord;
