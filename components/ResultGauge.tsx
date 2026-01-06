import React from 'react';

interface ResultGaugeProps {
  percentage: number;
}

const ResultGauge: React.FC<ResultGaugeProps> = ({ percentage }) => {
  // SVG configuration
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let colorClass = "text-green-500";
  let statusText = "Mükemmel Uyum";

  if (percentage > 10 && percentage <= 25) {
    colorClass = "text-yellow-500";
    statusText = "Kabul Edilebilir";
  } else if (percentage > 25) {
    colorClass = "text-red-500";
    statusText = "Ciddi Darboğaz";
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-48 h-48">
        <svg
          height="100%"
          width="100%"
          className="transform -rotate-90"
        >
          <circle
            stroke="currentColor"
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx="50%"
            cy="50%"
            className="text-slate-700"
          />
          <circle
            stroke="currentColor"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx="50%"
            cy="50%"
            className={`${colorClass} gauge-arc`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${colorClass}`}>
            %{percentage}
          </span>
          <span className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Darboğaz</span>
        </div>
      </div>
      <p className={`mt-4 text-xl font-semibold ${colorClass}`}>{statusText}</p>
    </div>
  );
};

export default ResultGauge;