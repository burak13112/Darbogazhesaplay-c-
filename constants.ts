import { HardwareItem, Resolution, AdConfiguration } from './types';

// --- REKLAM AYARLARI (AD SETTINGS) ---

export const AD_CONFIG: {
  banner: AdConfiguration | null;
  sidebar: AdConfiguration | null;
} = {
  // Üstteki uzun reklam alanı
  banner: {
    type: 'adsense', 
    // Custom fallback
    imageUrl: "https://placehold.co/728x90/1e293b/475569?text=Reklam+Alani",
    redirectUrl: "#",
    altText: "Reklam",
    
    // --- BURAYI DOLDURMAN LAZIM ---
    adClient: "ca-pub-9595860294846239", 
    adSlot: "1055857875", 
  },
  
  // Sağdaki kare reklam alanı
  sidebar: {
    type: 'adsense',
    // Custom fallback
    imageUrl: "https://placehold.co/300x250/1e293b/475569?text=Reklam+Alani",
    redirectUrl: "#",
    altText: "Reklam",

    // --- BURAYI DOLDURMAN LAZIM ---
    adClient: "ca-pub-9595860294846239",
    adSlot: "2386935628", 
  }
};

// --- PUANLAMA MANTIĞI (0 - 120 Puan Skalası) ---
// Yüksek puan = Daha güçlü donanım

