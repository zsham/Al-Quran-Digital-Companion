
import { GoogleGenAI } from "@google/genai";

export const getJuzSummary = async (juzId: number, name: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a concise, inspirational summary and key spiritual lessons for Juz ${juzId} (${name}) of the Al-Quran. Use a professional, respectful tone. Focus on the main themes. Return in Markdown format.`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text || "Summary unavailable at this time.";
  } catch (error) {
    console.error("Error fetching Juz summary:", error);
    return "Error: Could not retrieve summary. Please try again later.";
  }
};
