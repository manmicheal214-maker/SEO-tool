import React from 'react';

interface DomainRatingGaugeProps {
  score: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  sublabel?: string;
}

export const DomainRatingGauge: React.FC<DomainRatingGaugeProps> = ({
  score,
  label,
  size = 'md',
  sublabel,
}) => {
  const boundedScore = Math.min(100, Math.max(0, score));

  // Determine tier & color
  let tier = 'New / Developing';
  let colorClass = 'text-slate-400';
  let strokeColor = '#94a3b8';

  if (boundedScore >= 80) {
    tier = 'Industry Leader';
    colorClass = 'text-emerald-400';
    strokeColor = '#34d399';
  } else if (boundedScore >= 60) {
    tier = 'High Authority';
    colorClass = 'text-teal-400';
    strokeColor = '#2dd4bf';
  } else if (boundedScore >= 40) {
    tier = 'Competitive Authority';
    colorClass = 'text-sky-400';
    strokeColor = '#38bdf8';
  } else if (boundedScore >= 20) {
    tier = 'Established Profile';
    colorClass = 'text-amber-400';
    strokeColor = '#fbbf24';
  }

  const radius = size === 'lg' ? 58 : size === 'md' ? 44 : 32;
  const stroke = size === 'lg' ? 9 : size === 'md' ? 7 : 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (boundedScore / 100) * circumference;
  const dimension = (radius + stroke) * 2 + 8;

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
      <div className="relative inline-flex items-center justify-center mb-2">
        <svg
          width={dimension}
          height={dimension}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={stroke}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className={`font-mono font-bold tabular-nums ${
              size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-2xl' : 'text-lg'
            } text-white`}
          >
            {boundedScore}
          </span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
            / 100
          </span>
        </div>
      </div>

      <span className="text-sm font-semibold text-slate-200">{label}</span>
      {sublabel && <span className="text-xs text-slate-400 mt-0.5">{sublabel}</span>}
      <span className={`text-[11px] font-medium mt-1 ${colorClass}`}>
        {tier}
      </span>
    </div>
  );
};
