import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Set up large JSON body limit for base64 image transfer
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Initialize the GoogleGenAI instance server-side
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is defined but may be empty at startup.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY_FOR_BUILD",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: process.env.NODE_ENV, hasKey: !!apiKey });
});

// 2. Endpoint: Flock & Necropsy Image Evaluation
app.post("/api/gemini/analyze", async (req, res) => {
  try {
    const { image, mimeType, type, userNotes } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image data provided. Please upload an image." });
    }

    if (!apiKey) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY is not configured on the server. Please add your Gemini key in the Settings > Secrets menu." 
      });
    }

    const ai = getAiClient();
    const typeLabel = type === "necropsy" ? "Necropsy (Post-Mortem) organs/tissue" : "Live Flock Behavior or farm environment";

    const systemInstruction = `You are an elite, highly experienced poultry veterinary pathologist and broiler production operations expert. Your target audience is farm supervisors of broiler breeding and broiler fattening projects. 
Your goal is to inspect the uploaded image and user notes, provide a professional preliminary assessment, suggest key differential poultry diagnoses, outline actionable post-mortem/diagnostic tests, and suggest supportive care.
Always specify that your analysis is a supporting diagnostic aid for rapid farm-side triage and must be verified by laboratory tests (PCR, ELISA, culture, histopathology). Use a supportive, professional, and clear tone. Don't sound alarmist, but emphasize accurate biosecurity.`;

    const promptText = `
Please analyze this image, which showcases a poultry flock scene of type: [${typeLabel}].
User Notes/Context about the flock: ${userNotes || "No extra notes provided by the supervisor."}

Format your diagnostic report in beautiful markdown with the following distinct sections:
1. **📌 Visual Pathological Observations**: Describe the visual signs you detect in detail (e.g., huddling patterns, feather quality, hock condition, litter dampness, or specific organ lesions like hemorrhages, exudates, plaques, or swelling).
2. **🧬 Potential Differential Diagnoses**: List the top 2 or 3 matching broiler diseases (e.g., Newcastle, Gumboro, Infectious Bronchitis, Coccidiosis, CRD, E. coli) with clear physiological justification based on the image.
3. **🔍 Recommended On-Farm Investigations**: Explain what other specific necropsy findings (e.g., proventriculus lining, bursa size, air sacs) or environmental factors (ammonia, temperature logs) the supervisor should look for.
4. **🔬 Laboratory Testing Plan**: Recommend the specific confirmatory tests (such as ELISA, RT-PCR, bacterial isolation, or antibiotic sensitivity test).
5. **🛡️ Immediate Actionable Protocols**: Suggest biosecurity adjustments, hydration/electrolyte support, temperature tweaks, or isolation steps of value for this specific scenario.
6. **⚠️ Official Veterinary Safety Warning**: State very clearly that visual-only assessment cannot replace a full professional necropsy and lab work.
`;

    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: image,
      },
    };

    const textPart = {
      text: promptText,
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2, // Keep it precise and clinical
      }
    });

    const outputText = response.text || "No analysis could be compiled. Please try another picture.";
    res.json({ analysis: outputText });

  } catch (error: any) {
    console.error("Gemini Image Analysis Error:", error);
    res.status(500).json({ error: error.message || "An unexpected error occurred during AI image assessment." });
  }
});

// 3. Endpoint: Interactive Chat with Avian Vet Expert
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages } = req.body; // Array of standard messages [{ role: 'user' | 'model', content: string }]

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request. Messages array is required." });
    }

    if (!apiKey) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY is not configured on the server. Please add your Gemini key in the Settings > Secrets menu." 
      });
    }

    const ai = getAiClient();
    
    // Convert generic chat history format into Gemini's client SDK format.
    // Gemni chat expects content parts or simple messages. Let's send the chat history.
    // Standard system instructions are loaded via config.
    const systemInstruction = `You are a friendly, professional Avian Veterinary Consultant specializing in Broiler Breeder management, Broiler Fattening, litter management, bird welfare, vaccination programs, and disease triage.
You help project directors, farmers, and veterinary supervisors troubleshoot mortality spikes, feeding drop-offs, and environmental shortcomings (such as ammonia buildup, ventilation stress, or temperature drops).
Always make sure to formulate your points cleanly in a human-readable format.
Provide suggestions with actionable broiler-farming values. Add clear warnings that diagnostic lab tests remain the gold standard. Do not provide diagnosis for human illnesses. Respond directly and objectively.`;

    // Map the incoming message trail
    const formattedContents = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.5,
      }
    });

    res.json({ reply: response.text || "" });

  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ error: error.message || "An unexpected error occurred during the consultation." });
  }
});

// 4. Vite middleware configuration or production serving
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    
    // Inject Vite development middleware
    app.use(vite.middlewares);
  } else {
    // Production Mode: Serve the static build index
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Poultry Disease Database server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
  });
}

bootstrap().catch(err => {
  console.error("Failed to start full-stack server:", err);
});
