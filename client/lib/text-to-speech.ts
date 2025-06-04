// Client-side implementation using ResponsiveVoice

export async function speakText(text: string): Promise<void> {
  try {
    if (typeof window === 'undefined' || !window.responsiveVoice) {
      console.error("ResponsiveVoice not available");
      return Promise.reject(new Error("ResponsiveVoice not available"));
    }
    
    // Use a promise to handle the asynchronous nature of speech
    return new Promise<void>((resolve, reject) => {
      // Cancel any ongoing speech
      window.responsiveVoice.cancel();
      
      // Speak the text with callback for completion
      window.responsiveVoice.speak(text, "UK English Female", {
        pitch: 1,
        rate: 1,
        volume: 1,
        onend: () => resolve(),
        onerror: (error) => reject(error)
      });
    });
  } catch (error) {
    console.error("Error in text-to-speech:", error);
    return Promise.reject(error);
  }
}

// Check if ResponsiveVoice is available
export function isSpeechAvailable(): boolean {
  return typeof window !== 'undefined' && 
         window.responsiveVoice && 
         window.responsiveVoice.voiceSupport();
}

// Get available voices
export function getAvailableVoices(): string[] {
  if (typeof window === 'undefined' || !window.responsiveVoice) {
    return [];
  }
  return window.responsiveVoice.getVoices();
}
