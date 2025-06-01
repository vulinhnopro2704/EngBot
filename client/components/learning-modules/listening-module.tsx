"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, Check, X, Star } from "lucide-react";
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
import { ListeningModuleProps } from "@/types/lessons";
import { Sparkles } from "lucide-react";

export function ListeningModule({
	courseId,
	lessonId,
	words = [],
}: ListeningModuleProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [userInput, setUserInput] = useState("");
	const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
		null
	);
	const inputRef = useRef<HTMLInputElement>(null);
	const { recordActivity } = useProgress();
	const { speakWord, playSound } = useAudio();
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
		// Auto-focus the input field when the component mounts or when moving to a new word
		if (inputRef.current) {
			inputRef.current.focus();
		}

		// Clean up function to cancel any ongoing speech when unmounting
		return () => {
			if ("speechSynthesis" in window) {
				window.speechSynthesis.cancel();
			}
		};
	}, [currentIndex]);

	const handleSpeakWord = () => {
		// Cancel any ongoing speech first
		if ("speechSynthesis" in window) {
			window.speechSynthesis.cancel();
		}

		speakWord(currentWord.word, 0.8);
		recordActivity(courseId, lessonId, "word_listened", 1);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (userInput.trim().toLowerCase() === currentWord.word.toLowerCase()) {
			setFeedback("correct");
			playSound("correct");
			recordActivity(courseId, lessonId, "word_correct", 5);

			setTimeout(() => {
				// Play the pronunciation of the word
				speakWord(currentWord.word, 0.8);

				// Wait for pronunciation to finish before advancing
				setTimeout(() => {
					if (currentIndex < words.length - 1) {
						setCurrentIndex(currentIndex + 1);
						setUserInput("");
						setFeedback(null);
					}
				}, 1500); // Allow time for pronunciation
			}, 500); // Small delay before pronunciation
		} else {
			setFeedback("incorrect");
			playSound("incorrect");
			recordActivity(courseId, lessonId, "word_incorrect", 0);

			setTimeout(() => {
				setFeedback(null);
				setUserInput("");
				if (inputRef.current) {
					inputRef.current.focus();
				}
			}, 1500);
		}
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
						Listen and Type
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
					<div className="flex justify-center">
						<Button
							variant="outline"
							size="lg"
							className="h-20 w-20 rounded-full"
							onClick={handleSpeakWord}
						>
							<Volume2 className="h-8 w-8" />
						</Button>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						<Input
							ref={inputRef}
							type="text"
							placeholder="Type what you hear..."
							value={userInput}
							onChange={(e) => setUserInput(e.target.value)}
							className="text-center text-lg"
							autoFocus
							disabled={feedback !== null}
						/>

						<Button
							type="submit"
							className="w-full"
							disabled={
								userInput.trim() === "" || feedback !== null
							}
						>
							Check
						</Button>
					</form>
				</CardContent>
				<CardFooter>
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
											Try again. Listen carefully.
										</>
									)}
								</AlertDescription>
							</Alert>
						</motion.div>
					)}
				</CardFooter>
			</Card>
		</div>
	);
}
