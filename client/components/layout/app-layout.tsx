"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ThemeChangeProvider } from "@/components/theme-provider";
import { motion } from "framer-motion";
import {
	SectionTransition,
	SectionTransitionProvider,
	useTransition,
} from "@/components/ui/section-transition";
import { PageTransition } from "@/components/ui/page-transition";
import { AuthCheck } from "@/components/auth/auth-check";
import { ModernHeader } from "@/components/layout/modern-header";
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
					<div className="min-h-screen bg-background min-w-screen">
						<ModernHeader />
						<SidebarInset className="flex flex-col w-full">
							<header className="h-14 sm:h-16 md:h-18 border-b flex items-center justify-between px-3 sm:px-4 md:px-6">
								<div className="flex items-center gap-1 sm:gap-2">
									<SidebarTrigger className="flex" />
									<h2 className="text-lg sm:text-xl md:text-2xl font-semibold truncate">
										{pathname === "/"
											? "Dashboard"
											: pathname.startsWith("/courses")
											? "Courses"
											: pathname.startsWith("/practice")
											? "Practice"
											: pathname.startsWith("/notebook")
											? "Notebook"
											: pathname.startsWith("/settings")
											? "Settings"
											: "VocabMaster"}
									</h2>
								</div>
								<div className="flex items-center gap-1 sm:gap-2">
									<ThemeToggle className="md:hidden" />
									<div className="md:hidden flex items-center">
										<Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-primary/20">
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
							<main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 lg:p-8 w-full">
								<PageTransition key={pathname}>
									<SectionTransition
										key={`section-${pathname}`}
									>
										{children}
									</SectionTransition>
								</PageTransition>
							</main>
						</SidebarInset>
					</div>
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
