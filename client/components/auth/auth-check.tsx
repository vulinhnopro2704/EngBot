"use client";

import type React from "react";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { LoadingAnimals } from "@/components/ui/loading-animals";

interface AuthCheckProps {
	children: React.ReactNode;
}

export function AuthCheck({ children }: AuthCheckProps) {
	const router = useRouter();
	const pathname = usePathname();
	const { isAuthenticated } = useAuthStore();

	// Public routes that don't require authentication
	const publicRoutes = ["/login", "/signup", "/forgot-password"];

	useEffect(() => {
		// If on a protected route and not authenticated, redirect to login
		if (!isAuthenticated && !publicRoutes.includes(pathname)) {
			router.push("/login");
		}

		// If authenticated and on an auth page, redirect to dashboard
		if (isAuthenticated && publicRoutes.includes(pathname)) {
			router.push("/");
		}
	}, [isAuthenticated, pathname, router]);

	// If on a protected route and not authenticated, show loading
	if (!isAuthenticated && !publicRoutes.includes(pathname)) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<LoadingAnimals
					type="cat"
					text="Checking authentication..."
					size="lg"
					color="primary"
				/>
			</div>
		);
	}

	return <>{children}</>;
}
