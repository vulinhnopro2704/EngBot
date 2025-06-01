import type { VocabularyWord } from "./vocabulary";
import { Word } from "./words";

// Lesson types
export type Lesson = {
	id: number;
	title: string;
	description?: string;
	image?: string;
	course_id?: number;
	word_count?: number;
};

// Module types
export interface ModuleProps {
	courseId: number;
	lessonId: number;
	words: Word[];
}

// Flashcard module props
export interface FlashcardModuleProps extends ModuleProps {
	onComplete?: () => void;
}

// Listening module props
export interface ListeningModuleProps extends ModuleProps {
	onComplete?: () => void;
}

// Fill in the blank module props
export interface FillBlankModuleProps extends ModuleProps {
	onComplete?: () => void;
}

// Lesson page props
export interface LessonPageProps {
	courseId: number;
	lessonId: number;
}

// Lesson view props
export interface LessonViewProps {
	courseId: number;
	lessonId: number;
	lesson: Lesson;
	words: VocabularyWord[];
}
