
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const keyMatch = envContent.match(/GEMINI_API_KEY=(.+)/);
    
    if (!keyMatch) {
        console.error("Could not find GEMINI_API_KEY in .env.local");
        return;
    }
    
    const apiKey = keyMatch[1].trim();
    console.log("Using API Key ending in:", apiKey.slice(-4));

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const candidates = [
        "gemini-3-pro-preview", 
        "gemini-3-flash-preview", 
        "gemini-2.0-flash-exp",
        "gemini-2.0-flash",
        "gemini-1.5-pro",
        "gemini-1.5-flash", 
        "gemini-1.5-flash-8b",
        "gemini-pro"
    ];
    
    console.log("\n--- Testing SDK Models ---");
    const results = [];
    
    for (const m of candidates) {
        process.stdout.write(`Testing ${m}... `);
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("Test");
            await result.response;
            console.log("✅");
            results.push({ model: m, status: "OK" });
        } catch (e) {
            let err = e.message || String(e);
            if (err.includes("503")) {
                    console.log("⚠️ 503");
                    results.push({ model: m, status: "503 (Busy)" });
            } else if (err.includes("404")) {
                    console.log("❌ 404");
                    results.push({ model: m, status: "404 (Not Found)" });
            } else {
                    console.log("❌ Error");
                    results.push({ model: m, status: "Error" });
            }
        }
    }
    console.table(results);

    // Fallback: Try RAW REST API ListModels to confirm what IS available
    console.log("\n--- Testing Raw REST API ListModels ---");
    const safeKey = apiKey.trim();
    
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${safeKey}`;
    try {
        const listRes = await fetch(listUrl);
        const listData = await listRes.json();
        if (listData.models) {
            console.log("Available Models (v1beta):");
            console.log(listData.models.map(m => m.name.replace('models/', '')).join(", "));
        } else {
             console.log("ListModels Failed:", JSON.stringify(listData, null, 2));
        }
    } catch(e) { console.error("List failed", e); }


  } catch (error) {
    console.error("Script error:", error);
  }
}

main();
