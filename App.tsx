import React, { useState, useEffect } from 'react';
import { CPUS, GPUS, RESOLUTIONS, AD_CONFIG } from './constants';
import { CalculationResult, Resolution } from './types';
import { analyzeBottleneck } from './services/geminiService';
import { getDailyUsage, incrementDailyUsage, hasRemainingRights, DAILY_LIMIT } from './services/limitService';
import AdSpace from './components/AdSpace';
import ResultGauge from './components/ResultGauge';

// Icons
const CpuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

const GpuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const DisplayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const App: React.FC = () => {
  const [selectedCpu, setSelectedCpu] = useState<string>(CPUS[0].name);
  const [selectedGpu, setSelectedGpu] = useState<string>(GPUS[0].name);
  const [selectedRes, setSelectedRes] = useState<string>(RESOLUTIONS[0]);
  
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<CalculationResult | null>(null);
  
  // Limit State
  const [usageCount, setUsageCount] = useState<number>(0);
  const [isLimitReached, setIsLimitReached] = useState<boolean>(false);

  useEffect(() => {
    const count = getDailyUsage();
    setUsageCount(count);
    setIsLimitReached(count >= DAILY_LIMIT);
  }, []);

  const handleCalculate = async () => {
    if (!hasRemainingRights()) {
      setIsLimitReached(true);
      return;
    }

    setLoading(true);
    setProgress(0);
    setResult(null);

    // Increment locally immediately to prevent spamming
    const newCount = incrementDailyUsage();
    setUsageCount(newCount);
    if (newCount >= DAILY_LIMIT) setIsLimitReached(true);

    // Progress bar animation loop
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev; // Stop at 90% until data arrives
        return prev + 1.5; // Increment
      });
    }, 100);

    try {
      // Enforce minimum 5 seconds delay as requested by user ("5-7 saniye")
      const minDelayPromise = new Promise(resolve => setTimeout(resolve, 6000));
      const apiPromise = analyzeBottleneck(selectedCpu, selectedGpu, selectedRes);

      const [_, apiResult] = await Promise.all([minDelayPromise, apiPromise]);

      clearInterval(interval);
      setProgress(100);
      
      // Small delay to show 100% before showing result
      setTimeout(() => {
        setResult(apiResult);
        setLoading(false);
      }, 500);

    } catch (e) {
      console.error(e);
      setLoading(false);
      clearInterval(interval);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center pb-12">
      
      {/* Navbar */}
      <nav className="w-full bg-slate-800 border-b border-slate-700 py-4 px-6 mb-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <CpuIcon />
            </div>
            <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
              PC Darboğaz Hesaplayıcı
            </h1>
          </div>
          <div className="flex items-center gap-4">
             {/* Limit Badge */}
            <div className={`
              hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border
              ${isLimitReached 
                ? 'bg-red-500/10 border-red-500 text-red-400' 
                : 'bg-emerald-500/10 border-emerald-500 text-emerald-400'}
            `}>
              <span>Günlük Hak: {DAILY_LIMIT - usageCount}</span>
            </div>
            <div className="text-xs text-slate-400 hidden sm:block">
              v1.0.0
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-6xl w-full px-4 md:px-6 flex flex-col gap-8">
        
        {/* Top Ad Banner */}
        <AdSpace size="banner" className="shadow-xl" config={AD_CONFIG.banner} />

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Inputs */}
          <div className="flex-1 bg-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 border border-slate-700 h-fit">
            <h2 className="text-2xl font-bold mb-6 text-slate-100 flex items-center gap-2">
              <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
              Sistemini Oluştur
            </h2>

            <div className="space-y-6">
              {/* CPU Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-2">
                  <CpuIcon />
                  İşlemci (CPU)
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-slate-900 border border-slate-600 rounded-xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer hover:border-blue-400 transition-colors"
                    value={selectedCpu}
                    onChange={(e) => setSelectedCpu(e.target.value)}
                    disabled={loading || isLimitReached}
                  >
                    {CPUS.map(cpu => (
                      <option key={cpu.id} value={cpu.name}>{cpu.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-500">
                    ▼
                  </div>
                </div>
              </div>

              {/* GPU Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-2">
                  <GpuIcon />
                  Ekran Kartı (GPU)
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-slate-900 border border-slate-600 rounded-xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer hover:border-blue-400 transition-colors"
                    value={selectedGpu}
                    onChange={(e) => setSelectedGpu(e.target.value)}
                    disabled={loading || isLimitReached}
                  >
                    {GPUS.map(gpu => (
                      <option key={gpu.id} value={gpu.name}>{gpu.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-500">
                    ▼
                  </div>
                </div>
              </div>

              {/* Resolution Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-2">
                  <DisplayIcon />
                  Çözünürlük
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {RESOLUTIONS.map((res) => (
                    <button
                      key={res}
                      onClick={() => !loading && !isLimitReached && setSelectedRes(res)}
                      className={`
                        py-3 px-2 rounded-xl text-sm font-medium transition-all duration-200
                        ${selectedRes === res 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 scale-105' 
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-700'}
                        ${isLimitReached ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                      disabled={loading || isLimitReached}
                    >
                      {res.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <button
                  onClick={handleCalculate}
                  disabled={loading || isLimitReached}
                  className={`
                    w-full py-5 mt-4 rounded-xl font-bold text-lg tracking-wide uppercase transition-all duration-300 shadow-xl
                    ${loading || isLimitReached
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/30 transform hover:-translate-y-1'}
                  `}
                >
                  {loading ? 'Hesaplanıyor...' : isLimitReached ? 'Günlük Limit Doldu' : 'Darboğazı Hesapla'}
                </button>
                
                {/* Mobile Limit Indicator & Help Text */}
                <div className="flex justify-between items-center mt-3 px-1">
                  <span className="text-xs text-slate-500">
                    {isLimitReached 
                      ? "Günlük 5 hesaplama hakkınız doldu. Yarın tekrar bekleriz." 
                      : `Kalan günlük hakkınız: ${DAILY_LIMIT - usageCount}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Results & Loading & Ads */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Dynamic Result Area */}
            <div className={`
              flex-1 bg-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 border border-slate-700 
              flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]
            `}>
              
              {!loading && !result && (
                <div className="text-center text-slate-500 max-w-sm">
                  {isLimitReached ? (
                    <div className="animate-pulse">
                      <div className="bg-red-900/30 p-6 rounded-full inline-block mb-4 text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-red-400 mb-2">Limit Aşıldı</h3>
                      <p className="text-slate-400">Bugünlük işlemci gücümüzü tükettik kanka. Yarın tekrar gel, yine hesaplayalım!</p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-slate-900/50 p-6 rounded-full inline-block mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-lg">Analiz sonucunu görmek için sol taraftan sistemini seç ve "Hesapla" butonuna bas.</p>
                    </>
                  )}
                </div>
              )}

              {loading && (
                <div className="w-full max-w-sm text-center z-10">
                  <div className="mb-8 relative">
                     {/* Pulse effect */}
                     <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                     <div className="relative bg-slate-900 p-6 rounded-2xl border border-slate-700">
                        <CpuIcon />
                        <span className="mx-4 text-slate-500">⇄</span>
                        <GpuIcon />
                     </div>
                  </div>
                  <h3 className="text-xl font-semibold animate-pulse text-blue-400 mb-4">
                    Donanım uyumu analiz ediliyor...
                  </h3>
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-900 rounded-full h-4 overflow-hidden shadow-inner border border-slate-700">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-teal-400 h-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Bu işlem yapay zeka tarafından yapılıyor, 5-7 saniye sürebilir.</p>
                </div>
              )}

              {result && !loading && (
                <div className="w-full animate-fade-in-up">
                  <div className="flex flex-col md:flex-row items-center gap-8 mb-8 border-b border-slate-700 pb-8">
                    
                    <div className="flex items-center gap-6">
                      <ResultGauge percentage={result.bottleneckPercentage} />
                      
                      {/* FPS Badge */}
                      <div className="flex flex-col items-center justify-center w-24 h-24 bg-slate-900 rounded-full border-4 border-slate-700/50 shadow-inner relative group hover:border-blue-500/50 transition-colors">
                        <span className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">{result.estimatedFps}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold mt-1">FPS (Ort.)</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                       {result.bottleneckType !== 'None' ? (
                          <div className="inline-block bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg font-bold mb-3">
                            ⚠️ {result.bottleneckType} Darboğazı Tespit Edildi
                          </div>
                       ) : (
                          <div className="inline-block bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-2 rounded-lg font-bold mb-3">
                            ✅ Sistem Dengeli
                          </div>
                       )}
                       <p className="text-slate-300 leading-relaxed text-sm">
                         {result.explanation}
                       </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
                      <span className="text-yellow-400">💡</span> Uzman Tavsiyeleri
                    </h4>
                    <ul className="space-y-3">
                      {result.tips.map((tip, idx) => (
                        <li key={idx} className="flex gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                          <span className="text-blue-500 font-bold text-sm bg-blue-500/10 h-6 w-6 rounded flex items-center justify-center shrink-0">{idx + 1}</span>
                          <span className="text-sm text-slate-300">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            {/* Sidebar Ad (Only visible on larger screens below results) */}
            <AdSpace size="banner" className="shadow-xl" config={AD_CONFIG.sidebar} />
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full mt-12 text-center text-slate-600 text-sm">
        <p>© 2024 PC Darboğaz Hesaplayıcı. Tüm hakları saklıdır.</p>
        <p className="text-xs mt-1">Sonuçlar tahmini değerlerdir ve yapay zeka ile üretilmiştir.</p>
      </footer>

      {/* Global Style for Animations */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;