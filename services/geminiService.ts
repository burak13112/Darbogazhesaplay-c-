import { CalculationResult } from '../types';

// OPENROUTER CONFIG
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
// Kanka senin istediğin modelin güncel ücretsiz versiyonu bu
const MODEL_ID = "deepseek/deepseek-r1-0528:free"; 

// --- API KEY YÖNETİMİ ---
// Anahtarları doğrudan alıyoruz ki Vite build ederken sorun yaşamasın.
const getApiKeys = (): string[] => {
  // @ts-ignore
  const k1 = import.meta.env.VITE_API_KEY;
  // @ts-ignore
  const k2 = import.meta.env.VITE_API_KEY2;
  
  const keys: string[] = [];
  if (k1 && typeof k1 === 'string' && k1.length > 5) keys.push(k1);
  if (k2 && typeof k2 === 'string' && k2.length > 5) keys.push(k2);
  
  return keys;
};

// Tekil İstek Atma Fonksiyonu
const makeRequest = async (apiKey: string, prompt: string): Promise<any> => {
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
      // DeepSeek JSON modunu her zaman tam desteklemez ama prompt ile zorluyoruz
      temperature: 0.7 
    })
  });

  if (!response.ok) {
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
  
  // Fallback (Hata durumunda dönecek veri)
  const fallbackResult: CalculationResult = {
    bottleneckPercentage: 0,
    bottleneckType: 'None',
    estimatedFps: 0,
    explanation: "Bağlantı kurulamadı. Lütfen sayfayı yenileyip tekrar deneyin.",
    tips: ["İnternet bağlantınızı kontrol edin.", "AdBlocker varsa kapatıp deneyin."]
  };

  if (keys.length === 0) {
    console.error("HATA: Hiçbir API anahtarı bulunamadı (VITE_API_KEY veya VITE_API_KEY2).");
    return { ...fallbackResult, explanation: "Sistem yapılandırma hatası: API Anahtarı eksik." };
  }

  const prompt = `
    Sen uzman bir PC donanım analistisin. Aşağıdaki sistem için darboğaz analizi yap.
    
    Sistem:
    CPU: ${cpu}
    GPU: ${gpu}
    Çözünürlük: ${resolution}

    Görevin:
    1. Darboğaz yüzdesini hesapla (0-100).
    2. Darboğaz kaynağını belirle (CPU, GPU veya None).
    3. Tahmini FPS ver.
    4. Türkçe açıklama ve tavsiye yaz.

    ÇOK ÖNEMLİ: Yanıtın SADECE geçerli bir JSON objesi olmalı. Başka hiçbir metin, <think> etiketi veya markdown kullanma.
    
    JSON Formatı:
    {
      "bottleneckPercentage": number,
      "bottleneckType": "CPU" | "GPU" | "None",
      "estimatedFps": number,
      "explanation": "kısa türkçe açıklama",
      "tips": ["tavsiye 1", "tavsiye 2", "tavsiye 3"]
    }
  `;

  // --- API KEY ROTASYON MANTIĞI ---
  // Sırayla anahtarları dene. Biri çalışırsa sonucu döndür.
  for (let i = 0; i < keys.length; i++) {
    const currentKey = keys[i];
    try {
      console.log(`Deneme yapılıyor: Anahtar ${i + 1}`);
      const data = await makeRequest(currentKey, prompt);
      
      let content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error("Boş yanıt");

      // DeepSeek R1 Temizliği
      // <think> bloklarını sil
      content = content.replace(/<think>[\s\S]*?<\/think>/g, '');
      // Markdown kod bloklarını sil
      content = content.replace(/```json/g, '').replace(/```/g, '').trim();

      // JSON Parse
      const parsed = JSON.parse(content);

      // Başarılı olursa döndür
      return {
        bottleneckPercentage: Number(parsed.bottleneckPercentage) || 0,
        bottleneckType: (parsed.bottleneckType as 'CPU' | 'GPU' | 'None') || 'None',
        estimatedFps: Number(parsed.estimatedFps) || 60,
        explanation: parsed.explanation || "Analiz tamamlandı.",
        tips: Array.isArray(parsed.tips) ? parsed.tips : ["Sistemini güncel tut."]
      };

    } catch (error) {
      console.warn(`Anahtar ${i + 1} başarısız oldu:`, error);
      // Eğer bu son anahtarsa ve başarısız olduysa, döngü biter ve aşağıya düşer.
      // Değilse, döngü bir sonraki anahtara geçer.
    }
  }

  // Döngü bitti ve hiçbir anahtar çalışmadıysa
  return {
    ...fallbackResult,
    explanation: "Sunucu şu anda çok yoğun veya tüm anahtarların limiti dolmuş durumda. Lütfen daha sonra tekrar dene."
  };
};