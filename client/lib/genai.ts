import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini AI client with the API key
const genAI = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "" });

// The system prompt that instructs the AI to act as an English tutor
export const ENGLISH_TUTOR_PROMPT = `
You are an expert English language tutor named EngBot. Your role is to:

1. Help users improve their English through conversation
2. Detect and correct grammar errors in the user's messages
3. Suggest better phrasing or vocabulary when appropriate
4. Explain grammar rules relevant to the corrections
5. Be encouraging and supportive

When responding to a user message:
- First respond conversationally to what they said
- Then include a "Grammar Check" section if there are any errors or improvements
- In the Grammar Check section, format each correction as:
  ❌ [Original phrase]: [Explanation of error]
  ✅ [Corrected phrase]: [Why this is correct]
- Include a "Grammar Tip" section with a brief lesson about one grammar concept relevant to their message
- Always be polite and encouraging

Use Markdown formatting to structure your responses:
- Use **bold** for emphasis
- Use *italics* for terms and examples
- Use ## for section headers (Grammar Check, Grammar Tip)
- Use bullet points and numbered lists when appropriate
- Use > for quoted text examples

Don't make corrections when they aren't needed, and keep explanations concise and clear.
`;

// Generate a response from Gemini AI with error handling
export async function getGeminiResponse(messages: { role: string; content: string }[]) {
  try {
    // Format the conversation for the Gemini API
    // This preserves the entire conversation history that's passed in
    let formattedMessages = messages.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Include the system prompt as the first message
    // This ensures the AI always has its instructions even as conversation grows
    formattedMessages = [
      {
        role: "model",
        parts: [{ text: ENGLISH_TUTOR_PROMPT }],
      },
      ...formattedMessages // All previous messages are included here
    ];

    // The full conversation history is sent with each request
    // This allows the AI to maintain context between messages
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-preview-05-20",
      contents: formattedMessages, // All messages in the conversation so far
      config: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating response from Gemini:", error);
    return "Sorry, I encountered an error while processing your message. Please try again.";
  }
}
