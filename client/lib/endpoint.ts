const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const ENDPOINTS = {
	ACCOUNTS: {
		BASE: `${BACKEND_URL}/accounts`,
		ID: (id: string): string => `${BACKEND_URL}/accounts/${id}`,
	},
	AUTH: {
		LOGIN: `${BACKEND_URL}/accounts/login/`,
		REGISTER: `${BACKEND_URL}/accounts/register/`,
		LOGOUT: `${BACKEND_URL}/accounts/logout/`,
		PROFILE: `${BACKEND_URL}/accounts/profile/me/`,
		REFRESH: `${BACKEND_URL}/accounts/refresh-token/`,
	},
	COURSE: {
		BASE: `${BACKEND_URL}/courses`,
		ID: (id: string): string => `${BACKEND_URL}/courses/${id}`,
		COURSE_LESSONS: (courseId: string): string =>
			`${BACKEND_URL}/courses/${courseId}/lessons/`,
		ALL_COURSES: `${BACKEND_URL}/courses/all_courses/`,
	},
	LESSON: {
		BASE: `${BACKEND_URL}/lessons`,
		ID: (id: string): string => `${BACKEND_URL}/lessons/${id}`,
		ALL_LESSONS: `${BACKEND_URL}/lessons/all_lessons/`,
		WORDS: (lessonId: string): string =>
			`${BACKEND_URL}/lessons/${lessonId}/words/`,
		LESSONS_BY_COURSE: (courseId: string): string =>
			`${BACKEND_URL}/lessons/lessons_by_course/?course_id=${courseId}`,
	},
	USER_COURSES: {
		BASE: `${BACKEND_URL}/user-courses`,
		ID: (id: string): string => `${BACKEND_URL}/user-courses/${id}`,
		COURSE_LESSONS: (courseId: string): string =>
			`${BACKEND_URL}/user-courses/${courseId}/lessons/`,
	},
	USER_LESSONS: {
		BASE: `${BACKEND_URL}/user_lessons`,
		ID: (id: string): string => `${BACKEND_URL}/user_lessons/${id}`,
		LESSON_WORDS: (lessonId: string): string =>
			`${BACKEND_URL}/user_lessons/${lessonId}/words/`,
		ALL_LESSON_WORDS: (lessonId: string): string =>
			`${BACKEND_URL}/user_lessons/${lessonId}/words/`,
	},
	USER_WORDS: {
		BASE: `${BACKEND_URL}/user_words`,
		ID: (id: string): string => `${BACKEND_URL}/user_words/${id}`,
		COUNT_WORDS_BY_LEVEL: (level: number): string =>
			`${BACKEND_URL}/user_words/count_by_level/${level}/`,
		COUNT_ALL_WORDS_BY_LEVEL: `${BACKEND_URL}/user-words/count_words-by-level/`,
		GET_WORDS: `${BACKEND_URL}/user_words/get_words/`,
		LEARNED_WORDS: `${BACKEND_URL}/user-words/learned-words/`,
		LEARNED_WORDS_PAGINATION: `${BACKEND_URL}/user-words/learned-words-pagination/`,
		REVIEW_WORDS: `${BACKEND_URL}/user-words/review-words/`,
		SUBMIT_WORDS: `${BACKEND_URL}/user-words/submit-words/`,
	},
};

export const MOCHI_ENDPOINTS = {
	// Key is the English word, language is the target language (default is Vietnamese), type is the type of dictionary (default is web), and definition is the definition level (default is 0)
	DICTIONARY: (key: string, language: string = "vi", type: string = "web", definition : number = 0) => {
		return `https://mochien-server-release.mochidemy.com/api/v5.0/words/dictionary-english?language=${language}&key=${key}&type=${type}&definition=${definition}`;
	}
}