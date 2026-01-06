import { HardwareItem, Resolution, AdConfiguration } from './types';

// --- REKLAM AYARLARI (AD SETTINGS) ---
// AdSense kullanmak için type: 'adsense' yap ve slot ID'lerini gir.
// Görsel kullanmak için type: 'custom' yap ve resim linklerini gir.

export const AD_CONFIG: {
  banner: AdConfiguration | null;
  sidebar: AdConfiguration | null;
} = {
  // Üstteki uzun reklam alanı
  banner: {
    type: 'custom', // 'adsense' veya 'custom'
    // Custom ayarları
    imageUrl: "https://placehold.co/728x90/1e293b/475569?text=Oyuncu+Ekipmanlarinda+Dev+Indirim",
    redirectUrl: "https://www.amazon.com.tr/gaming",
    altText: "Oyuncu Ekipmanları İndirimi",
    // AdSense ayarları (Eğer type: 'adsense' seçersen burayı doldur)
    adClient: "ca-pub-XXXXXXXXXXXXXXXX", // Kendi Publisher ID'n
    adSlot: "1234567890", // AdSense panelinden alacağın Banner Slot ID
  },
  
  // Sağdaki kare reklam alanı
  sidebar: {
    type: 'custom', // 'adsense' veya 'custom'
    // Custom ayarları
    imageUrl: "https://placehold.co/300x250/1e293b/475569?text=RTX+4060+Kampanyasi",
    redirectUrl: "https://www.amazon.com.tr/s?k=rtx+4060",
    altText: "Ekran Kartı Kampanyası",
    // AdSense ayarları
    adClient: "ca-pub-XXXXXXXXXXXXXXXX", 
    adSlot: "0987654321", // AdSense panelinden alacağın Sidebar Slot ID
  }
};

export const CPUS: HardwareItem[] = [
  // --- INTEL ---
  // 14. Nesil
  { id: 'i9-14900k', name: 'Intel Core i9-14900K' },
  { id: 'i7-14700k', name: 'Intel Core i7-14700K' },
  { id: 'i5-14600k', name: 'Intel Core i5-14600K' },
  { id: 'i5-14400f', name: 'Intel Core i5-14400F' },
  // 13. Nesil
  { id: 'i9-13900k', name: 'Intel Core i9-13900K' },
  { id: 'i7-13700k', name: 'Intel Core i7-13700K' },
  { id: 'i5-13600k', name: 'Intel Core i5-13600K' },
  { id: 'i5-13400f', name: 'Intel Core i5-13400F' },
  { id: 'i3-13100f', name: 'Intel Core i3-13100F' },
  // 12. Nesil
  { id: 'i9-12900k', name: 'Intel Core i9-12900K' },
  { id: 'i7-12700k', name: 'Intel Core i7-12700K' },
  { id: 'i5-12600k', name: 'Intel Core i5-12600K' },
  { id: 'i5-12400f', name: 'Intel Core i5-12400F' },
  { id: 'i3-12100f', name: 'Intel Core i3-12100F' },
  // 11. Nesil
  { id: 'i9-11900k', name: 'Intel Core i9-11900K' },
  { id: 'i7-11700k', name: 'Intel Core i7-11700K' },
  { id: 'i5-11600k', name: 'Intel Core i5-11600K' },
  { id: 'i5-11400f', name: 'Intel Core i5-11400F' },
  // 10. Nesil
  { id: 'i9-10900k', name: 'Intel Core i9-10900K' },
  { id: 'i7-10700k', name: 'Intel Core i7-10700K' },
  { id: 'i5-10600k', name: 'Intel Core i5-10600K' },
  { id: 'i5-10400f', name: 'Intel Core i5-10400F' },
  { id: 'i3-10100f', name: 'Intel Core i3-10100F' },
  // 9. Nesil
  { id: 'i9-9900k', name: 'Intel Core i9-9900K' },
  { id: 'i7-9700k', name: 'Intel Core i7-9700K' },
  { id: 'i5-9600k', name: 'Intel Core i5-9600K' },
  { id: 'i5-9400f', name: 'Intel Core i5-9400F' },
  // 8. Nesil
  { id: 'i7-8700k', name: 'Intel Core i7-8700K' },
  { id: 'i5-8600k', name: 'Intel Core i5-8600K' },
  { id: 'i5-8400', name: 'Intel Core i5-8400' },
  // 7. ve 6. Nesil (2015-2017)
  { id: 'i7-7700k', name: 'Intel Core i7-7700K' },
  { id: 'i5-7600k', name: 'Intel Core i5-7600K' },
  { id: 'i7-6700k', name: 'Intel Core i7-6700K' },
  { id: 'i5-6600k', name: 'Intel Core i5-6600K' },
  { id: 'i5-6500', name: 'Intel Core i5-6500' },

  // --- AMD ---
  // Ryzen 7000 Serisi
  { id: 'ryzen-9-7950x3d', name: 'AMD Ryzen 9 7950X3D' },
  { id: 'ryzen-9-7900x', name: 'AMD Ryzen 9 7900X' },
  { id: 'ryzen-7-7800x3d', name: 'AMD Ryzen 7 7800X3D' },
  { id: 'ryzen-7-7700x', name: 'AMD Ryzen 7 7700X' },
  { id: 'ryzen-5-7600x', name: 'AMD Ryzen 5 7600X' },
  { id: 'ryzen-5-7500f', name: 'AMD Ryzen 5 7500F' },
  // Ryzen 5000 Serisi
  { id: 'ryzen-9-5950x', name: 'AMD Ryzen 9 5950X' },
  { id: 'ryzen-9-5900x', name: 'AMD Ryzen 9 5900X' },
  { id: 'ryzen-7-5800x3d', name: 'AMD Ryzen 7 5800X3D' },
  { id: 'ryzen-7-5800x', name: 'AMD Ryzen 7 5800X' },
  { id: 'ryzen-7-5700x', name: 'AMD Ryzen 7 5700X' },
  { id: 'ryzen-5-5600x', name: 'AMD Ryzen 5 5600X' },
  { id: 'ryzen-5-5600', name: 'AMD Ryzen 5 5600' },
  { id: 'ryzen-5-5500', name: 'AMD Ryzen 5 5500' },
  // Ryzen 3000 Serisi
  { id: 'ryzen-9-3900x', name: 'AMD Ryzen 9 3900X' },
  { id: 'ryzen-7-3700x', name: 'AMD Ryzen 7 3700X' },
  { id: 'ryzen-5-3600x', name: 'AMD Ryzen 5 3600X' },
  { id: 'ryzen-5-3600', name: 'AMD Ryzen 5 3600' },
  { id: 'ryzen-3-3300x', name: 'AMD Ryzen 3 3300X' },
  // Ryzen 2000 Serisi
  { id: 'ryzen-7-2700x', name: 'AMD Ryzen 7 2700X' },
  { id: 'ryzen-5-2600x', name: 'AMD Ryzen 5 2600X' },
  { id: 'ryzen-5-2600', name: 'AMD Ryzen 5 2600' },
  // Ryzen 1000 Serisi (2017)
  { id: 'ryzen-7-1800x', name: 'AMD Ryzen 7 1800X' },
  { id: 'ryzen-7-1700', name: 'AMD Ryzen 7 1700' },
  { id: 'ryzen-5-1600af', name: 'AMD Ryzen 5 1600 AF' },
  { id: 'ryzen-5-1600', name: 'AMD Ryzen 5 1600' },
  { id: 'ryzen-3-1200', name: 'AMD Ryzen 3 1200' },
];

