"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarRail,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import {
	Book,
	GraduationCap,
	LayoutDashboard,
	LogOut,
	Settings,
	Brain,
	Notebook,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { useVocabStore } from "@/lib/store";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ThemeChangeProvider } from "@/components/theme-provider";
import { useAuthStore } from "@/lib/auth-store";
import { motion } from "framer-motion";
import {
	SectionTransition,
	SectionTransitionProvider,
	useTransition,
} from "@/components/ui/section-transition";
import { PageTransition } from "@/components/ui/page-transition";
import { AuthCheck } from "@/components/auth/auth-check";

type AppLayoutProps = {
	children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
	const router = useRouter();
	const pathname = usePathname();
	const { user, logout } = useAuthStore();
	const [mounted, setMounted] = useState(false);

	// Prevent hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	const navItems = [
		{
			icon: LayoutDashboard,
			label: "Dashboard",
			path: "/",
			section: "dashboard",
		},
		{ icon: Book, label: "Courses", path: "/courses", section: "courses" },
		{
			icon: Brain,
			label: "Practice",
			path: "/practice",
			section: "practice",
		},
		{
			icon: Notebook,
			label: "Notebook",
			path: "/notebook",
			section: "notebook",
		},
		{
			icon: Settings,
			label: "Settings",
			path: "/settings",
			section: "settings",
		},
	];

	const isActive = (path: string) => {
		if (path === "/" && pathname === "/") return true;
		if (path !== "/" && pathname.startsWith(path)) return true;
		return false;
	};

	const handleLogout = () => {
		logout();
		router.push("/login");
	};

	if (!mounted) return null;

	return (
		<AuthCheck>
			<ThemeChangeProvider>
				<SectionTransitionProvider>
					<SidebarProvider className="min-w-400px w-full">
						<div className="flex min-h-screen w-full">
							<Sidebar
								variant="inset"
								className="hidden min-w-[150px] md:flex"
							>
								<SidebarHeader className="flex flex-col items-center justify-center py-6">
									<motion.div
										className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white mb-2"
										whileHover={{ scale: 1.1, rotate: 5 }}
										whileTap={{ scale: 0.9 }}
									>
										<GraduationCap className="w-6 h-6 md:w-7 md:h-7" />
									</motion.div>
									<motion.h1
										className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500"
										whileHover={{ scale: 1.05 }}
									>
										EngBot
									</motion.h1>
								</SidebarHeader>
								<SidebarContent>
									<SidebarGroup>
										<SidebarGroupLabel>
											Menu
										</SidebarGroupLabel>
										<SidebarGroupContent>
											<NavigationMenu items={navItems} />
										</SidebarGroupContent>
									</SidebarGroup>
								</SidebarContent>
								<SidebarFooter className="p-4 md:p-6">
									<div className="flex items-center gap-3 mb-4">
										<Avatar className="border-2 border-primary/20 h-10 w-10 md:h-12 md:w-12">
											<AvatarImage
												src={user?.avatar}
												alt={user?.name}
											/>
											<AvatarFallback>
												{user?.name?.charAt(0) || "U"}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1 min-w-0">
											<p className="text-sm md:text-base font-medium truncate">
												{user?.name || "User"}
											</p>
											<p className="text-xs md:text-sm text-muted-foreground truncate">
												{user?.email ||
													"user@example.com"}
											</p>
										</div>
									</div>
									<div className="flex items-center justify-between">
										<ThemeToggle />
										<Button
											variant="outline"
											size="sm"
											className="gap-1 h-9 md:h-10 md:text-base"
											onClick={handleLogout}
										>
											<LogOut className="h-4 w-4 md:h-5 md:w-5" />{" "}
											Logout
										</Button>
									</div>
								</SidebarFooter>
								<SidebarRail />
							</Sidebar>

							<SidebarInset className="flex lg:ml-[250px] flex-col w-full">
								<header className="h-14 sm:h-16 md:h-18 border-b flex items-center justify-between px-3 sm:px-4 md:px-6">
									<div className="flex items-center gap-1 sm:gap-2">
										<SidebarTrigger className="hidden md:flex" />
										<MobileNav
											items={navItems}
											className="md:hidden"
										/>
										<h2 className="text-lg sm:text-xl md:text-2xl font-semibold truncate">
											{pathname === "/"
												? "Dashboard"
												: pathname.startsWith(
														"/courses"
												  )
												? "Courses"
												: pathname.startsWith(
														"/practice"
												  )
												? "Practice"
												: pathname.startsWith(
														"/notebook"
												  )
												? "Notebook"
												: pathname.startsWith(
														"/settings"
												  )
												? "Settings"
												: "EngBot"}
										</h2>
									</div>
									<div className="flex items-center gap-1 sm:gap-2">
										<ThemeToggle className="md:hidden" />
										<div className="md:hidden flex items-center">
											<Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-primary/20">
												<AvatarImage
													src={user?.avatar}
													alt={user?.name}
												/>
												<AvatarFallback>
													{user?.name?.charAt(0) ||
														"U"}
												</AvatarFallback>
											</Avatar>
											<Button
												variant="ghost"
												size="sm"
												className="ml-2"
												onClick={handleLogout}
											>
												<LogOut className="h-4 w-4" />
											</Button>
										</div>
									</div>
								</header>
								<main className="grow w-full  overflow-auto p-3 sm:p-4 md:p-6 lg:p-8">
									<PageTransition>
										<SectionTransition>
											{children}
										</SectionTransition>
									</PageTransition>
								</main>
							</SidebarInset>
						</div>
					</SidebarProvider>
				</SectionTransitionProvider>
			</ThemeChangeProvider>
		</AuthCheck>
	);
}

interface NavigationMenuProps {
	items: {
		icon: React.ElementType;
		label: string;
		path: string;
		section: string;
	}[];
}

function NavigationMenu({ items }: NavigationMenuProps) {
	const pathname = usePathname();
	const { navigateTo } = useTransition();

	const isActive = (path: string) => {
		if (path === "/" && pathname === "/") return true;
		if (path !== "/" && pathname.startsWith(path)) return true;
		return false;
	};

	return (
		<SidebarMenu>
			{items.map((item) => (
				<SidebarMenuItem key={item.label}>
					<SidebarMenuButton
						asChild
						isActive={isActive(item.path)}
						tooltip={item.label}
					>
						<motion.button
							onClick={() => navigateTo(item.section as any)}
							whileHover={{ x: 5 }}
							whileTap={{ scale: 0.95 }}
							className="relative"
						>
							<item.icon className="w-5 h-5 md:w-6 md:h-6" />
							<span className="text-base md:text-lg">
								{item.label}
							</span>

							{/* Animated indicator for active item */}
							{isActive(item.path) && (
								<motion.div
									layoutId="activeIndicator"
									className="absolute left-0 top-0 bottom-0 w-1 md:w-1.5 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.3 }}
								/>
							)}
						</motion.button>
					</SidebarMenuButton>
				</SidebarMenuItem>
			))}
		</SidebarMenu>
	);
}
