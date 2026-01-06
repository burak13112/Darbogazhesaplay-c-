import { CalculationResult } from '../types';

// Config
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
// Kullanıcının istediği spesifik model
const MODEL_ID = "deepseek/deepseek-r1-0528:free"; 

export const analyzeBottleneck = async (
  cpu: string,
  gpu: string,
  resolution: string
): Promise<CalculationResult> => {
  
  // Fallback (Yedek) Sonuç - API tamamen çalışmazsa
  const fallbackResult: CalculationResult = {
    bottleneckPercentage: 12,
    bottleneckType: 'None',
    estimatedFps: 80,
    explanation: "Bağlantı yoğunluğu nedeniyle şu an tahmini bir değer gösteriyoruz. Parçalarınız genel olarak uyumlu görünüyor.",
    tips: ["Arka plan uygulamalarını kapatın.", "Sürücülerinizi güncel tutun.", "Oyun ayarlarını optimize edin."]
  };

  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("API Key eksik! Lütfen .env dosyasını veya Vercel ayarlarını kontrol et.");
    return {
      ...fallbackResult,
      explanation: "API anahtarı eksik olduğu için varsayılan veriler gösteriliyor."
    };
  }

  const prompt = `
    Sen bir donanım uzmanısın. Aşağıdaki sistem için darboğaz (bottleneck) analizi yap.
    
    Sistem:
    CPU: ${cpu}
    GPU: ${gpu}
    Çözünürlük: ${resolution}

    Lütfen sonucu SADECE geçerli bir JSON formatında ver. Başka hiçbir metin, markdown (backtick) veya açıklama ekleme.
    
    Beklenen JSON Formatı:
    {
      "bottleneckPercentage": (0 ile 100 arası sayı),
      "bottleneckType": ("CPU" veya "GPU" veya "None"),
      "estimatedFps": (tahmini ortalama FPS, sayı),
      "explanation": "Kısa, net, samimi Türkçe bir açıklama (maksimum 2 cümle).",
      "tips": ["Kısa tavsiye 1", "Kısa tavsiye 2", "Kısa tavsiye 3"]
    }
  `;

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        // OpenRouter, sıralamada görünmek için bu headerları önerir
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
        // DeepSeek parametreleri
        temperature: 0.6,
        top_p: 0.9,
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API Hatası: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content;

    if (content) {
      // 1. DeepSeek R1 modelleri bazen <think>...</think> bloğu döndürür, bunu temizleyelim.
      content = content.replace(/<think>[\s\S]*?<\/think>/g, '');

      // 2. Markdown kod bloklarını temizleyelim (```json ... ```)
      content = content.replace(/```json/g, '').replace(/```/g, '').trim();

      try {
        const parsed = JSON.parse(content);
        return {
          bottleneckPercentage: parseFloat(parsed.bottleneckPercentage) || 0,
          bottleneckType: (parsed.bottleneckType as 'CPU' | 'GPU' | 'None') || 'None',
          estimatedFps: parseFloat(parsed.estimatedFps) || 60,
          explanation: parsed.explanation || "Analiz tamamlandı.",
          tips: Array.isArray(parsed.tips) ? parsed.tips.slice(0, 3) : []
        };
      } catch (jsonError) {
        console.error("JSON Parse Hatası:", jsonError, "Gelen Veri:", content);
      }
    }

  } catch (error) {
    console.error("API İsteği Başarısız:", error);
  }

  return fallbackResult;
};