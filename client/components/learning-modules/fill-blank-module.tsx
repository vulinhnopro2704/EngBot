"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X, ArrowRight, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProgress } from "@/hooks/use-progress";
import { useAudio } from "@/hooks/use-audio";
import { useVocabStore } from "@/lib/store";
import { FillBlankModuleProps } from "@/types/lessons";

export function FillBlankModule({
	courseId,
	lessonId,
	words = [],
}: FillBlankModuleProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [userInput, setUserInput] = useState("");
	const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
		null
	);
	const [showAnswer, setShowAnswer] = useState(false);
	const { recordActivity } = useProgress();
	const { playSound, speakWord } = useAudio();
	const { addToNotebook } = useVocabStore();

	// Check if words array is empty
	if (!words || words.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center p-8 text-center">
				<div className="mb-4 text-primary/60">
					<Sparkles className="h-16 w-16" />
				</div>
				<h3 className="text-xl font-bold mb-2">No Words Available</h3>
				<p className="text-muted-foreground mb-4">
					There are no vocabulary words available for this lesson yet.
					Please check back later.
				</p>
				<Button variant="outline" onClick={() => window.history.back()}>
					Go Back
				</Button>
			</div>
		);
	}

	const currentWord = words[currentIndex];

	// Safety check for currentWord
	if (!currentWord) {
		return (
			<div className="flex flex-col items-center justify-center p-8 text-center">
				<div className="mb-4 text-primary/60">
					<Sparkles className="h-16 w-16" />
				</div>
				<h3 className="text-xl font-bold mb-2">Word Not Found</h3>
				<p className="text-muted-foreground mb-4">
					The current word could not be loaded. This might be due to a
					data issue.
				</p>
				<Button variant="outline" onClick={() => window.history.back()}>
					Go Back
				</Button>
			</div>
		);
	}

	useEffect(() => {
		// Reset state when moving to a new word
		if (showAnswer || feedback) {
			setUserInput("");
			setFeedback(null);
			setShowAnswer(false);
		}
	}, [currentIndex]);

	// Create a sentence with a blank for the current word
	const createSentenceWithBlank = () => {
		if (!currentWord.example)
			return `Please use the word "${currentWord.word}" in a sentence.`;

		const sentence = currentWord.example;
		const wordRegex = new RegExp(`\\b${currentWord.word}\\b`, "i");
		return sentence.replace(wordRegex, "_______");
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (userInput.trim().toLowerCase() === currentWord.word.toLowerCase()) {
			setFeedback("correct");
			playSound("correct");
			recordActivity(courseId, lessonId, "blank_correct", 5);

			setTimeout(() => {
				// Play the pronunciation of the word
				speakWord(currentWord.word, 0.8);

				// Wait for pronunciation to finish before advancing
				setTimeout(() => {
					if (currentIndex < words.length - 1) {
						setCurrentIndex(currentIndex + 1);
						setUserInput("");
						setFeedback(null);
						setShowAnswer(false);
					}
				}, 1500); // Allow time for pronunciation
			}, 500); // Small delay before pronunciation
		} else {
			setFeedback("incorrect");
			playSound("incorrect");
			recordActivity(courseId, lessonId, "blank_incorrect", 0);
		}
	};

	const handleNext = () => {
		if (currentIndex < words.length - 1) {
			setCurrentIndex(currentIndex + 1);
			setUserInput("");
			setFeedback(null);
			setShowAnswer(false);
			recordActivity(courseId, lessonId, "word_skipped", 0);
		}
	};

	const handleShowAnswer = () => {
		setShowAnswer(true);
		recordActivity(courseId, lessonId, "answer_revealed", 0);
	};

	const handleAddToNotebook = () => {
		addToNotebook(
			currentWord,
			"lesson",
			`Course ${courseId}, Lesson ${lessonId}`
		);
	};

	const progress = ((currentIndex + 1) / words.length) * 100;

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<span className="text-sm text-muted-foreground">
					Word {currentIndex + 1} of {words.length}
				</span>
				<Progress value={progress} className="w-1/3" />
			</div>

			<Card className="max-w-md mx-auto">
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-center">
						Fill in the Blank
					</CardTitle>
					<Button
						variant="ghost"
						size="icon"
						onClick={handleAddToNotebook}
						title="Add to notebook"
					>
						<Star className="h-4 w-4" />
					</Button>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="p-4 bg-muted rounded-md">
						<p className="text-lg">{createSentenceWithBlank()}</p>
					</div>

					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							Definition: {currentWord.meaning}
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						<Input
							type="text"
							placeholder="Type the missing word..."
							value={userInput}
							onChange={(e) => setUserInput(e.target.value)}
							className="text-center text-lg"
							autoFocus
							disabled={showAnswer}
						/>

						<div className="flex gap-2">
							<Button
								type="submit"
								className="flex-1"
								disabled={userInput.trim() === "" || showAnswer}
							>
								Check
							</Button>

							<Button
								type="button"
								variant="outline"
								className="flex-1"
								onClick={handleShowAnswer}
								disabled={showAnswer}
							>
								Show Answer
							</Button>
						</div>
					</form>
				</CardContent>
				<CardFooter className="flex flex-col gap-2">
					{feedback && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="w-full"
						>
							<Alert
								variant={
									feedback === "correct"
										? "default"
										: "destructive"
								}
							>
								<AlertDescription className="flex items-center gap-2">
									{feedback === "correct" ? (
										<>
											<Check className="h-4 w-4" />
											Correct! The word is "
											{currentWord.word}".
										</>
									) : (
										<>
											<X className="h-4 w-4" />
											Not quite right. Try again or see
											the answer.
										</>
									)}
								</AlertDescription>
							</Alert>
						</motion.div>
					)}

					{showAnswer && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="w-full"
						>
							<Alert>
								<AlertDescription>
									The correct answer is:{" "}
									<strong>{currentWord.word}</strong>
								</AlertDescription>
							</Alert>

							<Button
								onClick={handleNext}
								className="w-full mt-4"
								disabled={currentIndex === words.length - 1}
							>
								Next Word{" "}
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</motion.div>
					)}
				</CardFooter>
			</Card>
		</div>
	);
}
