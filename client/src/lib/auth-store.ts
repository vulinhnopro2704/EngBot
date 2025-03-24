"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

// Dummy user data
export interface User {
	id: string;
	email: string;
	name: string;
	avatar: string;
}

interface AuthState {
	// Auth state
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;

	// Auth actions
	login: (email: string, password: string) => Promise<boolean>;
	signup: (name: string, email: string, password: string) => Promise<boolean>;
	logout: () => void;
	clearError: () => void;
}

// Dummy users database
const dummyUsers = [
	{
		id: "1",
		email: "demo@example.com",
		password: "password123",
		name: "Demo User",
		avatar: "/placeholder.svg?height=40&width=40&text=DU",
	},
	{
		id: "2",
		email: "test@example.com",
		password: "test123",
		name: "Test User",
		avatar: "/placeholder.svg?height=40&width=40&text=TU",
	},
];

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			isAuthenticated: false,
			isLoading: false,
			error: null,

			login: async (email: string, password: string) => {
				set({ isLoading: true, error: null });

				try {
					// Simulate API call delay
					await new Promise((resolve) => setTimeout(resolve, 1000));

					// Find user in dummy database
					const user = dummyUsers.find(
						(u) =>
							u.email.toLowerCase() === email.toLowerCase() &&
							u.password === password
					);

					if (user) {
						// Omit password from user object
						const { password: _, ...userWithoutPassword } = user;
						set({
							user: userWithoutPassword,
							isAuthenticated: true,
							isLoading: false,
						});
						return true;
					} else {
						set({
							error: "Invalid email or password",
							isLoading: false,
						});
						return false;
					}
				} catch (error) {
					set({
						error: "An error occurred during login",
						isLoading: false,
					});
					return false;
				}
			},

			signup: async (name: string, email: string, password: string) => {
				set({ isLoading: true, error: null });

				try {
					// Simulate API call delay
					await new Promise((resolve) => setTimeout(resolve, 1000));

					// Check if user already exists
					const existingUser = dummyUsers.find(
						(u) => u.email.toLowerCase() === email.toLowerCase()
					);

					if (existingUser) {
						set({
							error: "Email already in use",
							isLoading: false,
						});
						return false;
					}

					// Create new user
					const newUser = {
						id: uuidv4(),
						email,
						password,
						name,
						avatar: `/placeholder.svg?height=40&width=40&text=${name.charAt(
							0
						)}`,
					};

					// In a real app, we would save this to a database
					// For demo, we'll just pretend it was saved

					// Omit password from user object
					const { password: _, ...userWithoutPassword } = newUser;
					set({
						user: userWithoutPassword,
						isAuthenticated: true,
						isLoading: false,
					});

					return true;
				} catch (error) {
					set({
						error: "An error occurred during signup",
						isLoading: false,
					});
					return false;
				}
			},

			logout: () => {
				set({
					user: null,
					isAuthenticated: false,
				});
			},

			clearError: () => {
				set({ error: null });
			},
		}),
		{
			name: "auth-storage",
		}
	)
);
