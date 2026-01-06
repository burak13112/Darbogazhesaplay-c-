import { CalculationResult, Resolution } from '../types';
import { CPUS, GPUS } from '../constants';

// --- YEREL HESAPLAMA MOTORU (DUMMY MODEL) ---
// API Key yok, internet yok, sadece saf matematik ve mantık.

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const analyzeBottleneck = async (
  cpuName: string,
  gpuName: string,
  resName: string
): Promise<CalculationResult> => {
  
  // 1. Verilen isimlerden verileri bul
  const cpu = CPUS.find(c => c.name === cpuName);
  const gpu = GPUS.find(g => g.name === gpuName);

  // Eğer veri bulunamazsa (teorik olarak imkansız ama güvenli olsun)
  if (!cpu || !gpu) {
    return {
      bottleneckPercentage: 0,
      bottleneckType: 'None',
      estimatedFps: 60,
      explanation: "Donanım verisi okunamadı.",
      tips: ["Sayfayı yenileyip tekrar deneyin."]
    };
  }

  // 2. Çözünürlük Çarpanı
  // Çözünürlük arttıkça yük ekran kartına (GPU) biner, işlemcinin (CPU) önemi azalır.
  // 1080p: CPU çok önemli (Çarpan düşük, CPU bottleneck ihtimali yüksek)
  // 4K: GPU çok önemli (Çarpan yüksek, GPU bottleneck ihtimali yüksek)
  
  let resolutionFactor = 1.0; // 1080p Base
  if (resName === Resolution.R_1440P) resolutionFactor = 0.75; // 2K'da CPU yükü %25 azalır gibi düşün
  if (resName === Resolution.R_2160P) resolutionFactor = 0.55; // 4K'da CPU yükü neredeyse yarıya iner

  // 3. Darboğaz Hesaplama Formülü
  // CPU Gücü vs (GPU Gücü * Çözünürlük Çarpanı)
  // Örnek: 1080p'de 4090 (120 Puan) kullanırsan, CPU'nun da 120 olması gerekir.
  // 4K'da 4090 (120 Puan) kullanırsan, CPU'nun 120 * 0.55 = 66 olması yeterlidir.

  const effectiveGpuScore = gpu.score; 
  const requiredCpuScore = effectiveGpuScore * resolutionFactor; 

  let bottleneckPercentage = 0;
  let bottleneckType: 'CPU' | 'GPU' | 'None' = 'None';
  let explanation = "";
  let tips: string[] = [];

  const diff = requiredCpuScore - cpu.score;

  // --- SENARYO 1: İŞLEMCİ YETERSİZ (CPU BOTTLENECK) ---
  if (diff > 5) { // Tolerans payı 5
    bottleneckType = 'CPU';
    // Formül: Fark / Gereken * 100
    bottleneckPercentage = Math.min((diff / requiredCpuScore) * 100, 99); 
    
    explanation = `${cpu.name}, ${resName} çözünürlüğünde ${gpu.name} ekran kartını tam besleyemiyor. Ekran kartınız tam gücüne ulaşamayabilir.`;
    
    tips = [
      "Çözünürlüğü yükselterek (DSR/VSR ile) yükü ekran kartına bindirmeyi deneyin.",
      "İşlemciye yük bindiren (gölge, kalabalık nüfus) ayarları kısın.",
      "Arka plandaki gereksiz uygulamaları kapatın, işlemciyi rahatlatın."
    ];
  } 
  // --- SENARYO 2: EKRAN KARTI ZAYIF (GPU BOUND - Normal Durum ama aşırıysa uyarı verelim) ---
  else if (diff < -15) { 
    // İşlemci çok güçlü, ekran kartı zayıf kalıyor. 
    // Bu aslında "darboğaz" değil "ekran kartı tam güçte çalışıyor" demek ama kullanıcıya "GPU darboğazı" diye sunulur.
    bottleneckType = 'GPU';
    bottleneckPercentage = Math.min((Math.abs(diff) / cpu.score) * 100, 99);
    
    explanation = `Sisteminizde işlemci gayet güçlü ancak ekran kartınız bu çözünürlükte sınırda çalışıyor (%100 kullanım). Bu oyunlar için normaldir.`;
    
    tips = [
      "Grafik ayarlarını (AA, Doku Kalitesi) biraz düşürerek FPS artırabilirsiniz.",
      "DLSS veya FSR gibi teknolojileri Kalite/Performans modunda açın.",
      "Ekran kartı sürücülerinizin güncel olduğundan emin olun."
    ];
  } 
  // --- SENARYO 3: DENGELİ ---
  else {
    bottleneckType = 'None';
    bottleneckPercentage = Math.abs(diff); // Ufak bir yüzde kalsın (0-5 arası)
    explanation = "Harika! İşlemci ve Ekran kartınız birbirini çok iyi dengeliyor. Donanım uyumu mükemmel seviyede.";
    tips = [
      "Sisteminiz gayet dengeli, oyunun keyfini çıkarın.",
      "Sıcaklık değerlerini ara sıra kontrol etmeniz faydalı olur.",
      "FPS limitini monitörünüzün Hz değerine sabitleyerek daha akıcı bir deneyim alabilirsiniz."
    ];
  }

  // Yüzde temizliği
  bottleneckPercentage = Math.floor(bottleneckPercentage);
  if (bottleneckPercentage < 0) bottleneckPercentage = 0;

  // 4. FPS Tahmini (Çok kaba bir tahmin)
  // Base skor: Min(CPU, GPU)
  // Çarpan: Çözünürlük düştükçe FPS artar.
  let basePerformance = Math.min(cpu.score, gpu.score);
  
  // Çözünürlüğe göre FPS çarpanı
  let fpsMultiplier = 1.0;
  if (resName === Resolution.R_1080P) fpsMultiplier = 2.5;
  if (resName === Resolution.R_1440P) fpsMultiplier = 1.8;
  if (resName === Resolution.R_2160P) fpsMultiplier = 1.0;

  let estimatedFps = Math.floor(basePerformance * fpsMultiplier);
  
  // Rastgelelik ekle (gerçekçi dursun diye +/- 5 FPS)
  estimatedFps += Math.floor(Math.random() * 10) - 5;
  if (estimatedFps < 30) estimatedFps = 30; // Min sınır

  // Sonuç döndür
  return {
    bottleneckPercentage,
    bottleneckType,
    estimatedFps,
    explanation,
    tips
  };
};