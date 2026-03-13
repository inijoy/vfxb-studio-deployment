import { X } from 'lucide-react';

interface AudienceSimulationPanelProps {
  onClose: () => void;
}

export function AudienceSimulationPanel({ onClose }: AudienceSimulationPanelProps) {
  const dropoffs = [
    { time: '0:45', reason: 'Pacing drop', loss: 23 },
    { time: '2:14', reason: 'Jump cut', loss: 12 },
    { time: '3:01', reason: 'Weak CTA', loss: 18 }
  ];

  return (
    <div 
      className="absolute top-0 right-0 h-full w-[320px] border-l flex flex-col animate-slideInRight"
      style={{
        backgroundColor: '#0A0A0A',
        borderColor: '#1A1A1A',
        zIndex: 100
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#1A1A1A' }}>
        <h3 className="text-sm font-semibold" style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}>
          Audience Simulation
        </h3>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#1A1A1A] transition-colors"
        >
          <X size={16} className="text-[#666]" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Subtitle */}
        <p className="text-xs mb-4" style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>
          Predicted retention before publish
        </p>

        {/* Retention Graph */}
        <div 
          className="rounded-lg border p-3 mb-4"
          style={{
            backgroundColor: '#0E0E0E',
            borderColor: '#1A1A1A'
          }}
        >
          <svg width="100%" height="120" viewBox="0 0 280 120" fill="none">
            {/* Grid lines */}
            <line x1="0" y1="30" x2="280" y2="30" stroke="#1A1A1A" strokeWidth="1" />
            <line x1="0" y1="60" x2="280" y2="60" stroke="#1A1A1A" strokeWidth="1" />
            <line x1="0" y1="90" x2="280" y2="90" stroke="#1A1A1A" strokeWidth="1" />

            {/* Problem spot markers (red dotted lines) */}
            <line x1="70" y1="0" x2="70" y2="110" stroke="#FF453A" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
            <line x1="160" y1="0" x2="160" y2="110" stroke="#FF453A" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
            <line x1="230" y1="0" x2="230" y2="110" stroke="#FF453A" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />

            {/* Fill gradient */}
            <defs>
              <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(10,132,255,0.2)" />
                <stop offset="100%" stopColor="rgba(10,132,255,0.0)" />
              </linearGradient>
            </defs>

            {/* Retention curve fill */}
            <path
              d="M 0 10 L 40 15 L 70 35 L 100 40 L 130 45 L 160 60 L 190 65 L 230 85 L 260 90 L 280 95 L 280 110 L 0 110 Z"
              fill="url(#retentionGradient)"
            />

            {/* Retention curve line */}
            <path
              d="M 0 10 L 40 15 L 70 35 L 100 40 L 130 45 L 160 60 L 190 65 L 230 85 L 260 90 L 280 95"
              stroke="#0A84FF"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Y-axis labels */}
            <text x="0" y="12" fill="#444" fontSize="8" fontFamily="JetBrains Mono">100%</text>
            <text x="0" y="95" fill="#444" fontSize="8" fontFamily="JetBrains Mono">0%</text>
          </svg>

          {/* X-axis label */}
          <div className="flex justify-between mt-1">
            <span className="text-[8px]" style={{ color: '#444', fontFamily: 'JetBrains Mono, monospace' }}>
              0%
            </span>
            <span className="text-[8px]" style={{ color: '#444', fontFamily: 'JetBrains Mono, monospace' }}>
              100%
            </span>
          </div>
        </div>

        {/* Drop-off Warnings */}
        <div className="space-y-2">
          {dropoffs.map((dropoff, idx) => (
            <div 
              key={idx}
              className="flex items-start gap-2 p-2 rounded border"
              style={{
                backgroundColor: 'rgba(255, 69, 58, 0.05)',
                borderColor: 'rgba(255, 69, 58, 0.2)'
              }}
            >
              <span className="text-xs">⚠</span>
              <div className="flex-1">
                <div 
                  className="text-[10px] leading-relaxed"
                  style={{ color: '#888', fontFamily: 'DM Sans, sans-serif' }}
                >
                  <span style={{ color: 'white', fontFamily: 'JetBrains Mono, monospace' }}>
                    {dropoff.time}
                  </span>
                  {' — '}
                  {dropoff.reason}, -{dropoff.loss}% viewers
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
