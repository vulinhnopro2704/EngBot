import axios from "axios";
import type { ApiResponse } from "@/types/mochi-dictionary";

/**
 * Makes a request to our secure API route for dictionary lookups
 */
export const fetchDictionaryWord = async (
  word: string,
  language: string = "vi",
  type: string = "web",
  definition: number = 0
): Promise<ApiResponse> => {
  try {
    // Build URL with query parameters
    const params = new URLSearchParams({
      word,
      language,
      type,
      definition: definition.toString(),
    });

    // Call our internal API route instead of external service directly
    const response = await axios.get(`/api/dictionary?${params.toString()}`);

    return response.data as ApiResponse;
  } catch (error) {
    // Detailed error handling
    console.error("Dictionary lookup error:", error);

    // Format error message
    let errorMessage = "Failed to fetch dictionary data";

    if (axios.isAxiosError(error)) {
      // Extract specific error information from axios error
      errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    // Rethrow as a structured error
    throw new Error(`Dictionary Error: ${errorMessage}`);
  }
};
