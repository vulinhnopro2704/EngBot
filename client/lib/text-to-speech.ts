// Client-side implementation using ResponsiveVoice

export async function speakText(text: string): Promise<void> {
  try {
    if (typeof window === 'undefined' || !window.responsiveVoice) {
      console.error("ResponsiveVoice not available");
      return Promise.reject(new Error("ResponsiveVoice not available"));
    }
    
    // Clean the text of markdown and HTML tags for better speech
    const cleanText = text.replace(/[#*_~`]/g, '').replace(/<[^>]*>/g, '');
    
    // Use a promise to handle the asynchronous nature of speech
    return new Promise<void>((resolve, reject) => {
      // Cancel any ongoing speech
      window.responsiveVoice.cancel();
      
      // Speak the text with callback for completion
      window.responsiveVoice.speak(cleanText, "UK English Female", {
        pitch: 1,
        rate: 0.9,  // Slightly slower rate for better clarity
        volume: 1,
        onend: () => resolve(),
        onerror: (error) => {
          console.error("ResponsiveVoice error:", error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error("Error in text-to-speech:", error);
    return Promise.reject(error);
  }
}