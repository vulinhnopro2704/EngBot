"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Book,
	Plus,
	Search,
	Star,
	Filter,
	SortAsc,
	SortDesc,
	X,
	Sparkles,
	BookOpen,
	Trash,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVocabStore } from "@/lib/store";
import { NotebookEntryCard } from "@/components/notebook/notebook-entry-card";
import { AddWordDialog } from "@/components/notebook/add-word-dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { WordType } from "@/data/types";
import { LoadingAnimals } from "@/components/ui/loading-animals";
import { Clock } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function NotebookPage() {
	const { notebookEntries, toggleFavorite, _debug_clearNotebook } =
		useVocabStore();
	const [searchQuery, setSearchQuery] = useState("");
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [activeTab, setActiveTab] = useState("all");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const [filterType, setFilterType] = useState<WordType | "all">("all");
	const [isLoading, setIsLoading] = useState(true);
	const [animalType, setAnimalType] = useState<
		"cat" | "quokka" | "hamster" | "capybara"
	>("cat");
	const [selectedLevel, setSelectedLevel] = useState<string>("all");
	const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

	// Simulate loading state
	useEffect(() => {
		// Randomly select an animal for loading animation
		const animals = ["cat", "quokka", "hamster", "capybara"] as const;
		setAnimalType(animals[Math.floor(Math.random() * animals.length)]);

		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1500);

		return () => clearTimeout(timer);
	}, []);

	// Add debugging to check notebook entries
	useEffect(() => {
		if (!isLoading) {
			console.log("Current notebook entries:", notebookEntries);
		}
	}, [isLoading, notebookEntries]);

	// Helper function to safely parse dates
	const safelyParseDate = (dateValue: Date | string | undefined): Date => {
		if (!dateValue) return new Date(0);
		if (dateValue instanceof Date) return dateValue;
		try {
			return new Date(dateValue);
		} catch (e) {
			console.error("Error parsing date:", e);
			return new Date(0);
		}
	};

	// Filter entries based on search query, tab, and word type filter
	const filteredEntries = notebookEntries.filter((entry) => {
		// Ensure entry has required properties
		if (
			!entry ||
			typeof entry.word !== "string" ||
			typeof entry.definition !== "string"
		) {
			console.warn("Invalid notebook entry found:", entry);
			return false;
		}

		const matchesSearch =
			entry.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
			entry.definition.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesTab =
			activeTab === "all" ||
			(activeTab === "favorites" && entry.isFavorite) ||
			(activeTab === "recent" &&
				entry.dateAdded &&
				safelyParseDate(entry.dateAdded).getTime() >
					Date.now() - 7 * 24 * 60 * 60 * 1000);

		const matchesType =
			filterType === "all" ||
			(entry.wordType && entry.wordType === filterType);

		return matchesSearch && matchesTab && matchesType;
	});

	// Sort entries
	const sortedEntries = [...filteredEntries].sort((a, b) => {
		if (sortOrder === "asc") {
			return a.word.localeCompare(b.word);
		} else {
			return (
				safelyParseDate(b.dateAdded).getTime() -
				safelyParseDate(a.dateAdded).getTime()
			);
		}
	});

	const handleToggleFavorite = (id: number) => {
		toggleFavorite(id);
	};

	const handleResetNotebook = () => {
		_debug_clearNotebook();
		setIsResetDialogOpen(false);
	};

	const wordTypeCount: Record<string, number> = {};
	notebookEntries.forEach((entry) => {
		const type = entry.wordType || "unknown";
		wordTypeCount[type] = (wordTypeCount[type] || 0) + 1;
	});

	// Container animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.05,
				delayChildren: 0.1,
			},
		},
	};

	// Item animation variants
	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	// Check if any filters are applied
	const hasActiveFilters =
		searchQuery !== "" ||
		selectedLevel !== "all" ||
		filterType !== "all" ||
		sortOrder !== "desc";

	// Clear all filters
	const clearFilters = () => {
		setSearchQuery("");
		setFilterType("all");
		setSortOrder("desc");
	};

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh]">
				<LoadingAnimals
					type={animalType}
					text="Loading your vocabulary notebook..."
					size="lg"
					color="green"
				/>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="space-y-6 max-w-[1600px] mx-auto w-full"
		>
			<div className="flex flex-col gap-4">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<motion.div
						className="flex flex-col gap-1"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
					>
						<h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
							<Book className="h-6 w-6 md:h-7 md:w-7 text-green-500" />
							<span>Vocabulary Notebook</span>
							<motion.div
								animate={{
									rotate: [0, 10, -10, 10, 0],
									scale: [1, 1.2, 1],
								}}
								transition={{
									duration: 1.5,
									repeat: Number.POSITIVE_INFINITY,
									repeatType: "loop",
									repeatDelay: 5,
								}}
							>
								<Sparkles className="h-5 w-5 md:h-6 md:w-6 text-yellow-500 ml-2" />
							</motion.div>
						</h1>
						<p className="text-muted-foreground text-sm md:text-base">
							Store and organize the vocabulary words you've
							learned
						</p>
					</motion.div>

					<div className="flex gap-2">
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<Button
								onClick={() => setIsAddDialogOpen(true)}
								className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md px-4 py-2 h-10 md:h-11 md:text-base"
							>
								<Plus className="h-4 w-4 md:h-5 md:w-5" /> Add
								Word
							</Button>
						</motion.div>

						<AlertDialog
							open={isResetDialogOpen}
							onOpenChange={setIsResetDialogOpen}
						>
							<AlertDialogTrigger asChild>
								<Button
									variant="outline"
									className="flex items-center gap-2 h-10 md:h-11 md:text-base"
								>
									<Trash className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
									<span className="hidden sm:inline">
										Reset
									</span>
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										Reset Notebook
									</AlertDialogTitle>
									<AlertDialogDescription>
										This will delete all words in your
										notebook. This action cannot be undone.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>
										Cancel
									</AlertDialogCancel>
									<AlertDialogAction
										onClick={handleResetNotebook}
										className="bg-red-500 hover:bg-red-600"
									>
										Reset
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</div>

				<div className="flex flex-col md:flex-row gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search words or definitions..."
							className="pl-10 h-10 md:h-11 text-base"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						{searchQuery && (
							<Button
								variant="ghost"
								size="icon"
								className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
								onClick={() => setSearchQuery("")}
							>
								<X className="h-4 w-4" />
							</Button>
						)}
					</div>

					<div className="flex gap-2 flex-wrap sm:flex-nowrap">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className="flex items-center gap-2 h-10 md:h-11 md:text-base"
								>
									<Filter className="h-4 w-4 md:h-5 md:w-5" />
									{filterType === "all"
										? "All Types"
										: filterType}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuItem
									onClick={() => setFilterType("all")}
								>
									All Types ({notebookEntries.length})
								</DropdownMenuItem>
								{Object.entries(wordTypeCount).map(
									([type, count]) => (
										<DropdownMenuItem
											key={type}
											onClick={() =>
												setFilterType(type as WordType)
											}
										>
											{type} ({count})
										</DropdownMenuItem>
									)
								)}
							</DropdownMenuContent>
						</DropdownMenu>

						<Button
							variant="outline"
							size="icon"
							className="h-10 w-10 md:h-11 md:w-11"
							onClick={() =>
								setSortOrder(
									sortOrder === "asc" ? "desc" : "asc"
								)
							}
							title={
								sortOrder === "asc"
									? "Sort Descending"
									: "Sort Ascending"
							}
						>
							{sortOrder === "asc" ? (
								<SortAsc className="h-4 w-4 md:h-5 md:w-5" />
							) : (
								<SortDesc className="h-4 w-4 md:h-5 md:w-5" />
							)}
						</Button>

						{hasActiveFilters && (
							<Button
								variant="ghost"
								onClick={clearFilters}
								className="gap-2 h-10 md:h-11 md:text-base"
							>
								<X className="h-4 w-4 md:h-5 md:w-5" /> Clear
							</Button>
						)}
					</div>
				</div>
			</div>

			<Tabs
				defaultValue="all"
				value={activeTab}
				onValueChange={setActiveTab}
				className="w-full"
			>
				<TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-900/30 dark:to-emerald-900/30 h-11 md:h-12">
					<TabsTrigger
						value="all"
						className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white md:text-base"
					>
						<Book className="h-4 w-4 md:h-5 md:w-5" /> All Words
						<Badge
							variant="outline"
							className="ml-1 bg-white/20 text-inherit"
						>
							{notebookEntries.length}
						</Badge>
					</TabsTrigger>
					<TabsTrigger
						value="favorites"
						className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white md:text-base"
					>
						<Star className="h-4 w-4 md:h-5 md:w-5" /> Favorites
						<Badge
							variant="outline"
							className="ml-1 bg-white/20 text-inherit"
						>
							{notebookEntries.filter((e) => e.isFavorite).length}
						</Badge>
					</TabsTrigger>
					<TabsTrigger
						value="recent"
						className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white md:text-base"
					>
						<Clock className="h-4 w-4 md:h-5 md:w-5" /> Recent
						<Badge
							variant="outline"
							className="ml-1 bg-white/20 text-inherit"
						>
							{
								notebookEntries.filter(
									(e) =>
										safelyParseDate(e.dateAdded).getTime() >
										Date.now() - 7 * 24 * 60 * 60 * 1000
								).length
							}
						</Badge>
					</TabsTrigger>
				</TabsList>

				<TabsContent value={activeTab} className="mt-6">
					{sortedEntries.length > 0 ? (
						<motion.div
							variants={containerVariants}
							initial="hidden"
							animate="visible"
							className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
						>
							<AnimatePresence>
								{sortedEntries.map((entry) => (
									<motion.div
										key={entry.id}
										variants={itemVariants}
										exit={{
											opacity: 0,
											y: -20,
											transition: { duration: 0.2 },
										}}
										layout
									>
										<NotebookEntryCard
											entry={entry}
											onToggleFavorite={() =>
												handleToggleFavorite(entry.id)
											}
										/>
									</motion.div>
								))}
							</AnimatePresence>
						</motion.div>
					) : (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5 }}
							className="max-w-2xl mx-auto"
						>
							<Card className="border-dashed">
								<CardContent className="p-8 md:p-12 flex flex-col items-center justify-center text-center">
									<motion.div
										animate={{
											y: [0, -10, 0],
											rotate: [0, 5, 0, -5, 0],
										}}
										transition={{
											duration: 3,
											repeat: Number.POSITIVE_INFINITY,
											repeatType: "loop",
										}}
										className="mb-4"
									>
										{activeTab === "favorites" ? (
											<Star className="h-12 w-12 md:h-16 md:w-16 text-yellow-500" />
										) : activeTab === "recent" ? (
											<Clock className="h-12 w-12 md:h-16 md:w-16 text-blue-500" />
										) : searchQuery ? (
											<Search className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground" />
										) : (
											<BookOpen className="h-12 w-12 md:h-16 md:w-16 text-green-500" />
										)}
									</motion.div>

									<h3 className="text-lg md:text-xl font-medium mb-2">
										No words found
									</h3>
									<p className="text-muted-foreground mb-6 max-w-md md:text-lg">
										{searchQuery
											? "No words match your search criteria"
											: activeTab === "favorites"
											? "You haven't added any words to your favorites yet"
											: activeTab === "recent"
											? "You haven't added any words recently"
											: "Your notebook is empty. Add words from lessons or manually"}
									</p>

									{!searchQuery && activeTab === "all" && (
										<motion.div
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											<Button
												onClick={() =>
													setIsAddDialogOpen(true)
												}
												className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md px-6 py-2 h-11 md:h-12 md:text-lg"
											>
												Add Your First Word
											</Button>
										</motion.div>
									)}
								</CardContent>
							</Card>
						</motion.div>
					)}
				</TabsContent>
			</Tabs>

			<AddWordDialog
				open={isAddDialogOpen}
				onOpenChange={setIsAddDialogOpen}
			/>
		</motion.div>
	);
}
