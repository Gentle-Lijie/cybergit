
import { GoogleGenAI, Type } from "@google/genai";
import { UserData, AiPersona, Language, AnalysisResult, ProcessedLanguage } from '../types';

export const generatePersonaAnalysis = async (
  userData: UserData, 
  analysis: AnalysisResult,
  languages: ProcessedLanguage[],
  lang: Language = 'en'
): Promise<AiPersona> => {
  // Construct a highly optimized summary payload using processed stats
  // This avoids sending raw data (like 100+ repo objects) to the LLM
  const summaryData = {
    identity: {
        login: userData.login,
        name: userData.name,
        joined: new Date(userData.createdAt).getFullYear(),
        location: userData.location,
        orgs: userData.organizations.nodes.map(o => o.name || o.login),
    },
    stats: {
        stars: analysis.totalStars,
        forks: analysis.totalForks,
        followers: analysis.followers,
        total_contributions: analysis.breakdown.commits + analysis.breakdown.prs + analysis.breakdown.issues,
    },
    stack: languages.slice(0, 8).map(l => `${l.name} (${l.percentage}%)`),
    habits: {
        chronotype: analysis.timeCategory,
        weekend_warrior: analysis.isWeekendWarrior,
        longest_streak: analysis.longestStreak
    },
    interests: analysis.topTopics.slice(0, 10).map(t => t.name),
    top_projects: analysis.topReposList.map(r => ({
        name: r.name,
        desc: r.description,
        stars: r.stargazerCount
    })),
    // Included flat list for name-based keyword detection (AI Surfer persona)
    all_repo_names: userData.repositories.nodes.map(r => r.name)
  };

  console.log("AI Summary Payload:", summaryData);

  const systemPrompt = `
    I am a cyberpunk analyst from 2077, clad in a fluorescent exoskeleton. My mind navigates the sea of ​​code, using cold data as my pen to sculpt the unique digital soul of every developer in the cyber world. I excel at deeply analyzing GitHub user behavior patterns, revealing their underlying coding philosophies, technical expertise, and community influence. My analytical style is profound, humorous, and futuristic, focusing on people and infusing each report with soul and insight.
    
    CRITICAL INSTRUCTION: Keep all descriptions extremely concise. Maximum 50 words per description. Bullet point style.
    
    The output MUST be in ${lang === 'zh' ? 'Chinese (Simplified)' : 'English'}.

    1. The Veteran: Analyze 'joined' and 'location'.
    2. The Specialist: Analyze 'stack' (primary languages). Identify niche/retro languages as "surprises".
    3. The Creator: Analyze 'stats' (stars/forks) and 'top_projects'.
    4. The AI Surfer: Look for keywords in 'all_repo_names' like 'midjourney', 'chatgpt', 'mcp', 'deep-research', 'ai', 'llm'.
    5. The Collaborator: List 'orgs'.
    6. Final Persona: Generate a cool cyberpunk title (e.g., "Fullstack AI Geek") and a short summary sentence.
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
    throw new Error("Failed to generate persona via Fallback AI.");
  }
};
