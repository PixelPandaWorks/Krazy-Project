import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { planetName, messages } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API Key not configured" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Construct the prompt context
    const lastMessage = messages[messages.length - 1];
    const context = `You are a knowledgeable AI astronomer guide for a solar system explorer app. 
    The user is currently looking at the planet ${planetName}. 
    Answer their questions specifically about ${planetName}. 
    Keep answers concise, fascinating, and easy to read (under 100 words preferably unless asked for detail).
    If the question is unrelated to space or the planet, politely steer it back.`;

    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: context }]
            },
            {
                role: "model",
                parts: [{ text: `Understood. I am ready to answer questions about ${planetName}.` }]
            }
        ],
        generationConfig: {
            maxOutputTokens: 200,
        },
    });

    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ role: "assistant", content: text });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