export const GPUS: HardwareItem[] = [
  // --- NVIDIA ---
  // RTX 40 Serisi
  { id: 'rtx-4090', name: 'NVIDIA GeForce RTX 4090' },
  { id: 'rtx-4080-super', name: 'NVIDIA GeForce RTX 4080 Super' },
  { id: 'rtx-4080', name: 'NVIDIA GeForce RTX 4080' },
  { id: 'rtx-4070-ti-super', name: 'NVIDIA GeForce RTX 4070 Ti Super' },
  { id: 'rtx-4070-ti', name: 'NVIDIA GeForce RTX 4070 Ti' },
  { id: 'rtx-4070-super', name: 'NVIDIA GeForce RTX 4070 Super' },
  { id: 'rtx-4070', name: 'NVIDIA GeForce RTX 4070' },
  { id: 'rtx-4060-ti', name: 'NVIDIA GeForce RTX 4060 Ti' },
  { id: 'rtx-4060', name: 'NVIDIA GeForce RTX 4060' },
  // RTX 30 Serisi
  { id: 'rtx-3090-ti', name: 'NVIDIA GeForce RTX 3090 Ti' },
  { id: 'rtx-3090', name: 'NVIDIA GeForce RTX 3090' },
  { id: 'rtx-3080-ti', name: 'NVIDIA GeForce RTX 3080 Ti' },
  { id: 'rtx-3080', name: 'NVIDIA GeForce RTX 3080' },
  { id: 'rtx-3070-ti', name: 'NVIDIA GeForce RTX 3070 Ti' },
  { id: 'rtx-3070', name: 'NVIDIA GeForce RTX 3070' },
  { id: 'rtx-3060-ti', name: 'NVIDIA GeForce RTX 3060 Ti' },
  { id: 'rtx-3060', name: 'NVIDIA GeForce RTX 3060' },
  { id: 'rtx-3050', name: 'NVIDIA GeForce RTX 3050' },
  // RTX 20 Serisi
  { id: 'rtx-2080-ti', name: 'NVIDIA GeForce RTX 2080 Ti' },
  { id: 'rtx-2080-super', name: 'NVIDIA GeForce RTX 2080 Super' },
  { id: 'rtx-2080', name: 'NVIDIA GeForce RTX 2080' },
  { id: 'rtx-2070-super', name: 'NVIDIA GeForce RTX 2070 Super' },
  { id: 'rtx-2070', name: 'NVIDIA GeForce RTX 2070' },
  { id: 'rtx-2060-super', name: 'NVIDIA GeForce RTX 2060 Super' },
  { id: 'rtx-2060', name: 'NVIDIA GeForce RTX 2060' },
  // GTX 16 ve 10 Serisi
  { id: 'gtx-1660-ti', name: 'NVIDIA GeForce GTX 1660 Ti' },
  { id: 'gtx-1660-super', name: 'NVIDIA GeForce GTX 1660 Super' },
  { id: 'gtx-1660', name: 'NVIDIA GeForce GTX 1660' },
  { id: 'gtx-1650-super', name: 'NVIDIA GeForce GTX 1650 Super' },
  { id: 'gtx-1650', name: 'NVIDIA GeForce GTX 1650' },
  { id: 'gtx-1080-ti', name: 'NVIDIA GeForce GTX 1080 Ti' },
  { id: 'gtx-1080', name: 'NVIDIA GeForce GTX 1080' },
  { id: 'gtx-1070-ti', name: 'NVIDIA GeForce GTX 1070 Ti' },
  { id: 'gtx-1070', name: 'NVIDIA GeForce GTX 1070' },
  { id: 'gtx-1060-6gb', name: 'NVIDIA GeForce GTX 1060 6GB' },
  { id: 'gtx-1060-3gb', name: 'NVIDIA GeForce GTX 1060 3GB' },
  { id: 'gtx-1050-ti', name: 'NVIDIA GeForce GTX 1050 Ti' },
  { id: 'gtx-1050', name: 'NVIDIA GeForce GTX 1050' },
  // GTX 900 Serisi (2014-2015)
  { id: 'gtx-980-ti', name: 'NVIDIA GeForce GTX 980 Ti' },
  { id: 'gtx-980', name: 'NVIDIA GeForce GTX 980' },
  { id: 'gtx-970', name: 'NVIDIA GeForce GTX 970' },
  { id: 'gtx-960', name: 'NVIDIA GeForce GTX 960' },

  // --- AMD ---
  // RX 7000 Serisi
  { id: 'rx-7900-xtx', name: 'AMD Radeon RX 7900 XTX' },
  { id: 'rx-7900-xt', name: 'AMD Radeon RX 7900 XT' },
  { id: 'rx-7800-xt', name: 'AMD Radeon RX 7800 XT' },
  { id: 'rx-7700-xt', name: 'AMD Radeon RX 7700 XT' },
  { id: 'rx-7600', name: 'AMD Radeon RX 7600' },
  // RX 6000 Serisi
  { id: 'rx-6950-xt', name: 'AMD Radeon RX 6950 XT' },
  { id: 'rx-6900-xt', name: 'AMD Radeon RX 6900 XT' },
  { id: 'rx-6800-xt', name: 'AMD Radeon RX 6800 XT' },
  { id: 'rx-6800', name: 'AMD Radeon RX 6800' },
  { id: 'rx-6700-xt', name: 'AMD Radeon RX 6700 XT' },
  { id: 'rx-6650-xt', name: 'AMD Radeon RX 6650 XT' },
  { id: 'rx-6600-xt', name: 'AMD Radeon RX 6600 XT' },
  { id: 'rx-6600', name: 'AMD Radeon RX 6600' },
  { id: 'rx-6500-xt', name: 'AMD Radeon RX 6500 XT' },
  // RX 5000 Serisi
  { id: 'rx-5700-xt', name: 'AMD Radeon RX 5700 XT' },
  { id: 'rx-5700', name: 'AMD Radeon RX 5700' },
  { id: 'rx-5600-xt', name: 'AMD Radeon RX 5600 XT' },
  { id: 'rx-5500-xt', name: 'AMD Radeon RX 5500 XT' },
  // RX 500/400 Serisi (Polaris)
  { id: 'rx-590', name: 'AMD Radeon RX 590' },
  { id: 'rx-580-8gb', name: 'AMD Radeon RX 580 8GB' },
  { id: 'rx-570-8gb', name: 'AMD Radeon RX 570 8GB' },
  { id: 'rx-570-4gb', name: 'AMD Radeon RX 570 4GB' },
  { id: 'rx-480', name: 'AMD Radeon RX 480' },
  { id: 'rx-470', name: 'AMD Radeon RX 470' },
];

export const RESOLUTIONS = [
  Resolution.R_1080P,
  Resolution.R_1440P,
  Resolution.R_2160P,
];