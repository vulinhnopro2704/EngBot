import { Word } from "@/data/types";
import { apiPost, apiGet } from "@/lib/api-client";
import { ENDPOINTS } from "@/lib/endpoint";

type SubmitWordItem = {
	word_id: number;
	level: number;
	streak: number;
	question_type: string;
};

type SubmitWordsRequest = {
	is_review: boolean;
	lesson_id: number;
	words: SubmitWordItem[];
};

export const submitLessonWords = async (lessonId: number, words: Word[]) => {
	// Map words to the required format with fixed question_type "L1"
	const formattedWords: SubmitWordItem[] = words.map((word) => ({
		word_id: word.id,
		level: 1,
		streak: 1,
		question_type: "L1",
	}));

	const payload: SubmitWordsRequest = {
		is_review: false,
		lesson_id: lessonId,
		words: formattedWords,
	};

	return apiPost(ENDPOINTS.USER_WORDS.SUBMIT_WORDS, payload);
};

// New type for review word response
export type ReviewWordItem = {
	id: number;
	word: {
		id: number;
		word: string;
		pronunciation: string | null;
		pos: string;
		meaning: string;
		example: string;
		example_vi: string;
		image: string | null;
		audio: string;
		cefr: string;
	};
	level: number;
	next_review: string;
	last_review: string;
	streak: number;
	learned_at: string;
	user: number;
};

export type ReviewWordsResponse = {
	is_review: boolean;
	lesson_id: number | null;
	words: ReviewWordItem[];
};

// Function to submit review words
export const submitReviewWords = async (words: Word[]): Promise<ReviewWordsResponse> => {
	// Map words to the required format
	const formattedWords: SubmitWordItem[] = words.map((word) => ({
		word_id: word.id,
		level: word.level || 1,
		streak: word.streak || 1,
		question_type: "L1",
	}));

	const payload: Omit<SubmitWordsRequest, "lesson_id"> = {
		is_review: true,
		words: formattedWords,
	};

	return apiPost<ReviewWordsResponse>(ENDPOINTS.USER_WORDS.SUBMIT_WORDS, payload);
};

// Add a new type to match the API response structure
type ReviewWordResponse = {
	words: Array<{
		id: number;
		word: {
			id: number;
			word: string;
			pronunciation: string | null;
			pos: string;
			meaning: string;
			example: string;
			example_vi: string;
			image: string | null;
			audio: string;
			cefr: string;
		};
		level: number;
		next_review: string;
		last_review: string;
		streak: number;
		learned_at: string;
		user: number;
	}>;
};

// Function to fetch review words
export const fetchReviewWords = async (): Promise<ReviewWordResponse> => {
	return apiGet<ReviewWordResponse>(ENDPOINTS.USER_WORDS.REVIEW_WORDS);
};
