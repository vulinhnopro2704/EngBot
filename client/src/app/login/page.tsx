"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, Sparkles } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthStore } from "@/lib/auth-store";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function LoginPage() {
	const router = useRouter();
	const { login, isAuthenticated, isLoading, error, clearError } =
		useAuthStore();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			router.push("/");
		}
	}, [isAuthenticated, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const success = await login(email, password);
		if (success) {
			router.push("/");
		}
	};

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background/50 to-background p-4">
				<div className="absolute top-4 right-4">
					<ThemeToggle />
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="w-full max-w-md"
				>
					<Card className="border-2">
						<CardHeader className="space-y-1 text-center">
							<div className="flex justify-center mb-2">
								<motion.div
									className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
									whileHover={{ scale: 1.1, rotate: 5 }}
									whileTap={{ scale: 0.9 }}
								>
									<Sparkles className="w-6 h-6" />
								</motion.div>
							</div>
							<CardTitle className="text-2xl font-bold">
								Welcome back
							</CardTitle>
							<CardDescription>
								Enter your credentials to access your account
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{error && (
								<Alert variant="destructive">
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}

							<form onSubmit={handleSubmit} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="name@example.com"
										value={email}
										onChange={(e) => {
											setEmail(e.target.value);
											clearError();
										}}
										required
									/>
								</div>

								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<Label htmlFor="password">
											Password
										</Label>
										<Link
											href="/forgot-password"
											className="text-xs text-primary hover:underline"
										>
											Forgot password?
										</Link>
									</div>
									<div className="relative">
										<Input
											id="password"
											type={
												showPassword
													? "text"
													: "password"
											}
											placeholder="••••••••"
											value={password}
											onChange={(e) => {
												setPassword(e.target.value);
												clearError();
											}}
											required
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute right-0 top-0 h-full px-3"
											onClick={() =>
												setShowPassword(!showPassword)
											}
										>
											{showPassword ? (
												<EyeOff className="h-4 w-4 text-muted-foreground" />
											) : (
												<Eye className="h-4 w-4 text-muted-foreground" />
											)}
											<span className="sr-only">
												{showPassword
													? "Hide password"
													: "Show password"}
											</span>
										</Button>
									</div>
								</div>

								<Button
									type="submit"
									className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
									disabled={isLoading}
								>
									{isLoading ? (
										<motion.div
											animate={{ rotate: 360 }}
											transition={{
												duration: 1,
												repeat: Number.POSITIVE_INFINITY,
												ease: "linear",
											}}
											className="mr-2"
										>
											<Sparkles className="h-4 w-4" />
										</motion.div>
									) : (
										<LogIn className="mr-2 h-4 w-4" />
									)}
									{isLoading ? "Signing in..." : "Sign In"}
								</Button>
							</form>
						</CardContent>
						<CardFooter className="flex flex-col space-y-4">
							<div className="text-center text-sm">
								<span className="text-muted-foreground">
									Don't have an account?{" "}
								</span>
								<Link
									href="/signup"
									className="text-primary hover:underline"
								>
									Sign up
								</Link>
							</div>

							<div className="text-center text-xs text-muted-foreground">
								<p>Demo credentials:</p>
								<p>Email: demo@example.com</p>
								<p>Password: password123</p>
							</div>
						</CardFooter>
					</Card>
				</motion.div>
			</div>
		</ThemeProvider>
	);
}
