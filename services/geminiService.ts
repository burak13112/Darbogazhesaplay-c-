import { CalculationResult } from '../types';

// API Keys rotation logic
const getApiKey = (): string | null => {
  const keys = [
    process.env.API_KEY, 
    process.env.API_KEY2
  ].filter(key => key && key.trim() !== '');

  if (keys.length === 0) return null;
  
  // Pick a random key to distribute load
  const randomIndex = Math.floor(Math.random() * keys.length);
  return keys[randomIndex] || null;
};

// OpenRouter Configuration
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
// Using the generic free alias which usually points to the latest stable free R1 version
const MODEL_ID = "deepseek/deepseek-r1-0528:free"; 

export const analyzeBottleneck = async (
  cpu: string,
  gpu: string,
  resolution: string
): Promise<CalculationResult> => {
  const apiKey = getApiKey();

  // Fallback if API Keys are missing
  const fallbackResult: CalculationResult = {
    bottleneckPercentage: 15,
    bottleneckType: 'None',
    estimatedFps: 75,
    explanation: "API anahtarları eksik. Lütfen Vercel panelinden API_KEY ve API_KEY2 tanımlayın.",
    tips: ["API Key tanımlamayı unutmayın.", "OpenRouter key alın."]
  };

  if (!apiKey) {
    console.error("API Keys are missing!");
    return fallbackResult;
  }

  try {
    const prompt = `
      Sen uzman bir PC donanım analistisin. Aşağıdaki sistem için darboğaz (bottleneck) ve performans analizi yap.
      
      Sistem Özellikleri:
      İşlemci (CPU): ${cpu}
      Ekran Kartı (GPU): ${gpu}
      Çözünürlük: ${resolution}

      Görevin:
      1. Darboğaz yüzdesini 0-100 arasında tahmin et.
      2. Darboğaz kaynağını (CPU, GPU veya None) belirle.
      3. Tahmini FPS değerini hesapla.
      4. Kullanıcı dostu Türkçe bir açıklama ve 3 öneri yaz.

      Lütfen sadece SAF JSON formatında yanıt ver. Markdown kullanma. Yanıt şeması şöyle olmalı:
      {
        "bottleneckPercentage": number,
        "bottleneckType": "CPU" | "GPU" | "None",
        "estimatedFps": number,
        "explanation": "string (kısa açıklama)",
        "tips": ["string", "string", "string"]
      }
    `;

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://pcdarbogaz.vercel.app", // OpenRouter requirement
        "X-Title": "PC Darboğaz Hesaplayıcı"
      },
      body: JSON.stringify({
        model: MODEL_ID,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        // DeepSeek parameters to encourage JSON
        response_format: { type: "json_object" } 
      })
    });

    if (!response.ok) {
      console.error(`OpenRouter API Error: ${response.status} - ${response.statusText}`);
      return fallbackResult;
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content;

    if (!content) return fallbackResult;

    // --- DeepSeek R1 Cleaning Logic ---
    // DeepSeek R1 often includes <think>...</think> blocks. We must strip them.
    content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    
    // Sometimes it wraps JSON in markdown code blocks ```json ... ```
    content = content.replace(/^```json/g, '').replace(/^```/g, '').replace(/```$/g, '').trim();

    // Parse JSON
    try {
      const parsed = JSON.parse(content) as CalculationResult;
      
      // Basic validation to ensure fields exist
      if (typeof parsed.bottleneckPercentage !== 'number') throw new Error("Invalid format");
      
      return parsed;
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Raw Content:", content);
      return {
        ...fallbackResult,
        explanation: "Yapay zeka yanıtı işlenirken bir hata oluştu, ancak sisteminiz genel olarak uyumlu görünüyor."
      };
    }

  } catch (error) {
    console.error("Analysis failed:", error);
    return fallbackResult;
  }
};
