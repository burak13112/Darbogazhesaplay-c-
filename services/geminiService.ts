import { CalculationResult } from '../types';

// Config sourced from user reference
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL_ID = "deepseek/deepseek-r1-0528:free"; 

// --- ROBUST API KEY DETECTION ---
// Hem Vite (import.meta.env) hem de Node/Vercel (process.env) ortamlarını kontrol eder.
// "Bulunamadı" hatasını çözmek için tüm varyasyonlara bakar.
const getApiKeys = (): string[] => {
  const keys: string[] = [];

  const addIfValid = (k: any) => {
    if (k && typeof k === 'string' && k.length > 5) keys.push(k);
  };

  // 1. Vite Environment (Client Side Standart)
  // @ts-ignore
  addIfValid(import.meta.env.VITE_API_KEY);
  // @ts-ignore
  addIfValid(import.meta.env.VITE_API_KEY1);
  // @ts-ignore
  addIfValid(import.meta.env.VITE_API_KEY2);
  
  // 2. Direct Environment (Bazı konfigürasyonlarda VITE_ öneki olmadan gelir)
  // @ts-ignore
  addIfValid(import.meta.env.API_KEY);
  // @ts-ignore
  addIfValid(import.meta.env.API_KEY1);
  // @ts-ignore
  addIfValid(import.meta.env.API_KEY2);

  // 3. Process Environment (Node/Server Side uyumluluğu)
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env) {
      // @ts-ignore
      addIfValid(process.env.API_KEY);
      // @ts-ignore
      addIfValid(process.env.API_KEY1);
      // @ts-ignore
      addIfValid(process.env.API_KEY2);
      // @ts-ignore
      addIfValid(process.env.VITE_API_KEY);
    }
  } catch (e) {
    // process erişimi engellendiyse yut
  }

  // Duplicate'leri temizle
  return [...new Set(keys)];
};

const makeRequest = async (apiKey: string, prompt: string): Promise<any> => {
  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": typeof window !== 'undefined' ? window.location.href : "https://pcdarbogaz.vercel.app", 
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
      // DeepSeek R1 için reasoning flag'i
      include_reasoning: true,
      temperature: 0.6
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("API Error Body:", errText);
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
};

export const analyzeBottleneck = async (
  cpu: string,
  gpu: string,
  resolution: string
): Promise<CalculationResult> => {
  
  const keys = getApiKeys();
  
  const fallbackResult: CalculationResult = {
    bottleneckPercentage: 0,
    bottleneckType: 'None',
    estimatedFps: 0,
    explanation: "Bağlantı kurulamadı. API anahtarı eksik veya hatalı yapılandırılmış.",
    tips: ["API Key tanımlarını kontrol et.", "Vercel environment variables ayarlarını kontrol et."]
  };

  if (keys.length === 0) {
    console.error("CRITICAL: No API keys found in any environment variable source.");
    return fallbackResult;
  }

  const prompt = `
    Sen SykoLLM SUPER PRO (DeepSeek R1) mantığıyla çalışan uzman bir donanım analistisin.
    
    Analiz Edilecek Sistem:
    CPU: ${cpu}
    GPU: ${gpu}
    Çözünürlük: ${resolution}

    Görevin:
    Bu sistemdeki darboğaz (bottleneck) durumunu hesapla ve saf JSON formatında yanıt ver.
    
    Beklenen JSON Formatı:
    {
      "bottleneckPercentage": number (0-100),
      "bottleneckType": "CPU" | "GPU" | "None",
      "estimatedFps": number,
      "explanation": "Kısa, kullanıcı dostu Türkçe açıklama",
      "tips": ["Tavsiye 1", "Tavsiye 2", "Tavsiye 3"]
    }

    ÖNEMLİ: Yanıtın sadece JSON olsun. Markdown bloğu veya <think> tag'i içerme.
  `;

  // Key Rotation Logic
  for (let i = 0; i < keys.length; i++) {
    const currentKey = keys[i];
    try {
      console.log(`API İsteği gönderiliyor (Key Index: ${i})...`);
      const data = await makeRequest(currentKey, prompt);
      
      let content = data.choices?.[0]?.message?.content;
      
      // DeepSeek R1 "reasoning" içeriği bazen content'e sızabilir veya ayrı gelir.
      // Biz sadece content'i işliyoruz ama <think> bloklarını temizlememiz lazım.
      if (content) {
        // <think> bloklarını temizle
        content = content.replace(/<think>[\s\S]*?<\/think>/g, '');
        // Markdown temizliği
        content = content.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
          const parsed = JSON.parse(content);
          return {
            bottleneckPercentage: Number(parsed.bottleneckPercentage) || 0,
            bottleneckType: (parsed.bottleneckType as 'CPU' | 'GPU' | 'None') || 'None',
            estimatedFps: Number(parsed.estimatedFps) || 60,
            explanation: parsed.explanation || "Analiz tamamlandı.",
            tips: Array.isArray(parsed.tips) ? parsed.tips : ["Sürücülerini güncelle."]
          };
        } catch (jsonError) {
          console.error("JSON Parse Hatası:", jsonError, "Gelen Veri:", content);
        }
      }
    } catch (error) {
      console.warn(`Key ${i} failed:`, error);
      // Continue to next key
    }
  }

  return {
    ...fallbackResult,
    explanation: "Sunucu yanıt vermedi. Lütfen daha sonra tekrar deneyin."
  };
};