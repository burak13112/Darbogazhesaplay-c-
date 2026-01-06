import React, { useEffect, useRef } from 'react';
import { AdProps } from '../types';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdSpace: React.FC<AdProps> = ({ size, className = '', config }) => {
  const isBanner = size === 'banner';
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  // --- GOOGLE ADSENSE MODE ---
  if (config?.type === 'adsense') {
    
    useEffect(() => {
      // Slot ID girilmemişse veya '12345...' gibi dummy data ise AdSense'i tetikleme
      const isValidId = config.adSlot && config.adSlot.length > 5 && /^\d+$/.test(config.adSlot);

      if (isValidId && !isLoaded.current && adRef.current) {
        try {
          // Initialize adsbygoogle if it doesn't exist
          if (!window.adsbygoogle) {
            window.adsbygoogle = [];
          }
          
          // Push the ad
          window.adsbygoogle.push({});
          isLoaded.current = true;
        } catch (e) {
          console.error("AdSense push error:", e);
        }
      }
    }, [config.adSlot]);

    // Eğer geçerli bir Slot ID yoksa fallback (kendi görselin) göster
    const isValidId = config.adSlot && config.adSlot.length > 5 && /^\d+$/.test(config.adSlot);
    
    if (!isValidId) {
       // Slot ID yoksa Custom moda dön veya boş göster
       return (
        <div className={`relative overflow-hidden bg-slate-800 border border-slate-700/50 rounded-lg flex items-center justify-center p-4 text-center ${className} ${isBanner ? 'h-24' : 'h-64'}`}>
          <div className="text-slate-500 text-xs">
            <p className="font-bold mb-1">REKLAM ALANI</p>
            <p className="opacity-70">Google AdSense Panelinden "Reklam Birimi" oluşturup<br/>constants.ts dosyasına ID'sini girmelisin.</p>
          </div>
        </div>
       );
    }

    return (
      <div className={`text-center bg-slate-800/50 rounded-lg overflow-hidden ${className}`}>
        <div className="inline-block w-full">
           <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: isBanner ? '90px' : '250px' }}
            data-ad-client={config.adClient}
            data-ad-slot={config.adSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        </div>
      </div>
    );
  }

  // --- CUSTOM IMAGE MODE ---
  if (config?.type === 'custom') {
    return (
      <a 
        href={config.redirectUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`
          block relative overflow-hidden bg-slate-800 border-2 border-slate-700/50
          hover:border-blue-500/50 transition-colors group rounded-lg shadow-lg
          ${isBanner ? 'h-24 w-full' : 'h-64 w-full md:w-64'}
          ${className}
        `}
      >
        <img 
          src={config.imageUrl} 
          alt={config.altText} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-0 right-0 bg-slate-900/80 text-[10px] px-1 text-slate-400">
          Sponsor
        </div>
      </a>
    );
  }

  return null;
};

export default AdSpace;