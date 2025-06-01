export type Word = {
	id: number; // Unique identifier for the word
	word: string; // e.g., "abroad"
	pronunciation: string; // e.g., "/əˈbrɔːd/"
	pos: string; // Part of speech ("adv", "n", "phrase", "phrV", "adj", "v", etc.)
	meaning: string;
	example: string;
	example_vi: string;
	image: string;
	audio: string; // URL to audio pronunciation
	cefr: string; // CEFR level, e.g., "A1", "B2"
};
