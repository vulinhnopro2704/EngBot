"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
	GraduationCap,
	LayoutDashboard,
	Book,
	Brain,
	Notebook,
	Settings,
	LogOut,
	Menu,
	X,
	Flame,
	Heart,
	Diamond,
	MessageSquare,
	Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuthStore } from "@/lib/store/auth-store";
import { useVocabStore } from "@/lib/store";
import { useTransition } from "@/components/ui/section-transition";

const navigationItems = [
	{
		icon: LayoutDashboard,
		label: "Dashboard",
		path: "/",
		section: "dashboard",
	},
	{ icon: Book, label: "Courses", path: "/courses", section: "courses" },
	{ icon: Brain, label: "Practice", path: "/practice", section: "practice" },
	{
		icon: Notebook,
		label: "Notebook",
		path: "/notebook",
		section: "notebook",
	},
	{
		icon: Search,
		label: "Dictionary",
		path: "/dictionary",
		section: "dictionary",
	},
	{
		icon: MessageSquare,
		label: "AI Chat",
		path: "/chat",
		section: "chat",
	},
];

export function ModernHeader() {
	const router = useRouter();
	const pathname = usePathname();
	const { user, logout } = useAuthStore();
	const { streak, hearts, diamonds } = useVocabStore();
	const { navigateTo } = useTransition();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const isActive = (path: string) => {
		if (path === "/" && pathname === "/") return true;
		if (path !== "/" && pathname.startsWith(path)) return true;
		return false;
	};

	const handleNavigation = (section: string, path: string) => {
		navigateTo(section as any);
		setMobileMenuOpen(false);
	};

	const handleLogout = () => {
		logout();
		router.push("/login");
	};

	const handleSettings = () => {
		navigateTo("settings");
		setMobileMenuOpen(false);
	};

	if (!mounted) return null;

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 min-w-[100vh]">
			<div className="container mx-auto px-4">
				<div className="flex h-16 items-center justify-between">
					{/* Logo and Brand */}
					<motion.div
						className="flex items-center gap-3"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						<motion.div
							className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
							whileHover={{ rotate: 5 }}
							transition={{
								type: "spring",
								stiffness: 400,
								damping: 10,
							}}
						>
							<GraduationCap className="w-6 h-6" />
						</motion.div>
						<div className="flex flex-col">
							<h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">
								Engbot
							</h1>
							<p className="text-xs text-muted-foreground hidden sm:block">
								Learn English Smartly
							</p>
						</div>
					</motion.div>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center gap-1">
						{navigationItems.map((item) => (
							<motion.button
								key={item.label}
								onClick={() =>
									handleNavigation(item.section, item.path)
								}
								className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
									isActive(item.path)
										? "text-primary"
										: "text-muted-foreground hover:text-foreground hover:bg-accent"
								}`}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<div className="flex items-center gap-2">
									<item.icon className="w-4 h-4" />
									{item.label}
								</div>
								{isActive(item.path) && (
									<motion.div
										layoutId="activeTab"
										className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg border border-purple-200 dark:border-purple-800"
										initial={false}
										transition={{
											type: "spring",
											stiffness: 500,
											damping: 30,
										}}
									/>
								)}
							</motion.button>
						))}
					</nav>

					{/* Stats and User Menu */}
					<div className="flex items-center gap-3">
						{/* Stats - Hidden on small screens */}
						<div className="hidden lg:flex items-center gap-2">
							<motion.div
								className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-medium"
								whileHover={{ scale: 1.05 }}
							>
								<Flame className="w-3 h-3" />
								{streak}
							</motion.div>
							<motion.div
								className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium"
								whileHover={{ scale: 1.05 }}
							>
								<Heart className="w-3 h-3" />
								{hearts}
							</motion.div>
							<motion.div
								className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-1 rounded-full text-xs font-medium"
								whileHover={{ scale: 1.05 }}
							>
								<Diamond className="w-3 h-3" />
								{diamonds}
							</motion.div>
						</div>

						{/* Theme Toggle */}
						<ThemeToggle />

						{/* User Menu */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="relative h-10 w-10 rounded-full"
								>
									<Avatar className="h-10 w-10 border-2 border-primary/20">
										<AvatarImage
											src={
												user?.avatar ||
												"/placeholder.svg"
											}
											alt={user?.name}
										/>
										<AvatarFallback>
											{user?.name?.charAt(0) || "U"}
										</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-56"
								align="end"
								forceMount
							>
								<div className="flex items-center justify-start gap-2 p-2">
									<div className="flex flex-col space-y-1 leading-none">
										<p className="font-medium">
											{user?.name || "User"}
										</p>
										<p className="w-[200px] truncate text-sm text-muted-foreground">
											{user?.email || "user@example.com"}
										</p>
									</div>
								</div>
								<DropdownMenuSeparator />

								{/* Mobile Stats */}
								<div className="lg:hidden p-2">
									<div className="flex items-center gap-2 mb-2">
										<div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs">
											<Flame className="w-3 h-3" />
											{streak}
										</div>
										<div className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs">
											<Heart className="w-3 h-3" />
											{hearts}
										</div>
										<div className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-1 rounded-full text-xs">
											<Diamond className="w-3 h-3" />
											{diamonds}
										</div>
									</div>
									<DropdownMenuSeparator />
								</div>

								<DropdownMenuItem onClick={handleSettings}>
									<Settings className="mr-2 h-4 w-4" />
									Settings
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleLogout}>
									<LogOut className="mr-2 h-4 w-4" />
									Log out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						{/* Mobile Menu Button */}
						<Button
							variant="ghost"
							size="icon"
							className="md:hidden"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						>
							{mobileMenuOpen ? (
								<X className="h-5 w-5" />
							) : (
								<Menu className="h-5 w-5" />
							)}
						</Button>
					</div>
				</div>

				{/* Mobile Navigation */}
				<AnimatePresence>
					{mobileMenuOpen && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.2 }}
							className="md:hidden border-t bg-background/95 backdrop-blur"
						>
							<nav className="flex flex-col py-4 space-y-1">
								{navigationItems.map((item) => (
									<motion.button
										key={item.label}
										onClick={() =>
											handleNavigation(
												item.section,
												item.path
											)
										}
										className={`flex items-center gap-3 px-4 py-3 text-left rounded-lg mx-2 transition-colors ${
											isActive(item.path)
												? "bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-primary border border-purple-200 dark:border-purple-800"
												: "text-muted-foreground hover:text-foreground hover:bg-accent"
										}`}
										whileTap={{ scale: 0.98 }}
									>
										<item.icon className="w-5 h-5" />
										{item.label}
									</motion.button>
								))}
								<motion.button
									onClick={handleSettings}
									className={`flex items-center gap-3 px-4 py-3 text-left rounded-lg mx-2 transition-colors ${
										isActive("/settings")
											? "bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-primary border border-purple-200 dark:border-purple-800"
											: "text-muted-foreground hover:text-foreground hover:bg-accent"
									}`}
									whileTap={{ scale: 0.98 }}
								>
									<Settings className="w-5 h-5" />
									Settings
								</motion.button>
							</nav>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</header>
	);
}
