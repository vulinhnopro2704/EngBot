"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiPost } from "../api-client";
import { ENDPOINTS } from "../endpoint";

// User interface based on what we expect from the backend
export interface User {
	id: string;
	username: string;
	email: string;
}

// Auth response from login API
interface AuthResponse {
	user: User;
	access: string; // Access token, store it in localStorage
	refresh: string; // Refresh token, don't store it in, httpOnly cookies in production
}

interface AuthState {
	// Auth state
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;

	// Auth actions
	login: (username: string, password: string) => Promise<boolean>;
	signup: (
		username: string,
		email: string,
		password: string,
		password2: string
	) => Promise<boolean>;
	logout: () => void;
	clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			isAuthenticated: false,
			isLoading: false,
			error: null,

			login: async (username: string, password: string) => {
				set({ isLoading: true, error: null });

				try {
					// Call the real login API endpoint
					const response = await apiPost<AuthResponse>(
						ENDPOINTS.AUTH.LOGIN,
						{
							username,
							password,
						}
					);

					// Save both access and refresh tokens
					if (response.access) {
						localStorage.setItem("jwtAuth", response.access);
					}

					if (response.refresh) {
						localStorage.setItem("refresh", response.refresh);
					}

					// Update state with user information
					set({
						user: response.user,
						isAuthenticated: true,
						isLoading: false,
					});
					return true;
				} catch (error: any) {
					// Handle login error
					set({
						error:
							error.response?.data?.message ||
							error.response?.data?.detail ||
							"Login failed",
						isLoading: false,
					});
					return false;
				}
			},

			signup: async (
				username: string,
				email: string,
				password: string,
				password2: string
			) => {
				set({ isLoading: true, error: null });

				try {
					// Call the real signup API endpoint
					const response = await apiPost<AuthResponse>(
						ENDPOINTS.AUTH.REGISTER,
						{
							username,
							email,
							password,
							password2,
						}
					);

					// Save both access and refresh tokens
					if (response.access) {
						localStorage.setItem("jwtAuth", response.access);
					}

					if (response.refresh) {
						localStorage.setItem("refresh", response.refresh);
					}

					// Update state with user information
					set({
						user: response.user,
						isAuthenticated: true,
						isLoading: false,
					});
					return true;
				} catch (error: any) {
					// Handle signup error
					set({
						error:
							error.response?.data?.message ||
							error.response?.data?.detail ||
							"Signup failed",
						isLoading: false,
					});
					return false;
				}
			},

			logout: () => {
				// Remove tokens from localStorage
				localStorage.removeItem("jwtAuth");
				localStorage.removeItem("refresh");

				// Reset auth state
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
