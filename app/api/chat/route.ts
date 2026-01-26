import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Helper function to add delay between retries
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(req: Request) {
  const requestStartTime = Date.now();
  console.log("\n" + "=".repeat(60));
  console.log("[Chat API] ⏱️  New request received at:", new Date().toISOString());
  
  try {
    const { planetName, messages } = await req.json();
    
    console.log("[Chat API] 📍 Planet:", planetName);
    console.log("[Chat API] 💬 Messages count:", messages?.length || 0);
    console.log("[Chat API] 📝 Last message:", messages?.[messages.length - 1]?.content?.substring(0, 50) + "...");

    if (!process.env.GEMINI_API_KEY) {
      console.error("[Chat API] ❌ GEMINI_API_KEY is not configured!");
      return NextResponse.json(
        { error: "Gemini API Key not configured" },
        { status: 500 }
      );
    }
    console.log("[Chat API] ✅ API Key is configured (length:", process.env.GEMINI_API_KEY.length, ")");

    // Updated list of current Gemini models (Jan 2026)
    // Order: fastest/cheapest first → most powerful last
    const candidates = [
        "gemini-2.5-flash-lite",   // Ultra-fast, cost-efficient
        "gemini-2.5-flash",        // Balanced speed and intelligence
        "gemini-3-flash-preview",  // High intelligence + speed
        "gemini-2.5-pro",          // Deep reasoning, long context
        "gemini-3-pro-preview",    // Most powerful
    ];

    console.log("[Chat API] 🤖 Will try these models in order:", candidates.join(" → "));

    let lastError: any = null;
    let attemptNumber = 0;

    for (const modelName of candidates) {
        attemptNumber++;
        const attemptStartTime = Date.now();
        console.log(`\n[Chat API] ▶️  Attempt ${attemptNumber}/${candidates.length}: ${modelName}`);
        
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            
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

            console.log(`[Chat API] 📤 Sending message to ${modelName}...`);
            const result = await chat.sendMessage(lastMessage.content);
            const response = await result.response;
            const text = response.text();
            
            const attemptDuration = Date.now() - attemptStartTime;
            const totalDuration = Date.now() - requestStartTime;
            
            console.log(`[Chat API] ✅ SUCCESS with ${modelName}`);
            console.log(`[Chat API] ⏱️  Model response time: ${attemptDuration}ms`);
            console.log(`[Chat API] ⏱️  Total request time: ${totalDuration}ms`);
            console.log(`[Chat API] 📥 Response preview: "${text.substring(0, 80)}..."`);
            console.log("=".repeat(60) + "\n");
            
            return NextResponse.json({ role: "assistant", content: text });

        } catch (error: any) {
            const attemptDuration = Date.now() - attemptStartTime;
            
            // Extract error details
            const errorStatus = error?.status || error?.response?.status || "unknown";
            const errorMessage = error?.message || "Unknown error";
            
            console.error(`[Chat API] ❌ FAILED with ${modelName}`);
            console.error(`[Chat API]    Status: ${errorStatus}`);
            console.error(`[Chat API]    Message: ${errorMessage}`);
            console.error(`[Chat API]    Duration: ${attemptDuration}ms`);
            
            lastError = error;
            
            // Add delay before next attempt (exponential backoff: 500ms, 1s, 2s, 4s...)
            if (attemptNumber < candidates.length) {
                const backoffDelay = Math.min(500 * Math.pow(2, attemptNumber - 1), 4000);
                console.log(`[Chat API] ⏳ Waiting ${backoffDelay}ms before next attempt...`);
                await delay(backoffDelay);
            }
        }
    }

    // If we get here, all models failed
    const totalDuration = Date.now() - requestStartTime;
    console.error("\n[Chat API] 🚨 ALL MODELS FAILED");
    console.error(`[Chat API] ⏱️  Total time spent: ${totalDuration}ms`);
    console.error("[Chat API] Last error details:", {
        message: lastError?.message,
        status: lastError?.status,
        statusText: lastError?.statusText,
    });
    console.log("=".repeat(60) + "\n");
    
    return NextResponse.json(
      { error: `All AI models are currently unavailable. Please try again in a few seconds.` },
      { status: 503 }
    );

  } catch (error: any) {
    const totalDuration = Date.now() - requestStartTime;
    console.error("\n[Chat API] 🔥 CRITICAL ERROR");
    console.error(`[Chat API] ⏱️  Failed after: ${totalDuration}ms`);
    console.error("[Chat API] Error type:", error?.constructor?.name);
    console.error("[Chat API] Error message:", error?.message);
    console.error("[Chat API] Full error:", error);
    console.log("=".repeat(60) + "\n");
    
    return NextResponse.json(
      { error: error.message || "Failed to generate response" },
      { status: 500 }
    );
  }
}
