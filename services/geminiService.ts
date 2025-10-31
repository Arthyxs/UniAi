
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

export const generateResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: `Usuário: ${prompt}`,
        config: {
            systemInstruction: "Você é Uni, um assistente pessoal amigável e prestativo. Suas respostas devem ser concisas, conversacionais e em português do Brasil. Não use formatação markdown.",
            temperature: 0.7,
            topP: 1,
            topK: 32,
        },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Desculpe, não consegui processar seu pedido no momento.";
  }
};
