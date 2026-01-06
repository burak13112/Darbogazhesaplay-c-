import { CalculationResult } from '../types';

// API Keys rotation logic
const getApiKey = (): string | null => {
  let candidates: (string | undefined)[] = [];

  // 1. VITE (Modern React) Kontrolü - Genellikle burası çalışır
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      candidates.push(import.meta.env.VITE_API_KEY);
      // @ts-ignore
      candidates.push(import.meta.env.VITE_API_KEY2);
      // @ts-ignore
      candidates.push(import.meta.env.API_KEY); // Bazı özel configlerde çalışabilir
    }
  } catch (e) {
    // import.meta desteklenmiyorsa geç
  }

  // 2. PROCESS.ENV (CRA / Next.js / Webpack) Kontrolü
  if (typeof process !== 'undefined' && process.env) {
    candidates.push(process.env.REACT_APP_API_KEY);
    candidates.push(process.env.REACT_APP_API_KEY2);
    candidates.push(process.env.NEXT_PUBLIC_API_KEY);
    candidates.push(process.env.VITE_API_KEY); // process.env içine inject edildiyse
    candidates.push(process.env.API_KEY);
    candidates.push(process.env.API_KEY2);
  }

  // Boş veya undefined olanları filtrele
  const validKeys = candidates.filter(key => key && typeof key === 'string' && key.trim().length > 10);

  if (validKeys.length === 0) {
    console.warn("API Anahtarı bulunamadı. Lütfen Vercel Env Variables kısmında anahtar isminin başına 'VITE_' veya 'REACT_APP_' eklediğinizden emin olun (Örn: VITE_API_KEY).");
    return null;
  }
  
  // Yük dağıtımı için rastgele bir anahtar seç
  const randomIndex = Math.floor(Math.random() * validKeys.length);
  return validKeys[randomIndex] as string;
};

// OpenRouter Configuration
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL_ID = "deepseek/deepseek-r1:free"; 

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
    explanation: "API anahtarı okunamadı. Vercel ayarlarında anahtar isminin 'VITE_API_KEY' olduğundan emin olun (Sadece 'API_KEY' tarayıcıda görünmez).",
    tips: ["Vercel > Settings > Environment Variables'a git.", "API_KEY adını VITE_API_KEY olarak değiştir.", "Projeyi Redeploy et."]
  };

  if (!apiKey) {
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
        "HTTP-Referer": "https://pcdarbogaz.vercel.app", 
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
        response_format: { type: "json_object" } 
      })
    });

    if (!response.ok) {
      // 401 hatası genellikle anahtarın yanlış veya boş gitmesinden kaynaklanır
      if (response.status === 401) {
         console.error("API Key Rejected. Key used starts with:", apiKey.substring(0, 5) + "...");
         return {
             ...fallbackResult,
             explanation: "API anahtarı reddedildi. Lütfen geçerli bir OpenRouter anahtarı kullanın."
         };
      }
      return fallbackResult;
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content;

    if (!content) return fallbackResult;

    // --- DeepSeek R1 Cleaning Logic ---
    content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    content = content.replace(/^```json/g, '').replace(/^```/g, '').replace(/```$/g, '').trim();

    try {
      const parsed = JSON.parse(content) as CalculationResult;
      if (typeof parsed.bottleneckPercentage !== 'number') throw new Error("Invalid format");
      return parsed;
    } catch (parseError) {
      return {
        ...fallbackResult,
        explanation: "Yapay zeka yanıtı işlenirken bir hata oluştu, ancak donanımlarınız uyumlu görünüyor."
      };
    }

  } catch (error) {
    console.error("Analysis failed:", error);
    return fallbackResult;
  }
};