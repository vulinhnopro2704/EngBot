import { apiPost } from "@/lib/api-client";
import { ENDPOINTS } from "@/lib/endpoint";
import { Word } from "@/types/words";

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
