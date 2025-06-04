import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { NextResponse } from "next/server";

// Initialize the ElevenLabs client on the server side
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY || "",
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }
    
    let audioStream;
    try {
        // Get audio data from ElevenLabs
        audioStream = await elevenlabs.textToSpeech.convert("JBFqnCBsd6RMkjVDRZzb", {
          text: text,
          modelId: "eleven_multilingual_v2",
          outputFormat: "mp3_44100_128",
        });
    }
    catch (error) {
        // Enhanced error logging
        console.error("Error converting text to speech:", error);
        console.error("Error details:", {
          message: error.message,
          statusCode: error.statusCode,
          responseBody: error.body,
          rawResponse: JSON.stringify(error.rawResponse || {}, null, 2),
          stack: error.stack,
          apiKey: process.env.ELEVENLABS_API_KEY ? 
            `${process.env.ELEVENLABS_API_KEY.substring(0, 4)}...${process.env.ELEVENLABS_API_KEY.slice(-4)}` : 
            'Not set'
        });
        
        return NextResponse.json(
          { 
            error: "Failed to convert text to speech", 
            details: {
              message: error.message,
              statusCode: error.statusCode,
              responseBody: error.body
            }
          },
          { status: 500 }
        );
    }

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const audioData = Buffer.concat(chunks);

    // Return the audio as Buffer
    return new NextResponse(audioData, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioData.length.toString(),
      },
    });
  } catch (error) {
    // General error handling
    console.error("General error in text-to-speech API:", error);
    console.error("Error stack:", error.stack);
    
    return NextResponse.json(
      { 
        error: "Failed to process request",
        details: {
          message: error.message,
          stack: error.stack
        }
      },
      { status: 500 }
    );
  }
}
