import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';
import { MOCHI_ENDPOINTS } from '@/lib/endpoint';

// Keep the private key on the server side only
const MOCHI_PRIVATE_KEY = "M0ch1M0ch1_En_$ecret_k3y";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const word = searchParams.get('word');
    const language = searchParams.get('language') || 'vi';
    const type = searchParams.get('type') || 'web';
    const definition = parseInt(searchParams.get('definition') || '0');

    // Validate required parameters
    if (!word) {
      return NextResponse.json(
        { error: 'Word parameter is required' },
        { status: 400 }
      );
    }

    // Make request to Mochi API with private key
    const response = await axios.get(
      MOCHI_ENDPOINTS.DICTIONARY(word, language, type, definition),
      {
        headers: {
          privatekey: MOCHI_PRIVATE_KEY,
        },
      }
    );

    // Transform response data (snake_case to camelCase)
    const transformedData = camelcaseKeys(response.data, { deep: true });
    
    // Return successful response
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Dictionary API error:', error);
    
    // Handle different types of errors
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.msg || error.message || 'Error fetching dictionary data';
      
      return NextResponse.json(
        { error: message },
        { status }
      );
    }
    
    // Generic error handling
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching dictionary data' },
      { status: 500 }
    );
  }
}
