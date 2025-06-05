import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { NavigationProgress } from "@/components/ui/navigation-progress";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryProvider } from "@/providers/query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Engbot - Learn English Smartly",
	description:
		"Interactive English vocabulary learning application powered by AI",
	generator: "v0.dev",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
			<script src="https://code.responsivevoice.org/responsivevoice.js?key=907yQQYW"></script>
			</head>
			<body className={inter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
					storageKey="engbot-theme"
				>
					<QueryProvider>
						<NavigationProgress />
						<SidebarProvider>{children}</SidebarProvider>
					</QueryProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
