
import { GoogleGenAI, Type } from "@google/genai";
import { MathExplanation, AppSettings } from "../types";

export const getMathExplanation = async (topic: string, settings: AppSettings): Promise<MathExplanation> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Explain the mathematical concept or formula: "${topic}" for a student in Class ${settings.gradeLevel}.`,
    config: {
      systemInstruction: `You are an expert Mathematics Formula Intelligence System for school students.
      The current target student is in Grade/Class ${settings.gradeLevel}.
      Explanation depth: ${settings.explanationDepth}.
      
      Provide a clean, structured JSON response with the following keys:
      - formulaName: The common name.
      - exactFormula: The mathematical expression in clear text format.
      - intuitiveMeaning: A simple, logical explanation of what's happening.
      - whenToUse: Contexts where this formula is the primary choice.
      - whenNotToUse: Edge cases or similar concepts where it's inappropriate.
      - commonMistake: The #1 error students make.
      - solvedExample: An object with 'steps' (array of strings) and 'result' (string). Use simple numbers.
      - trapQuestion: An object with 'question' and 'explanation' that highlights a misconception.
      - memoryTrick: A visual analogy or mnemonic.
      - relatedFormulas: Array of names of related concepts.

      RULES:
      - Use simple, clear language appropriate for Grade ${settings.gradeLevel}.
      - Focus on clarity and visual intuition.
      - Do not copy textbook definitions.
      - Strictly follow the JSON structure.`,
      thinkingConfig: {
        thinkingBudget: settings.enableThinking ? 16000 : 0
      },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          formulaName: { type: Type.STRING },
          exactFormula: { type: Type.STRING },
          intuitiveMeaning: { type: Type.STRING },
          whenToUse: { type: Type.STRING },
          whenNotToUse: { type: Type.STRING },
          commonMistake: { type: Type.STRING },
          solvedExample: {
            type: Type.OBJECT,
            properties: {
              steps: { type: Type.ARRAY, items: { type: Type.STRING } },
              result: { type: Type.STRING }
            },
            required: ["steps", "result"]
          },
          trapQuestion: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["question", "explanation"]
          },
          memoryTrick: { type: Type.STRING },
          relatedFormulas: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: [
          "formulaName", "exactFormula", "intuitiveMeaning", "whenToUse", 
          "whenNotToUse", "commonMistake", "solvedExample", "trapQuestion", 
          "memoryTrick", "relatedFormulas"
        ]
      }
    },
  });

  return JSON.parse(response.text);
};
