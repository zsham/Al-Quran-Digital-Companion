
import { GoogleGenAI } from "@google/genai";

export const getJuzSummary = async (juzId: number, name: string): Promise<string> => {
  try {
    // Create instance inside the call to ensure it uses the most up-to-date API key
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
  } catch (error: any) {
    console.error("Error fetching Juz summary:", error);
    if (error?.message?.includes("quota") || error?.message?.includes("429")) {
      return "QUOTA_EXCEEDED";
    }
    return "Error: Could not retrieve summary. Please try again later.";
  }
};

export const translateVerse = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Translate the following Quranic verse from Arabic into ${targetLanguage}. 
      Arabic Text: "${text}"
      
      Requirements:
      1. Provide only the direct translation.
      2. Maintain a respectful and accurate tone.
      3. Do not include the original Arabic or any introductory remarks.`,
      config: {
        temperature: 0.3,
      }
    });

    return response.text?.trim() || "Translation error.";
  } catch (error: any) {
    console.error("Translation error:", error);
    if (error?.message?.includes("quota") || error?.message?.includes("429")) {
      return "QUOTA_EXCEEDED";
    }
    return "Could not translate at this moment.";
  }
};
