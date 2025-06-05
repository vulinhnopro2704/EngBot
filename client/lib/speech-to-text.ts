import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
  apiKey: process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY || "",
});

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    // Convert blob to base64 for AssemblyAI
    const base64Audio = await blobToBase64(audioBlob);

    const params = {
      audio: base64Audio,
      speech_model: "universal",
    };

    const transcript = await client.transcripts.transcribe(params);
    return transcript.text || "";
  } catch (error) {
    console.error("Error in speech-to-text:", error);
    throw error;
  }
}

// Helper function to convert blob to base64
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:audio/webm;base64,")
      const base64 = base64String.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Browser-based speech recognition for quick voice input
export function useBrowserSpeechRecognition(
  onResult: (transcript: string) => void,
  onEnd: () => void
): { start: () => void; stop: () => void } {
  if (typeof window === "undefined") {
    return { start: () => {}, stop: () => {} };
  }

  // @ts-ignore - SpeechRecognition is not in the default TypeScript types
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.error("Speech recognition not supported in this browser");
    return { start: () => {}, stop: () => {} };
  }

  // Create a persistent recognition instance
  let recognition: any = null;

  const initRecognition = () => {
    // Clean up previous instance if it exists
    if (recognition) {
      try {
        recognition.stop();
      } catch (e) {
        // Ignore errors during cleanup
      }
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
    }

    // Create new instance
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    // Set up event handlers
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");
      onResult(transcript);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended naturally");
      onEnd();
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      onEnd();
    };
  };

  return {
    start: () => {
      try {
        initRecognition();
        recognition.start();
        console.log("Speech recognition started");
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        onEnd();
      }
    },
    stop: () => {
      if (recognition) {
        try {
          recognition.stop();
          console.log("Speech recognition stopped");
        } catch (error) {
          console.error("Error stopping speech recognition:", error);
        }
      }
    },
  };
}