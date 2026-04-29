import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  const { query } = req.body;

  try {
    // 1. Use the Lite model - it has the highest free RPM (Requests Per Minute)
    const model = "gemini-2.5-flash-lite";

    const config = {
      // 2. DISABLE Thinking Mode for Free Tier (saves 90% of token usage)
      // thinkingConfig: { thinkingLevel: 'high' },

      tools: [{ googleSearch: {} }],
      systemInstruction:
        "Assistant for lizardinteractive.online. Keep answers concise.",
    };

    const result = await ai.models.generateContent({
      model,
      config,
      contents: [{ role: "user", parts: [{ text: query }] }],
    });

    res.status(200).json({
      answer: result.text ?? "No answer found.",
    });
  } catch (error: any) {
    // If you hit a 429 now, it just means you need to wait 60 seconds
    res.status(error.status || 500).json({ error: error.message });
  }
}