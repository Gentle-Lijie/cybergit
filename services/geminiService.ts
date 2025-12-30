
import { GoogleGenAI, Type } from "@google/genai";
import { UserData, AiPersona, Language } from '../types';

export const generatePersonaAnalysis = async (userData: UserData, lang: Language = 'en'): Promise<AiPersona> => {
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
    
    CRITICAL INSTRUCTION: Keep all descriptions extremely concise. Maximum 36 words per description. Bullet point style.
    
    The output MUST be in ${lang === 'zh' ? 'Chinese (Simplified)' : 'English'}.

    1. The Veteran: Analyze 'createdAt' and 'location'.
    2. The Specialist: Analyze primary languages. Identify niche/retro languages (like Smarty) as "surprises".
    3. The Creator: Analyze top projects by stars/forks. Calculate fork ratio.
    4. The AI Surfer: Look for keywords in repo names like 'midjourney', 'chatgpt', 'mcp', 'deep-research', 'ai', 'llm'.
    5. The Collaborator: List organizations.
    6. Final Persona: Generate a cool 2077 title (e.g., "Fullstack AI Geek") and a short summary sentence.
  `;

  // 1. Try Gemini if API Key is present
  if (process.env.API_KEY) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
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
  }

  // 2. Fallback to Pollinations.ai (OpenAI Compatible)
  console.log("Using Pollinations.ai fallback (openai-fast)...");
  
  const jsonStructure = {
      veteran: { title: "string", yearsSince: 0, location: "string", description: "string" },
      specialist: { primaryLang: "string", secondaryLangs: ["string"], nicheLang: "string", description: "string" },
      creator: { topProjects: ["string"], description: "string" },
      aiSurfer: { keywords: ["string"], description: "string" },
      collaborator: { orgNames: ["string"], description: "string" },
      finalPersona: { title: "string", keywords: ["string"], summary: "string" }
  };

  // We explicitly request JSON in the prompt as a backup for models that don't strictly adhere to response_format
  const pollinationsPrompt = `${systemPrompt}
  
  RETURN ONLY PURE JSON matching the structure below. Do not wrap in markdown code blocks.
  Structure:
  ${JSON.stringify(jsonStructure, null, 2)}
  `;

  try {
    const response = await fetch('https://text.pollinations.ai/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai-fast',
        messages: [
          { role: 'system', content: pollinationsPrompt },
          { role: 'user', content: JSON.stringify(summaryData) }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error(`Pollinations API Error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    let content = json.choices?.[0]?.message?.content;
    
    if (!content) throw new Error("No content from Pollinations AI");

    // Clean markdown code blocks if present (common in LLM output even when asked for JSON)
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(content) as AiPersona;
  } catch (err) {
    console.error("Pollinations AI failed:", err);
    // If both fail, we might want to return a mock or throw. Throwing allows the UI to handle it.
    throw new Error("Failed to generate persona via Fallback AI.");
  }
};
