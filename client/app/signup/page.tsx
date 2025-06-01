"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus, Sparkles } from "lucide-react";
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
import { useAuthStore } from "@/lib/store/auth-store";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function SignupPage() {
	const router = useRouter();
	const { signup, isAuthenticated, isLoading, error, clearError } =
		useAuthStore();
	const [userName, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [validationError, setValidationError] = useState<string | null>(null);

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			router.push("/");
		}
	}, [isAuthenticated, router]);

	const validateForm = () => {
		if (password !== confirmPassword) {
			setValidationError("Passwords do not match");
			return false;
		}

		if (password.length < 6) {
			setValidationError("Password must be at least 6 characters");
			return false;
		}

		setValidationError(null);
		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		// Pass all required parameters to the signup function
		const success = await signup(
			userName,
			email,
			password,
			confirmPassword
		);
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
									className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white"
									whileHover={{ scale: 1.1, rotate: 5 }}
									whileTap={{ scale: 0.9 }}
								>
									<UserPlus className="w-6 h-6" />
								</motion.div>
							</div>
							<CardTitle className="text-2xl font-bold">
								Create an account
							</CardTitle>
							<CardDescription>
								Enter your information to create an account
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{(error || validationError) && (
								<Alert variant="destructive">
									<AlertDescription>
										{error || validationError}
									</AlertDescription>
								</Alert>
							)}

							<form onSubmit={handleSubmit} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="userName">
										Tên Đăng Nhập
									</Label>
									<Input
										id="userName"
										placeholder="John Doe"
										value={userName}
										onChange={(e) => {
											setUserName(e.target.value);
											clearError();
										}}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="example@example.com"
										value={email}
										onChange={(e) => {
											setEmail(e.target.value);
											clearError();
										}}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="password">Mật khẩu</Label>
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
												setValidationError(null);
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

								<div className="space-y-2">
									<Label htmlFor="confirmPassword">
										Xác Nhận Mật Khẩu
									</Label>
									<Input
										id="confirmPassword"
										type={
											showPassword ? "text" : "password"
										}
										placeholder="••••••••"
										value={confirmPassword}
										onChange={(e) => {
											setConfirmPassword(e.target.value);
											setValidationError(null);
										}}
										required
									/>
								</div>

								<Button
									type="submit"
									className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
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
										<UserPlus className="mr-2 h-4 w-4" />
									)}
									{isLoading
										? "Đang tạo tài khoản..."
										: "Tạo Tài Khoản"}
								</Button>
							</form>
						</CardContent>
						<CardFooter className="flex justify-center">
							<div className="text-center text-sm">
								<span className="text-muted-foreground">
									Already have an account?{" "}
								</span>
								<Link
									href="/login"
									className="text-primary hover:underline"
								>
									Đăng Nhập
								</Link>
							</div>
						</CardFooter>
					</Card>
				</motion.div>
			</div>
		</ThemeProvider>
	);
}
