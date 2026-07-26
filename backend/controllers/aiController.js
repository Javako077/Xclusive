import { GoogleGenAI } from "@google/genai";

let ai = null;

function getAiClient() {
  if (!ai && process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  if (!ai) {
    throw new Error("GEMINI_API_KEY environment variable is missing. Please configure it in your .env file.");
  }
  return ai;
}

// @desc    Ask Xclusive AI Coach for workout/nutrition recommendations
// @route   POST /api/ai/coach
// @access  Public
export const askAiCoach = async (req, res) => {
  try {
    const { prompt, goal, experienceLevel, focusArea } = req.body;

    if (!prompt || typeof prompt !== "string") {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }

    const aiClient = getAiClient();

    const systemInstruction = `You are Xclusive AI Coach, an elite strength & conditioning specialist, exercise physiologist, and sports nutritionist at Xclusive Athletic Lab.
Provide motivating, scientifically grounded, actionable, and structured advice for workout plans, nutrition, macro calculations, exercise form, recovery protocols, and performance metrics.
Format your responses cleanly using Markdown (headers, bullet points, bold text). Maintain an energetic, athletic, elite, and high-performance tone.`;

    const fullPrompt = `ATHLETE GOAL: ${goal || "Strength & Athletic Performance"}
EXPERIENCE LEVEL: ${experienceLevel || "Intermediate"}
FOCUS AREA: ${focusArea || "Full Body Transformation"}

ATHLETE QUESTION / REQUEST:
${prompt}`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.6-flash",
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "No output produced from Xclusive AI.";
    res.json({ reply });
  } catch (err) {
    console.error("[AI Coach Controller Error]", err);
    res.status(500).json({
      error: err?.message || "Failed to communicate with Xclusive AI Coach.",
    });
  }
};
