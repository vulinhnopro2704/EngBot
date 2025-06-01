import axios, {
	AxiosError,
	AxiosInstance,
	AxiosResponse,
	AxiosRequestConfig,
	InternalAxiosRequestConfig,
} from "axios";
import camelcaseKeys from "camelcase-keys";
import { toast } from "sonner";
import { ENDPOINTS } from "./endpoint";

interface ApiErrorResponse {
	message?: string;
	detail?: string;
	[key: string]: any;
}

interface RefreshTokenResponse {
	access: string;
}

// Type guard to check if an error is an AxiosError
function isAxiosError(error: any): error is AxiosError<ApiErrorResponse> {
	return error.isAxiosError === true;
}

const apiClient: AxiosInstance = axios.create({
	baseURL: process.env.BACKEND_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
// Queue of requests to retry after token refresh
let failedQueue: Array<{
	resolve: (value?: unknown) => void;
	reject: (reason?: any) => void;
	config: InternalAxiosRequestConfig;
}> = [];

// Process the queue of failed requests
const processQueue = (error: any, token?: string) => {
	failedQueue.forEach((promise) => {
		if (error) {
			promise.reject(error);
		} else {
			promise.config.headers.Authorization = `Bearer ${token}`;
			promise.resolve(axios(promise.config));
		}
	});
	failedQueue = [];
};

// Function to refresh the token
const refreshToken = async (): Promise<string | null> => {
	try {
		const refreshToken = localStorage.getItem("refresh");
		if (!refreshToken) {
			return null;
		}

		const response = await axios.post<RefreshTokenResponse>(
			ENDPOINTS.AUTH.REFRESH,
			{ refresh: refreshToken },
			{ headers: { "Content-Type": "application/json" } }
		);

		const newToken = response.data.access;
		localStorage.setItem("jwtAuth", newToken);
		return newToken;
	} catch (error) {
		localStorage.removeItem("jwtAuth");
		localStorage.removeItem("refresh");
		return null;
	}
};

// Request interceptor for authentication
apiClient.interceptors.request.use(
	(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
		const token = localStorage.getItem("jwtAuth");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error: AxiosError): Promise<AxiosError> => {
		return Promise.reject(error);
	}
);

// Response interceptor for transforming snake_case to camelCase and handling 401 errors
apiClient.interceptors.response.use(
	(response: AxiosResponse): AxiosResponse => {
		if (response.data) {
			response.data = camelcaseKeys(response.data, { deep: true });
		}
		return response;
	},
	async (error: unknown): Promise<any> => {
		// Handle 401 Unauthorized errors with token refresh
		if (isAxiosError(error) && error.response?.status === 401) {
			const originalConfig = error.config as InternalAxiosRequestConfig;

			// Skip refresh for refresh token request itself
			if (originalConfig.url === ENDPOINTS.AUTH.REFRESH) {
				return Promise.reject(error);
			}

			// If not already refreshing, attempt to refresh the token
			if (!isRefreshing) {
				isRefreshing = true;

				try {
					const newToken = await refreshToken();

					if (newToken) {
						// Update the original request with the new token
						originalConfig.headers.Authorization = `Bearer ${newToken}`;

						// Process queued requests
						processQueue(null, newToken);

						// Retry the original request
						return axios(originalConfig);
					} else {
						// Clear queued requests with error
						processQueue(error, undefined);
						return Promise.reject(error);
					}
				} catch (refreshError) {
					processQueue(refreshError, undefined);
					return Promise.reject(refreshError);
				} finally {
					isRefreshing = false;
				}
			} else {
				// If already refreshing, add request to queue
				return new Promise((resolve, reject) => {
					failedQueue.push({
						resolve,
						reject,
						config: originalConfig,
					});
				});
			}
		}

		// Global error handling for other errors
		if (isAxiosError(error)) {
			const statusCode = error.response?.status;
			const errorMessage =
				error.response?.data?.message ||
				error.response?.data?.detail ||
				error.message ||
				"An unexpected error occurred";

			// Display toast notification with error details
			toast.error(`Error ${statusCode}: ${errorMessage}`);
		} else {
			// For non-Axios errors
			const errorMessage =
				error instanceof Error
					? error.message
					: "An unexpected error occurred";
			toast.error(errorMessage);
		}

		return Promise.reject(error);
	}
);

// Type-safe GET method
export async function apiGet<T>(
	url: string,
	config?: AxiosRequestConfig
): Promise<T> {
	const response = await apiClient.get<T>(url, config);
	return response.data;
}

// Type-safe POST method
export async function apiPost<T>(
	url: string,
	data?: any,
	config?: AxiosRequestConfig
): Promise<T> {
	const response = await apiClient.post<T>(url, data, config);
	return response.data;
}

// Type-safe PUT method
export async function apiPut<T>(
	url: string,
	data?: any,
	config?: AxiosRequestConfig
): Promise<T> {
	const response = await apiClient.put<T>(url, data, config);
	return response.data;
}

// Type-safe DELETE method
export async function apiDelete<T>(
	url: string,
	config?: AxiosRequestConfig
): Promise<T> {
	const response = await apiClient.delete<T>(url, config);
	return response.data;
}

export default apiClient;
