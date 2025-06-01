"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	ArrowLeft,
	ArrowRight,
	RotateCw,
	Star,
	Volume2,
	Trophy,
	Heart,
	Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useProgress } from "@/hooks/use-progress";
import { useAudio } from "@/hooks/use-audio";
import { useVocabStore } from "@/lib/store";
import confetti from "canvas-confetti";
import { Mascot } from "@/components/ui/mascot";
import { cn } from "@/lib/utils";
import { Word } from "@/types/words";

type GamifiedFlashcardModuleProps = {
	courseId: number;
	lessonId: number;
	words: Word[];
};

export function GamifiedFlashcardModule({
	courseId,
	lessonId,
	words = [],
}: GamifiedFlashcardModuleProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [flipped, setFlipped] = useState(false);
	const [streak, setStreak] = useState(0);
	const [hearts, setHearts] = useState(3);
	const [showMascot, setShowMascot] = useState(false);
	const [mascotMessage, setMascotMessage] = useState("");
	const [mascotMood, setMascotMood] = useState<
		"happy" | "sad" | "excited" | "neutral"
	>("neutral");
	const [isCompleted, setIsCompleted] = useState(false);
	const [showCelebration, setShowCelebration] = useState(false);
	const [knownWords, setKnownWords] = useState<number[]>([]);
	const [reviewLater, setReviewLater] = useState<number[]>([]);
	const [autoPlayAudio, setAutoPlayAudio] = useState(true); // Enable auto-play by default

	const cardRef = useRef<HTMLDivElement>(null);
	const { recordActivity } = useProgress();
	const { playAudio, speakWord } = useAudio();
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
		let timer: NodeJS.Timeout | null = null;

		if (!flipped && currentWord && autoPlayAudio) {
			timer = setTimeout(() => {
				handlePlayAudio();
			}, 200);
		}

		return () => {
			if (timer) {
				clearTimeout(timer);
			}
		};
	}, [currentIndex, flipped, currentWord, autoPlayAudio]);

	const handleNext = () => {
		if (currentIndex < words.length - 1) {
			setFlipped(false);
			setTimeout(() => {
				setCurrentIndex(currentIndex + 1);
				// Record progress
				recordActivity(courseId, lessonId, "flashcard_viewed", 1);
			}, 200);
		} else {
			// Lesson completed
			setIsCompleted(true);
			triggerCelebration();
			showCompletionMascot();
		}
	};

	const handlePrevious = () => {
		if (currentIndex > 0) {
			setFlipped(false);
			setTimeout(() => {
				setCurrentIndex(currentIndex - 1);
			}, 200);
		}
	};

	const handleFlip = () => {
		setFlipped(!flipped);
		if (!flipped) {
			// Record that user viewed the definition
			recordActivity(courseId, lessonId, "flashcard_flipped", 1);

			// Play flip sound
			playAudio("/sounds/card-flip.mp3");
		}
	};

	const handlePlayAudio = () => {
		// if (currentWord.audio) {
		// 	playAudio(currentWord.audio);
		// } else {
		speakWord(currentWord.word);
		// }
	};

	const handleAddToNotebook = (e: React.MouseEvent) => {
		e.stopPropagation();
		addToNotebook(
			currentWord,
			"lesson",
			`Course ${courseId}, Lesson ${lessonId}`
		);

		// Show mascot with message
		setMascotMessage("Word added to your notebook!");
		setMascotMood("happy");
		setShowMascot(true);

		// Hide mascot after 3 seconds
		setTimeout(() => {
			setShowMascot(false);
		}, 3000);

		// Play success sound
		playAudio("/sounds/success.mp3");
	};

	const handleKnowWord = () => {
		// Add to known words
		if (!knownWords.includes(currentWord.id)) {
			setKnownWords([...knownWords, currentWord.id]);
		}

		// Increment streak
		setStreak(streak + 1);

		// Show encouraging mascot on streaks
		if (streak === 2) {
			setMascotMessage("Great job! You're on a roll!");
			setMascotMood("excited");
			setShowMascot(true);
			setTimeout(() => {
				setShowMascot(false);
			}, 3000);
		}

		// Move to next word
		handleNext();

		// Play success sound
		playAudio("/sounds/correct.mp3");
	};

	const handleDontKnowWord = () => {
		// Reset streak
		setStreak(0);

		// Lose a heart
		setHearts(hearts - 1);

		// Add to review later
		if (!reviewLater.includes(currentWord.id)) {
			setReviewLater([...reviewLater, currentWord.id]);
		}

		// Show encouraging mascot when losing hearts
		if (hearts <= 2) {
			setMascotMessage("Don't worry! You'll get it next time.");
			setMascotMood("sad");
			setShowMascot(true);
			setTimeout(() => {
				setShowMascot(false);
			}, 3000);
		}

		// Move to next word
		handleNext();

		// Play incorrect sound
		playAudio("/sounds/incorrect.mp3");
	};

	const triggerCelebration = () => {
		setShowCelebration(true);

		// Trigger confetti
		if (cardRef.current) {
			const rect = cardRef.current.getBoundingClientRect();
			const x = rect.left + rect.width / 2;
			const y = rect.top + rect.height / 2;

			confetti({
				particleCount: 100,
				spread: 70,
				origin: { x: x / window.innerWidth, y: y / window.innerHeight },
			});
		}

		// Play celebration sound
		playAudio("/sounds/celebration.mp3");

		setTimeout(() => {
			setShowCelebration(false);
		}, 5000);
	};

	const showCompletionMascot = () => {
		setMascotMessage("Congratulations! You've completed this lesson!");
		setMascotMood("excited");
		setShowMascot(true);
	};

	const progress = ((currentIndex + 1) / words.length) * 100;

	return (
		<div className="space-y-6 relative">
			{/* Progress and stats bar */}
			<div className="flex justify-between items-center">
				<div className="flex items-center gap-2">
					<span className="text-sm text-muted-foreground">
						Word {currentIndex + 1} of {words.length}
					</span>
					<div className="flex items-center gap-1 ml-4">
						{Array.from({ length: 3 }).map((_, i) => (
							<Heart
								key={i}
								className={cn(
									"h-5 w-5 transition-all",
									i < hearts
										? "text-red-500 fill-red-500 scale-100"
										: "text-gray-300 scale-90"
								)}
							/>
						))}
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Trophy className="h-5 w-5 text-yellow-500" />
					<span className="font-medium">{streak}</span>
				</div>
			</div>

			<div className="relative">
				<Progress
					value={progress}
					className="h-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950"
				/>
				<div
					className="absolute top-0 left-0 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
					style={{ width: `${progress}%` }}
				/>
			</div>

			<div className="flex justify-center">
				<AnimatePresence mode="wait">
					<motion.div
						key={currentIndex + (flipped ? "-flipped" : "")}
						initial={{ opacity: 0, rotateY: flipped ? -90 : 0 }}
						animate={{ opacity: 1, rotateY: flipped ? 180 : 0 }}
						exit={{ opacity: 0, rotateY: flipped ? 270 : -90 }}
						transition={{
							duration: 0.4,
							type: "spring",
							stiffness: 260,
							damping: 20,
						}}
						style={{ perspective: 1000 }}
						className="w-full max-w-md"
						ref={cardRef}
					>
						<Card
							className={cn(
								"h-80 flex items-center justify-center cursor-pointer relative overflow-hidden",
								"border-2 shadow-lg transition-all duration-300",
								"hover:shadow-xl hover:border-primary/30",
								"bg-gradient-to-br",
								flipped
									? "from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-indigo-200 dark:border-indigo-800"
									: "from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800"
							)}
							onClick={handleFlip}
						>
							{/* Decorative elements */}
							<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
								<div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2" />
								<div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-primary/10 to-transparent rounded-full translate-x-1/2 translate-y-1/2" />
							</div>

							<Button
								variant="ghost"
								size="icon"
								className="absolute top-2 right-2 z-10 text-primary hover:text-primary/80 hover:bg-primary/10"
								onClick={handleAddToNotebook}
								title="Add to notebook"
							>
								<Star className="h-5 w-5" />
							</Button>

							<Button
								variant="ghost"
								size="icon"
								className="absolute top-2 left-2 z-10 text-primary hover:text-primary/80 hover:bg-primary/10"
								onClick={handlePlayAudio}
								title="Play pronunciation"
							>
								<Volume2 className="h-5 w-5" />
							</Button>

							<div className="p-6 text-center">
								{!flipped ? (
									<div className="space-y-4">
										<motion.h3
											className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600 dark:from-primary dark:to-indigo-400"
											initial={{ scale: 0.9 }}
											animate={{ scale: 1 }}
											transition={{ duration: 0.3 }}
										>
											{currentWord.word}
										</motion.h3>
										{currentWord.pronunciation && (
											<motion.p
												className="text-muted-foreground"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												transition={{ delay: 0.2 }}
											>
												{currentWord.pronunciation}
											</motion.p>
										)}
										{currentWord.pos && (
											<motion.div
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: 0.3 }}
											>
												<Badge
													variant="outline"
													className="bg-primary/5"
												>
													{currentWord.pos}
												</Badge>
											</motion.div>
										)}
										<motion.p
											className="text-sm text-muted-foreground mt-4"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 0.4 }}
										>
											Tap card to see definition
										</motion.p>
									</div>
								) : (
									<div
										className="space-y-4"
										style={{ transform: "rotateY(180deg)" }}
									>
										<h4 className="text-sm font-medium text-muted-foreground">
											Definition
										</h4>
										<p className="text-xl">
											{currentWord.meaning}
										</p>
										{currentWord.example && (
											<div className="mt-4">
												<h4 className="text-sm font-medium text-muted-foreground">
													Example
												</h4>
												<p className="text-sm italic text-muted-foreground mt-1">
													"{currentWord.example}"
												</p>
												{currentWord.example_vi && (
													<p className="text-sm italic text-muted-foreground mt-1">
														"
														{currentWord.example_vi}
														"
													</p>
												)}
											</div>
										)}

										{currentWord.cefr && (
											<div className="mt-4">
												<Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
													{currentWord.cefr}
												</Badge>
											</div>
										)}
									</div>
								)}
							</div>

							{/* Sparkles animation for new words */}
							{!knownWords.includes(currentWord.id) &&
								!flipped && (
									<div className="absolute top-0 right-0">
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: [0, 1, 0] }}
											transition={{
												duration: 2,
												repeat: Number.POSITIVE_INFINITY,
												repeatDelay: 1,
											}}
										>
											<Sparkles className="h-6 w-6 text-yellow-400" />
										</motion.div>
									</div>
								)}
						</Card>
					</motion.div>
				</AnimatePresence>
			</div>

			<div className="flex justify-center gap-4 items-center">
				<Button
					variant="outline"
					size="icon"
					onClick={handlePrevious}
					disabled={currentIndex === 0}
					className="rounded-full h-10 w-10 border-primary/20 text-primary hover:text-primary hover:bg-primary/10 hover:border-primary/30 transition-all"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>

				<Button
					variant="outline"
					size="icon"
					onClick={handleFlip}
					className="rounded-full h-10 w-10 border-primary/20 text-primary hover:text-primary hover:bg-primary/10 hover:border-primary/30 transition-all"
				>
					<RotateCw className="h-5 w-5" />
				</Button>

				<Button
					variant="outline"
					size="icon"
					onClick={handleNext}
					disabled={currentIndex === words.length - 1 && !isCompleted}
					className="rounded-full h-10 w-10 border-primary/20 text-primary hover:text-primary hover:bg-primary/10 hover:border-primary/30 transition-all"
				>
					<ArrowRight className="h-5 w-5" />
				</Button>
			</div>

			{flipped && (
				<motion.div
					className="flex justify-center gap-3 mt-4"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					<Button
						onClick={handleDontKnowWord}
						variant="outline"
						className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:border-red-900 dark:hover:bg-red-950/50"
					>
						I don't know this word
					</Button>
					<Button
						onClick={handleKnowWord}
						className="bg-green-500 hover:bg-green-600 text-white"
					>
						I know this word
					</Button>
				</motion.div>
			)}

			{/* Mascot */}
			<AnimatePresence>
				{showMascot && (
					<motion.div
						className="absolute bottom-0 right-0 z-10"
						initial={{ opacity: 0, y: 50, scale: 0.8 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 20, scale: 0.9 }}
						transition={{
							type: "spring",
							stiffness: 300,
							damping: 20,
						}}
					>
						<Mascot message={mascotMessage} mood={mascotMood} />
					</motion.div>
				)}
			</AnimatePresence>

			{/* Celebration overlay */}
			<AnimatePresence>
				{showCelebration && (
					<motion.div
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<motion.div
							className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-2xl max-w-md text-center"
							initial={{ scale: 0.8, y: 20 }}
							animate={{ scale: 1, y: 0 }}
							transition={{
								type: "spring",
								stiffness: 300,
								damping: 20,
							}}
						>
							<motion.div
								animate={{ rotate: [0, 10, -10, 10, 0] }}
								transition={{ duration: 1, repeat: 2 }}
							>
								<Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
							</motion.div>
							<h2 className="text-2xl font-bold mb-2">
								Lesson Completed!
							</h2>
							<p className="text-muted-foreground mb-6">
								You've learned {words.length} new words!
							</p>
							<div className="flex justify-center gap-4">
								<Button
									variant="outline"
									onClick={() => setShowCelebration(false)}
								>
									Continue
								</Button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
