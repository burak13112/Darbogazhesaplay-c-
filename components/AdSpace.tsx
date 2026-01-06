import React, { useEffect } from 'react';
import { AdProps } from '../types';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdSpace: React.FC<AdProps> = ({ size, className = '', config }) => {
  const isBanner = size === 'banner';

  // --- GOOGLE ADSENSE MODE ---
  if (config?.type === 'adsense') {
    useEffect(() => {
      // Safely push ads inside useEffect
      try {
        if (window.adsbygoogle) {
          window.adsbygoogle.push({});
        }
      } catch (e) {
        console.error("AdSense push error:", e);
      }
    }, [config.adSlot]); // Re-run if slot changes

    // AdSense requires a specific structure with classes
    return (
      <div className={`text-center bg-slate-800 rounded-lg overflow-hidden ${className}`}>
        {/* Container for centering */}
        <div className="inline-block w-full">
           <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={config.adClient}
            data-ad-slot={config.adSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        </div>
        <div className="text-[10px] text-slate-600 mt-1 uppercase">Reklam</div>
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

  // --- FALLBACK / PLACEHOLDER MODE ---
  return (
    <div 
      className={`
        relative overflow-hidden bg-slate-800 border-2 border-dashed border-slate-700 
        flex flex-col items-center justify-center text-center p-4 rounded-lg
        ${isBanner ? 'h-24 w-full' : 'h-64 w-full md:w-64'}
        ${className}
      `}
    >
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
      
      <span className="z-10 text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
        Reklam Alanı
      </span>
      <h3 className="z-10 text-lg font-semibold text-slate-400">
        {isBanner ? 'Reklam Verin' : 'Sponsor'}
      </h3>
      <p className="z-10 text-xs text-slate-500 mt-2">
        Bu alan boştur.
      </p>
    </div>
  );
};

export default AdSpace;