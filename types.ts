export interface HardwareItem {
  id: string;
  name: string;
  score?: number; // Simplified internal score for fallback logic
}

export interface CalculationResult {
  bottleneckPercentage: number;
  bottleneckType: 'CPU' | 'GPU' | 'None';
  estimatedFps: number;
  explanation: string;
  tips: string[];
}

export enum Resolution {
  R_1080P = '1080p (FHD)',
  R_1440P = '1440p (2K)',
  R_2160P = '2160p (4K)',
}

export interface AdConfiguration {
  type: 'custom' | 'adsense';
  // Custom Image Ads fields
  imageUrl?: string;
  redirectUrl?: string;
  altText?: string;
  // Google AdSense fields
  adClient?: string; // ca-pub-XXXXXXXXXXXXXXXX
  adSlot?: string;   // 1234567890
}

export interface AdProps {
  size: 'banner' | 'rectangle';
  className?: string;
  config?: AdConfiguration | null; // Optional config
}