export const CPUS: HardwareItem[] = [
  // --- INTEL ---
  // 14. Nesil
  { id: 'i9-14900k', name: 'Intel Core i9-14900K', score: 100 },
  { id: 'i7-14700k', name: 'Intel Core i7-14700K', score: 92 },
  { id: 'i5-14600k', name: 'Intel Core i5-14600K', score: 82 },
  { id: 'i5-14400f', name: 'Intel Core i5-14400F', score: 70 },
  // 13. Nesil
  { id: 'i9-13900k', name: 'Intel Core i9-13900K', score: 95 },
  { id: 'i7-13700k', name: 'Intel Core i7-13700K', score: 88 },
  { id: 'i5-13600k', name: 'Intel Core i5-13600K', score: 78 },
  { id: 'i5-13400f', name: 'Intel Core i5-13400F', score: 68 },
  { id: 'i3-13100f', name: 'Intel Core i3-13100F', score: 55 },
  // 12. Nesil
  { id: 'i9-12900k', name: 'Intel Core i9-12900K', score: 85 },
  { id: 'i7-12700k', name: 'Intel Core i7-12700K', score: 75 },
  { id: 'i5-12600k', name: 'Intel Core i5-12600K', score: 65 },
  { id: 'i5-12400f', name: 'Intel Core i5-12400F', score: 58 },
  { id: 'i3-12100f', name: 'Intel Core i3-12100F', score: 45 },
  // 11. Nesil
  { id: 'i9-11900k', name: 'Intel Core i9-11900K', score: 72 },
  { id: 'i7-11700k', name: 'Intel Core i7-11700K', score: 62 },
  { id: 'i5-11600k', name: 'Intel Core i5-11600K', score: 52 },
  { id: 'i5-11400f', name: 'Intel Core i5-11400F', score: 48 },
  // 10. Nesil
  { id: 'i9-10900k', name: 'Intel Core i9-10900K', score: 65 },
  { id: 'i7-10700k', name: 'Intel Core i7-10700K', score: 55 },
  { id: 'i5-10600k', name: 'Intel Core i5-10600K', score: 45 },
  { id: 'i5-10400f', name: 'Intel Core i5-10400F', score: 40 },
  { id: 'i3-10100f', name: 'Intel Core i3-10100F', score: 32 },
  // 9. Nesil
  { id: 'i9-9900k', name: 'Intel Core i9-9900K', score: 58 },
  { id: 'i7-9700k', name: 'Intel Core i7-9700K', score: 48 },
  { id: 'i5-9600k', name: 'Intel Core i5-9600K', score: 40 },
  { id: 'i5-9400f', name: 'Intel Core i5-9400F', score: 35 },
  // 8. Nesil
  { id: 'i7-8700k', name: 'Intel Core i7-8700K', score: 42 },
  { id: 'i5-8600k', name: 'Intel Core i5-8600K', score: 35 },
  { id: 'i5-8400', name: 'Intel Core i5-8400', score: 30 },
  // 7. ve 6. Nesil
  { id: 'i7-7700k', name: 'Intel Core i7-7700K', score: 38 },
  { id: 'i5-7600k', name: 'Intel Core i5-7600K', score: 30 },
  { id: 'i7-6700k', name: 'Intel Core i7-6700K', score: 32 },
  { id: 'i5-6600k', name: 'Intel Core i5-6600K', score: 28 },
  { id: 'i5-6500', name: 'Intel Core i5-6500', score: 25 },

  // --- AMD ---
  // Ryzen 7000 Serisi (Oyun performansı baz alındı)
  { id: 'ryzen-9-7950x3d', name: 'AMD Ryzen 9 7950X3D', score: 105 },
  { id: 'ryzen-9-7900x', name: 'AMD Ryzen 9 7900X', score: 95 },
  { id: 'ryzen-7-7800x3d', name: 'AMD Ryzen 7 7800X3D', score: 102 },
  { id: 'ryzen-7-7700x', name: 'AMD Ryzen 7 7700X', score: 90 },
  { id: 'ryzen-5-7600x', name: 'AMD Ryzen 5 7600X', score: 78 },
  { id: 'ryzen-5-7500f', name: 'AMD Ryzen 5 7500F', score: 72 },
  // Ryzen 5000 Serisi
  { id: 'ryzen-9-5950x', name: 'AMD Ryzen 9 5950X', score: 85 },
  { id: 'ryzen-9-5900x', name: 'AMD Ryzen 9 5900X', score: 80 },
  { id: 'ryzen-7-5800x3d', name: 'AMD Ryzen 7 5800X3D', score: 88 },
  { id: 'ryzen-7-5800x', name: 'AMD Ryzen 7 5800X', score: 70 },
  { id: 'ryzen-7-5700x', name: 'AMD Ryzen 7 5700X', score: 65 },
  { id: 'ryzen-5-5600x', name: 'AMD Ryzen 5 5600X', score: 60 },
  { id: 'ryzen-5-5600', name: 'AMD Ryzen 5 5600', score: 58 },
  { id: 'ryzen-5-5500', name: 'AMD Ryzen 5 5500', score: 48 },
  // Ryzen 3000 Serisi
  { id: 'ryzen-9-3900x', name: 'AMD Ryzen 9 3900X', score: 60 },
  { id: 'ryzen-7-3700x', name: 'AMD Ryzen 7 3700X', score: 50 },
  { id: 'ryzen-5-3600x', name: 'AMD Ryzen 5 3600X', score: 45 },
  { id: 'ryzen-5-3600', name: 'AMD Ryzen 5 3600', score: 42 },
  { id: 'ryzen-3-3300x', name: 'AMD Ryzen 3 3300X', score: 38 },
  // Ryzen 2000 Serisi
  { id: 'ryzen-7-2700x', name: 'AMD Ryzen 7 2700X', score: 40 },
  { id: 'ryzen-5-2600x', name: 'AMD Ryzen 5 2600X', score: 35 },
  { id: 'ryzen-5-2600', name: 'AMD Ryzen 5 2600', score: 32 },
  // Ryzen 1000 Serisi
  { id: 'ryzen-7-1800x', name: 'AMD Ryzen 7 1800X', score: 35 },
  { id: 'ryzen-7-1700', name: 'AMD Ryzen 7 1700', score: 30 },
  { id: 'ryzen-5-1600af', name: 'AMD Ryzen 5 1600 AF', score: 32 },
  { id: 'ryzen-5-1600', name: 'AMD Ryzen 5 1600', score: 28 },
  { id: 'ryzen-3-1200', name: 'AMD Ryzen 3 1200', score: 18 },
];

