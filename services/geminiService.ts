
import { GoogleGenAI, Type } from "@google/genai";
import { PlantReport, UserContext } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePlantImage = async (base64Image: string, context: UserContext): Promise<PlantReport> => {
  const modelName = 'gemini-3-pro-preview';
  
  const systemInstruction = `You are OpenNPlant — a Plant Scientist AI.
Your role is to analyze plant images and provide accurate, practical, and scientific plant health insights.

CONSTRAINTS:
- Base analysis ONLY on visible visual cues.
- Avoid overconfidence.
- Use simple, globally understandable language.
- Use these health levels: 'Healthy', 'Mild Stress', 'Moderate Stress', 'High Stress'.
- Focus on what the plant needs NEXT.
- Incorporate user inputs (watering, placement, location) into recommendations.
- If it's a re-scan (isRescan: true), compare current state with typical recovery paths.
- Adjust for climate if location data (lat/lng) is provided (e.g., urban pollution, heat).

OUTPUT STRUCTURE:
You MUST provide exactly 10 sections in the JSON:
1. Plant Identification
2. Growth Stage
3. Health Status (includes specific confidence note)
4. Visible Symptoms
5. Water & Sunlight Assessment
6. Possible Nutrient Concerns
7. Immediate Action Plan (3-5 steps)
8. Long-Term Care Tips
9. Growth & Recovery Timeline
10. Disclaimer`;

  const prompt = `Analyze this plant. 
Context from user:
- Last watered: ${context.lastWatered}
- Placement: ${context.placement}
- Type: ${context.plantingType}
- Location: ${context.location ? `Lat ${context.location.lat}, Lng ${context.location.lng}` : 'Unknown'}
- Is rescan: ${context.isRescan}

Return a valid JSON report following the OpenNPlant scientific schema.`;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: {
      parts: [
        { text: prompt },
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image
          }
        }
      ]
    },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          identification: {
            type: Type.OBJECT,
            properties: {
              commonName: { type: Type.STRING },
              scientificName: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ["commonName", "scientificName", "category"]
          },
          age: {
            type: Type.OBJECT,
            properties: {
              growthStage: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["growthStage", "description"]
          },
          health: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING },
              confidenceNote: { type: Type.STRING }
            },
            required: ["status", "confidenceNote"]
          },
          symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
          assessment: {
            type: Type.OBJECT,
            properties: {
              water: { type: Type.STRING },
              sunlight: { type: Type.STRING }
            },
            required: ["water", "sunlight"]
          },
          nutrientConcerns: { type: Type.ARRAY, items: { type: Type.STRING } },
          actionPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
          longTermTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          timeline: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stage: { type: Type.STRING },
                timeEstimation: { type: Type.STRING },
                details: { type: Type.STRING }
              }
            }
          },
          disclaimer: { type: Type.STRING },
          confidenceLevel: { type: Type.STRING }
        },
        required: ["identification", "age", "health", "symptoms", "assessment", "nutrientConcerns", "actionPlan", "longTermTips", "timeline", "disclaimer", "confidenceLevel"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  return JSON.parse(text) as PlantReport;
};
