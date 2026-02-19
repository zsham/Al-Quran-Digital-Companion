
import { GoogleGenAI } from "@google/genai";

const getAIInstance = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getJuzSummary = async (juzId: number, name: string): Promise<string> => {
  try {
    const ai = getAIInstance();
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

export const translateVerse = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    const ai = getAIInstance();
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
  } catch (error) {
    console.error("Translation error:", error);
    return "Could not translate at this moment.";
  }
};