export const GPUS: HardwareItem[] = [
  // --- NVIDIA ---
  // RTX 40 Serisi
  { id: 'rtx-4090', name: 'NVIDIA GeForce RTX 4090', score: 120 },
  { id: 'rtx-4080-super', name: 'NVIDIA GeForce RTX 4080 Super', score: 105 },
  { id: 'rtx-4080', name: 'NVIDIA GeForce RTX 4080', score: 100 },
  { id: 'rtx-4070-ti-super', name: 'NVIDIA GeForce RTX 4070 Ti Super', score: 92 },
  { id: 'rtx-4070-ti', name: 'NVIDIA GeForce RTX 4070 Ti', score: 88 },
  { id: 'rtx-4070-super', name: 'NVIDIA GeForce RTX 4070 Super', score: 80 },
  { id: 'rtx-4070', name: 'NVIDIA GeForce RTX 4070', score: 75 },
  { id: 'rtx-4060-ti', name: 'NVIDIA GeForce RTX 4060 Ti', score: 62 },
  { id: 'rtx-4060', name: 'NVIDIA GeForce RTX 4060', score: 52 },
  // RTX 30 Serisi
  { id: 'rtx-3090-ti', name: 'NVIDIA GeForce RTX 3090 Ti', score: 95 },
  { id: 'rtx-3090', name: 'NVIDIA GeForce RTX 3090', score: 90 },
  { id: 'rtx-3080-ti', name: 'NVIDIA GeForce RTX 3080 Ti', score: 85 },
  { id: 'rtx-3080', name: 'NVIDIA GeForce RTX 3080', score: 80 },
  { id: 'rtx-3070-ti', name: 'NVIDIA GeForce RTX 3070 Ti', score: 70 },
  { id: 'rtx-3070', name: 'NVIDIA GeForce RTX 3070', score: 65 },
  { id: 'rtx-3060-ti', name: 'NVIDIA GeForce RTX 3060 Ti', score: 55 },
  { id: 'rtx-3060', name: 'NVIDIA GeForce RTX 3060', score: 45 },
  { id: 'rtx-3050', name: 'NVIDIA GeForce RTX 3050', score: 30 },
  // RTX 20 Serisi
  { id: 'rtx-2080-ti', name: 'NVIDIA GeForce RTX 2080 Ti', score: 72 },
  { id: 'rtx-2080-super', name: 'NVIDIA GeForce RTX 2080 Super', score: 65 },
  { id: 'rtx-2080', name: 'NVIDIA GeForce RTX 2080', score: 62 },
  { id: 'rtx-2070-super', name: 'NVIDIA GeForce RTX 2070 Super', score: 58 },
  { id: 'rtx-2070', name: 'NVIDIA GeForce RTX 2070', score: 52 },
  { id: 'rtx-2060-super', name: 'NVIDIA GeForce RTX 2060 Super', score: 45 },
  { id: 'rtx-2060', name: 'NVIDIA GeForce RTX 2060', score: 40 },
  // GTX 16 ve 10 Serisi
  { id: 'gtx-1660-ti', name: 'NVIDIA GeForce GTX 1660 Ti', score: 38 },
  { id: 'gtx-1660-super', name: 'NVIDIA GeForce GTX 1660 Super', score: 36 },
  { id: 'gtx-1660', name: 'NVIDIA GeForce GTX 1660', score: 32 },
  { id: 'gtx-1650-super', name: 'NVIDIA GeForce GTX 1650 Super', score: 28 },
  { id: 'gtx-1650', name: 'NVIDIA GeForce GTX 1650', score: 22 },
  { id: 'gtx-1080-ti', name: 'NVIDIA GeForce GTX 1080 Ti', score: 55 },
  { id: 'gtx-1080', name: 'NVIDIA GeForce GTX 1080', score: 45 },
  { id: 'gtx-1070-ti', name: 'NVIDIA GeForce GTX 1070 Ti', score: 40 },
  { id: 'gtx-1070', name: 'NVIDIA GeForce GTX 1070', score: 35 },
  { id: 'gtx-1060-6gb', name: 'NVIDIA GeForce GTX 1060 6GB', score: 28 },
  { id: 'gtx-1060-3gb', name: 'NVIDIA GeForce GTX 1060 3GB', score: 25 },
  { id: 'gtx-1050-ti', name: 'NVIDIA GeForce GTX 1050 Ti', score: 18 },
  { id: 'gtx-1050', name: 'NVIDIA GeForce GTX 1050', score: 15 },
  // GTX 900
  { id: 'gtx-980-ti', name: 'NVIDIA GeForce GTX 980 Ti', score: 35 },
  { id: 'gtx-980', name: 'NVIDIA GeForce GTX 980', score: 30 },
  { id: 'gtx-970', name: 'NVIDIA GeForce GTX 970', score: 22 },
  { id: 'gtx-960', name: 'NVIDIA GeForce GTX 960', score: 15 },

  // --- AMD ---
  // RX 7000
  { id: 'rx-7900-xtx', name: 'AMD Radeon RX 7900 XTX', score: 110 },
  { id: 'rx-7900-xt', name: 'AMD Radeon RX 7900 XT', score: 98 },
  { id: 'rx-7800-xt', name: 'AMD Radeon RX 7800 XT', score: 82 },
  { id: 'rx-7700-xt', name: 'AMD Radeon RX 7700 XT', score: 70 },
  { id: 'rx-7600', name: 'AMD Radeon RX 7600', score: 50 },
  // RX 6000
  { id: 'rx-6950-xt', name: 'AMD Radeon RX 6950 XT', score: 92 },
  { id: 'rx-6900-xt', name: 'AMD Radeon RX 6900 XT', score: 88 },
  { id: 'rx-6800-xt', name: 'AMD Radeon RX 6800 XT', score: 75 },
  { id: 'rx-6800', name: 'AMD Radeon RX 6800', score: 68 },
  { id: 'rx-6700-xt', name: 'AMD Radeon RX 6700 XT', score: 60 },
  { id: 'rx-6650-xt', name: 'AMD Radeon RX 6650 XT', score: 52 },
  { id: 'rx-6600-xt', name: 'AMD Radeon RX 6600 XT', score: 48 },
  { id: 'rx-6600', name: 'AMD Radeon RX 6600', score: 45 },
  { id: 'rx-6500-xt', name: 'AMD Radeon RX 6500 XT', score: 25 },
  // RX 5000
  { id: 'rx-5700-xt', name: 'AMD Radeon RX 5700 XT', score: 50 },
  { id: 'rx-5700', name: 'AMD Radeon RX 5700', score: 45 },
  { id: 'rx-5600-xt', name: 'AMD Radeon RX 5600 XT', score: 40 },
  { id: 'rx-5500-xt', name: 'AMD Radeon RX 5500 XT', score: 32 },
  // RX 500/400
  { id: 'rx-590', name: 'AMD Radeon RX 590', score: 28 },
  { id: 'rx-580-8gb', name: 'AMD Radeon RX 580 8GB', score: 25 },
  { id: 'rx-570-8gb', name: 'AMD Radeon RX 570 8GB', score: 22 },
  { id: 'rx-570-4gb', name: 'AMD Radeon RX 570 4GB', score: 20 },
  { id: 'rx-480', name: 'AMD Radeon RX 480', score: 22 },
  { id: 'rx-470', name: 'AMD Radeon RX 470', score: 18 },
];

export const RESOLUTIONS = [
  Resolution.R_1080P,
  Resolution.R_1440P,
  Resolution.R_2160P,
];