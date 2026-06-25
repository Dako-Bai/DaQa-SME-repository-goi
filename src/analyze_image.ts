import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";

async function analyze() {
  const imageUrl = "https://image.qwenlm.ai/public_source/adbb263c-2a55-49eb-931c-10cd3657db62/1be25b8a9-af2c-4880-8122-8140e4638474.png";
  console.log("[1] Start analysis");
  
  // Test writing to see if we can write to the directory
  fs.writeFileSync("./src/test_write.txt", "Ready");
  console.log("[2] Verified local disk write works");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.log("[TIMEOUT] Fetch takes too long, aborting...");
    controller.abort();
  }, 10000);

  try {
    console.log("[3] Fetching image:", imageUrl);
    const response = await fetch(imageUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    console.log("[4] Fetch response status:", response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    console.log("[5] Read image arrayBuffer, size:", buffer.byteLength);

    const base64Data = Buffer.from(buffer).toString("base64");
    const mimeType = response.headers.get("content-type") || "image/png";
    console.log("[6] Base64 conversion complete, size:", base64Data.length, "mimeType:", mimeType);

    const apiKey = process.env.GEMINI_API_KEY;
    console.log("[7] Gemini API Key present:", !!apiKey);
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is undefined.");
    }

    console.log("[8] Initializing GoogleGenAI...");
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `You are an expert data transcriber and analyst.
The image contains a tabular calculation or dashboard related to an oil/fuel netback or logistics workspace.
Analyze the image very carefully.
If there are any tables, spreadsheets, calculations or text fields:
1. Extract and write down EVERY single visible number, formula, title, column headers, and row data exactly as they appear (transcribe the table).
2. Detail the exact calculations shown - if there's a netback calculation, describe the formulas used (e.g., Export price - transport - duties, etc.).
3. Transcribe any text found (especially in Russian, English or Kazakh).
4. Provide a clear summary of what needs to be implemented or updated in our analytical workspace based on this image. Be as specific as possible.`;

    console.log("[9] Requesting content generation from gemini-flash-latest...");
    const genResponse = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        },
        {
          text: prompt
        }
      ]
    });

    console.log("[10] Received Gemini response!");
    const text = genResponse.text;
    console.log("\n--- RESULT CONTENT ---\n", text, "\n-------------------\n");

    fs.writeFileSync("./src/analysis_result.txt", text || "No text generated");
    console.log("[11] Wrote final result to ./src/analysis_result.txt");

  } catch (e: any) {
    console.error("[ERROR] during execution:", e);
    fs.writeFileSync("./src/analysis_result.txt", "Failed: " + e.message);
  }
}

analyze().then(() => console.log("[SUCCESS] Script complete.")).catch(err => {
  console.error("[CRITICAL FATAL]:", err);
});
