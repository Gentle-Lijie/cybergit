
import { GoogleGenAI, Type } from "@google/genai";
import { UserData, AiPersona, Language, AnalysisResult, ProcessedLanguage } from '../types';

// Mock AI Persona for Demo Mode
const getMockPersona = (lang: string): AiPersona => {
    const isZh = lang === 'zh';
    return {
        veteran: {
            title: isZh ? "传奇黑客" : "Netrunner Legend",
            yearsSince: 12,
            location: isZh ? "新东京, 第七区" : "Neo-Tokyo, Sector 7",
            description: isZh ? "自2013年起潜伏在阴影中，数据足迹遍布全球。" : "Operating from the shadows of Neo-Tokyo since 2013."
        },
        specialist: {
            primaryLang: "TypeScript",
            secondaryLangs: ["Rust", "Python", "Go"],
            nicheLang: "Assembly",
            description: isZh ? "精通现代网络协议与底层系统入侵。" : "Master of modern web protocols with low-level system hacking capabilities."
        },
        creator: {
            topProjects: ["peinture", "midjourney-prompt-generator"],
            description: isZh ? "生成式AI工具与神经接口架构师。" : "Architect of generative AI tools and neural interface bridges."
        },
        aiSurfer: {
            keywords: ["generative-ai", "prompt-engineering", "neural-net"],
            description: isZh ? "深度参与AI革命，驾驭奇点浪潮。" : "Deeply entrenched in the AI revolution, surfing the singularity wave."
        },
        collaborator: {
            orgNames: ["Tyrell Corp", "Resistance"],
            description: isZh ? "游走于公司与反抗军之间的双重代理人。" : "Double agent working for both the Corp and the Resistance."
        },
        finalPersona: {
            title: isZh ? "赛博架构师" : "Cyberpunk Architect",
            keywords: ["AI", "Cyberpunk", "Fullstack"],
            summary: isZh ? "一位将艺术愿景与算法精度完美融合的代码编织者。" : "A legendary code-weaver blending artistic vision with algorithmic precision."
        }
    };
};

export const generatePersonaAnalysis = async (
  userData: UserData, 
  analysis: AnalysisResult,
  languages: ProcessedLanguage[],
  lang: Language = 'en'
): Promise<AiPersona> => {
  // --- Check for Demo User ---
  if (userData.login === 'dev_runner') {
      // Simulate network delay for realism
      await new Promise(resolve => setTimeout(resolve, 800));
      return getMockPersona(lang);
  }

  // Construct a highly optimized summary payload using processed stats
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
  const apiKey = process.env.API_KEY || process.env.VITE_GEMINI_API_KEY
  if (apiKey) {
    const ai = new GoogleGenAI({ apiKey });
    
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

  // 2. Try Custom API Proxy
  try {
    const response = await fetch('https://cybergit-api.u14.app/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: JSON.stringify(summaryData),
        lang: lang
      })
    });

    if (response.ok) {
        const data = await response.json();
        return data as AiPersona;
    } else {
        console.warn(`Custom API Proxy returned status ${response.status}. Falling back...`);
    }
  } catch (err) {
    console.warn("Custom API Proxy failed, falling back to Pollinations:", err);
  }

  // 3. Fallback to Pollinations.ai (OpenAI Compatible)
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
