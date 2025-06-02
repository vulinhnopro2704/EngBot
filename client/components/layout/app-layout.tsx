"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
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
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
	Book,
	LayoutDashboard,
	Settings,
	Brain,
	Notebook,
	MessageSquare,
} from "lucide-react";

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
			icon: MessageSquare,
			label: "AI Chat",
			path: "/chat",
			section: "chat",
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
