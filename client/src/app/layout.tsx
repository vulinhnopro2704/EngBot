import type React from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { NavigationProgress } from "@/components/ui/navigation-progress";
import "./globals.css";

export const metadata: Metadata = {
	title: "VocabMaster - Learn English Vocabulary",
	description: "Interactive English vocabulary learning application",
	generator: "v0.dev",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="font-sans">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
					storageKey="vocab-master-theme"
				>
					<NavigationProgress />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
