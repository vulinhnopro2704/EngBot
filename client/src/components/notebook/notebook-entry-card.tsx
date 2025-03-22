"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Edit, Volume2, Trash, ExternalLink } from "lucide-react";
import { EditWordDialog } from "@/components/notebook/edit-word-dialog";
import { useVocabStore } from "@/lib/store";
import { useAudio } from "@/hooks/use-audio";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { NotebookEntry } from "@/data/types";

interface NotebookEntryCardProps {
	entry: NotebookEntry;
	onToggleFavorite: () => void;
}

export function NotebookEntryCard({
	entry,
	onToggleFavorite,
}: NotebookEntryCardProps) {
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isFlipped, setIsFlipped] = useState(false);
	const { removeFromNotebook } = useVocabStore();
	const { speakWord } = useAudio();

	// Add error handling for missing properties
	if (!entry || !entry.id) {
		console.error("Invalid entry passed to NotebookEntryCard:", entry);
		return null;
	}

	const handleDelete = () => {
		removeFromNotebook(entry.id);
		setIsDeleteDialogOpen(false);
	};

	const handlePlayPronunciation = () => {
		if (entry.phonetic) {
			speakWord(entry.phonetic);
		}
	};

	// Get color for word type badge
	const getWordTypeColor = (type: string | undefined) => {
		if (!type)
			return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";

		switch (type.toLowerCase()) {
			case "noun":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
			case "verb":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
			case "adjective":
				return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
			case "adverb":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
			case "preposition":
				return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300";
			case "conjunction":
				return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
			case "pronoun":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
			case "interjection":
				return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
			case "phrase":
				return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
		}
	};

	// Format date safely
	const formatDate = (dateValue: Date | string | undefined): string => {
		if (!dateValue) return "Unknown date";
		try {
			return new Date(dateValue).toLocaleDateString();
		} catch (e) {
			console.error("Error formatting date:", e);
			return "Invalid date";
		}
	};

	return (
		<>
			<motion.div
				className="h-full perspective-1000"
				whileHover={{ scale: 1.02 }}
				transition={{ type: "spring", stiffness: 300 }}
			>
				<motion.div
					className="relative w-full h-full transition-all duration-500 preserve-3d cursor-pointer"
					animate={{ rotateY: isFlipped ? 180 : 0 }}
					onClick={() => setIsFlipped(!isFlipped)}
				>
					{/* Front of card */}
					<Card className="absolute w-full h-full backface-hidden border-2 hover:border-green-300 dark:hover:border-green-700 shadow-md hover:shadow-lg transition-all duration-300">
						<CardHeader className="pb-2 flex flex-row justify-between items-start">
							<div className="space-y-1">
								<h3 className="text-xl font-bold">
									{entry.word}
								</h3>
								<Badge
									className={`${getWordTypeColor(
										entry.wordType
									)}`}
								>
									{entry.wordType || "Unknown"}
								</Badge>
							</div>
							<motion.button
								whileHover={{ scale: 1.2, rotate: 5 }}
								whileTap={{ scale: 0.9 }}
								onClick={(e) => {
									e.stopPropagation();
									onToggleFavorite();
								}}
								className="text-gray-400 hover:text-yellow-500 focus:outline-none"
								aria-label={
									entry.isFavorite
										? "Remove from favorites"
										: "Add to favorites"
								}
							>
								<Star
									className={`h-6 w-6 ${
										entry.isFavorite
											? "fill-yellow-500 text-yellow-500"
											: "fill-none"
									}`}
								/>
							</motion.button>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground line-clamp-3">
								{entry.definition}
							</p>
						</CardContent>
						<CardFooter className="flex justify-between pt-2">
							<div className="flex gap-1">
								<Button
									variant="ghost"
									size="icon"
									onClick={(e) => {
										e.stopPropagation();
										handlePlayPronunciation();
									}}
									disabled={!entry.phonetic}
									title="Listen to pronunciation"
								>
									<Volume2 className="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									onClick={(e) => {
										e.stopPropagation();
										setIsEditDialogOpen(true);
									}}
									title="Edit word"
								>
									<Edit className="h-4 w-4" />
								</Button>
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="text-xs"
								onClick={(e) => {
									e.stopPropagation();
									window.open(
										`https://www.google.com/search?q=define+${entry.word}`,
										"_blank"
									);
								}}
							>
								<ExternalLink className="h-3 w-3 mr-1" /> Look
								up
							</Button>
						</CardFooter>
					</Card>

					{/* Back of card */}
					<Card className="absolute w-full h-full backface-hidden rotateY-180 border-2 hover:border-green-300 dark:hover:border-green-700 shadow-md hover:shadow-lg transition-all duration-300">
						<CardHeader className="pb-2">
							<div className="flex justify-between items-start">
								<h3 className="text-xl font-bold">
									{entry.word}
								</h3>
								<Badge
									className={`${getWordTypeColor(
										entry.wordType
									)}`}
								>
									{entry.wordType || "Unknown"}
								</Badge>
							</div>
						</CardHeader>
						<CardContent className="space-y-3">
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Definition:
								</p>
								<p>{entry.definition}</p>
							</div>
							{entry.example && (
								<div>
									<p className="text-sm font-medium text-muted-foreground">
										Example:
									</p>
									<p className="italic">"{entry.example}"</p>
								</div>
							)}
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Added on:
								</p>
								<p>{formatDate(entry.dateAdded)}</p>
							</div>
							{entry.source && (
								<div>
									<p className="text-sm font-medium text-muted-foreground">
										Source:
									</p>
									<p className="capitalize">{entry.source}</p>
								</div>
							)}
						</CardContent>
						<CardFooter className="flex justify-between pt-2">
							<Button
								variant="ghost"
								size="sm"
								className="text-destructive hover:text-destructive"
								onClick={(e) => {
									e.stopPropagation();
									setIsDeleteDialogOpen(true);
								}}
							>
								<Trash className="h-4 w-4 mr-1" /> Delete
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={(e) => {
									e.stopPropagation();
									setIsFlipped(false);
								}}
							>
								Back to front
							</Button>
						</CardFooter>
					</Card>
				</motion.div>
			</motion.div>

			<EditWordDialog
				entry={entry}
				open={isEditDialogOpen}
				onOpenChange={setIsEditDialogOpen}
			/>

			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the word "{entry.word}"
							from your notebook.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-destructive text-destructive-foreground"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
