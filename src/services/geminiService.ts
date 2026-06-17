import { GoogleGenAI } from "@google/genai";

const geminiApiKey = process.env.GEMINI_API_KEY;
const openrouterApiKey = process.env.OPENROUTER_API_KEY;
const openrouterModel = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";

export interface MarketAnalysis {
  analysis_en: string;
  analysis_ur: string;
  key_factors: {
    factor: string;
    impact: "positive" | "negative" | "neutral";
    detail: string;
  }[];
  provider?: "gemini" | "openrouter";
}

export async function getMarketAnalysis(
  crop: string, 
  city: string, 
  currentPrice: number, 
  predictedPrice: number, 
  trend: string, 
  percChange: string,
  preferredProvider?: "gemini" | "openrouter"
): Promise<MarketAnalysis> {
  let activeProvider: "gemini" | "openrouter";
  
  if (preferredProvider) {
    activeProvider = preferredProvider;
  } else if (openrouterApiKey && !geminiApiKey) {
    activeProvider = "openrouter";
  } else {
    activeProvider = "gemini";
  }

  try {
    if (activeProvider === "openrouter") {
      if (!openrouterApiKey) {
        throw new Error("OPENROUTER_API_KEY is not configured");
      }
      const result = await getOpenRouterAnalysis(crop, city, currentPrice, predictedPrice, trend, percChange);
      return { ...result, provider: "openrouter" };
    } else {
      if (!geminiApiKey) {
        throw new Error("GEMINI_API_KEY is not configured");
      }
      const result = await getGeminiAnalysis(crop, city, currentPrice, predictedPrice, trend, percChange);
      return { ...result, provider: "gemini" };
    }
  } catch (error) {
    console.error(`${activeProvider} Analysis Error:`, error);
    // Return a fallback analysis if AI fails
    return {
      analysis_en: `The market for ${crop} in ${city} is showing a ${trend} trend. This is driven by standard seasonal factors and regional demand patterns.`,
      analysis_ur: `${city} میں ${crop} کی منڈی میں قیمتوں کا ${trend === 'upward' ? 'اضافہ' : 'کمی'} کا رجحان ہے۔ یہ موسمی حالات اور طلب کے مطابق ہے۔`,
      key_factors: [
        { factor: "Seasonal Demand", impact: "neutral", detail: "Typical seasonal flow" },
        { factor: "Weather", impact: "neutral", detail: "Normal regional conditions" },
        { factor: "Supply", impact: "neutral", detail: "Steady arrivals in Mandi" },
        { factor: "Market Sentiment", impact: "neutral", detail: "Stable outlook" }
      ],
      provider: activeProvider
    };
  }
}

function getPrompt(
  crop: string, 
  city: string, 
  currentPrice: number, 
  predictedPrice: number, 
  trend: string, 
  percChange: string
): string {
  return `
    You are a Pakistani agricultural market expert.
    Crop: ${crop}, City: ${city}
    Current Price: ${currentPrice} PKR per 40kg
    Predicted Price: ${predictedPrice} PKR (${percChange})
    Trend: ${trend}
    
    Write a market analysis explaining WHY prices will move with this ${trend} trend.
    Mention: seasonal factors, weather impact, supply/demand ripples, 
    government policies, festival effects (like Eid or Ramzan), and import/export dynamics.
    
    Also list exactly 4 key factors with their impact (positive/negative/neutral) and a brief detail.
    
    Respond ONLY in valid JSON format with this exact structure:
    {
      "analysis_en": "English paragraph text...",
      "analysis_ur": "Urdu paragraph text (use correct Noto Nastaliq script style)...",
      "key_factors": [
        {"factor": "Name", "impact": "positive|negative|neutral", "detail": "brief summary"}
      ]
    }
  `;
}

async function getGeminiAnalysis(
  crop: string,
  city: string,
  currentPrice: number,
  predictedPrice: number,
  trend: string,
  percChange: string
): Promise<Omit<MarketAnalysis, "provider">> {
  const ai = new GoogleGenAI({ apiKey: geminiApiKey });
  const prompt = getPrompt(crop, city, currentPrice, predictedPrice, trend, percChange);

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from AI");
  
  return JSON.parse(text);
}

async function getOpenRouterAnalysis(
  crop: string,
  city: string,
  currentPrice: number,
  predictedPrice: number,
  trend: string,
  percChange: string
): Promise<Omit<MarketAnalysis, "provider">> {
  const prompt = getPrompt(crop, city, currentPrice, predictedPrice, trend, percChange);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${openrouterApiKey}`,
      "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
      "X-Title": "Mandi Rate App"
    },
    body: JSON.stringify({
      model: openrouterModel,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: {
        type: "json_object"
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from OpenRouter");

  return JSON.parse(text);
}
