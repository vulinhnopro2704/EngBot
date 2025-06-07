// User types
export type User = {
	id: number;
	name: string;
	email: string;
	avatar: string;
	joinDate: string;
};

// Word types
export type Word = {
	id: number; // Unique identifier for the word
	word: string; // e.g., "abroad"
	pronunciation: string; // e.g., "/əˈbrɔːd/"
	pos: string; // Part of speech ("adv", "n", "phrase", "phrV", "adj", "v", etc.)
	meaning: string;
	example: string;
	exampleVi: string;
	image: string;
	audio: string; // URL to audio pronunciation
	cefr: string; // CEFR level, e.g., "A1", "B2"
	level?: number; // Memorization level (1-5)
	streak?: number; // Current streak for the word
	notes?: string; // User notes for the word
};


// User progress types
export type UserCourse = {
	user: number;
	course: number;
	date_started?: string;
	date_completed?: string;
};

export type UserLesson = {
	user: number;
	lesson: number;
	date_started?: string;
	date_completed?: string;
};

export type UserWord = {
	id?: number; // Unique identifier for the user word entry
	word: Word; // The word object
	level: MemorizationLevel; // Memorization level (1-5)
	nextReview?: string; // Date String ISO 8601 format for the next review
	lastReview?: number; // Number of times the word has been reviewed
	streak?: number; // Current streak for the word
	learnedAt?: string; // Date String ISO 8601 format for when the word was learned
	user: number; // User ID
};

// CEFR levels for language proficiency
export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type MemorizationLevel = 1 | 2 | 3 | 4 | 5;


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

export interface NotebookEntry extends Word {
	dateAdded: Date | string;
	source: string;
	sourceDetails?: string;
	isFavorite: boolean;
}

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
// Update the QuestionType to include our new types
export type QuestionType =
	| "multiple-choice"
	| "fill-blank"
	| "listening"
	| "matching"
	| "drag-drop"
	| "listening-choice";

// Update the PracticeQuestion type to include fields for our new question types
export interface PracticeQuestion  {
	id: number;
	type: QuestionType;
	word: Word;
	options?: string[];
	correctAnswer: string;
	pairs?: any[]; // For matching exercise
	sentence?: string; // For drag-drop exercise
	dragWords?: string[]; // For drag-drop exercise
}

export type PracticeMode = "mixed" | "spaced" | QuestionType;

export type QuestionResult = {
	questionId: number;
	userAnswer: string;
	isCorrect: boolean;
	timestamp: Date;
};

export type PracticeSession = {
	id: string;
	mode: PracticeMode;
	questions: PracticeQuestion[];
	currentQuestionIndex: number;
	correctAnswers: number;
	incorrectAnswers: number;
	startTime: Date;
	endTime?: Date;
	completed: boolean;
	results: QuestionResult[];
};

export type PracticeHistory = {
	id: string;
	date: Date;
	score: number;
	totalQuestions: number;
	timeSpent: number; // in seconds
	questionTypes: QuestionType[];
};
