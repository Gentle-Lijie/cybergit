
import { GoogleGenAI, Type } from "@google/genai";
import { UserData, AiPersona } from '../types';

export const generatePersonaAnalysis = async (userData: UserData): Promise<AiPersona> => {
  if (!process.env.API_KEY) {
     throw new Error("API_KEY not found in environment.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Prepare a simplified dataset for Gemini to avoid hitting token limits
  const summaryData = {
    login: userData.login,
    name: userData.name,
    createdAt: userData.createdAt,
    location: userData.location,
    organizations: userData.organizations.nodes.map(o => o.name || o.login),
    repositories: userData.repositories.nodes.map(r => ({
      name: r.name,
      stars: r.stargazerCount,
      forks: r.forkCount,
      languages: r.languages.edges.map(e => e.node.name)
    }))
  };

  const systemPrompt = `
    You are a cyberpunk profiler for the year 2077. Analyze this GitHub user data and create a deep, witty, "character-driven" annual report persona.
    
    CRITICAL INSTRUCTION: Keep all descriptions extremely concise. Maximum 15 words per description. Bullet point style.
    
    1. The Veteran: Analyze 'createdAt' and 'location'.
    2. The Specialist: Analyze primary languages. Identify niche/retro languages (like Smarty) as "surprises".
    3. The Creator: Analyze top projects by stars/forks. Calculate fork ratio.
    4. The AI Surfer: Look for keywords in repo names like 'midjourney', 'chatgpt', 'mcp', 'deep-research', 'ai', 'llm'.
    5. The Collaborator: List organizations.
    6. Final Persona: Generate a cool 2077 title (e.g., "Fullstack AI Geek") and a short summary sentence.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: JSON.stringify(summaryData),
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          veteran: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              yearsSince: { type: Type.NUMBER },
              location: { type: Type.STRING },
              description: { type: Type.STRING },
            }
          },
          specialist: {
            type: Type.OBJECT,
            properties: {
              primaryLang: { type: Type.STRING },
              secondaryLangs: { type: Type.ARRAY, items: { type: Type.STRING } },
              nicheLang: { type: Type.STRING },
              description: { type: Type.STRING },
            }
          },
          creator: {
            type: Type.OBJECT,
            properties: {
              topProjects: { type: Type.ARRAY, items: { type: Type.STRING } },
              description: { type: Type.STRING },
            }
          },
          aiSurfer: {
            type: Type.OBJECT,
            properties: {
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              description: { type: Type.STRING },
            }
          },
          collaborator: {
             type: Type.OBJECT,
             properties: {
               orgNames: { type: Type.ARRAY, items: { type: Type.STRING } },
               description: { type: Type.STRING }
             }
          },
          finalPersona: {
             type: Type.OBJECT,
             properties: {
               title: { type: Type.STRING },
               keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
               summary: { type: Type.STRING }
             }
          }
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No analysis generated");
  return JSON.parse(text) as AiPersona;
};
