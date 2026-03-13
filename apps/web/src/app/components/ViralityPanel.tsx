import { X } from 'lucide-react';

interface ViralityPanelProps {
  onClose: () => void;
}

export function ViralityPanel({ onClose }: ViralityPanelProps) {
  const factors = [
    { label: 'Hook Strength', score: 72, color: '#FFD60A' },
    { label: 'Pacing', score: 91, color: '#30D158' },
    { label: 'Thumbnail CTR', score: 54, color: '#FF453A' },
    { label: 'Audio Quality', score: 88, color: '#30D158' },
    { label: 'Retention Curve', score: 76, color: '#FFD60A' }
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
          Virality Intelligence
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
        {/* Large Score */}
        <div className="text-center mb-6">
          <div 
            className="text-5xl font-bold mb-2"
            style={{ fontFamily: 'Syne, sans-serif', color: '#0A84FF' }}
          >
            84
          </div>
          <div className="text-xs" style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>
            /100
          </div>
          
          {/* Animated Bar */}
          <div className="mt-4 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#1A1A1A' }}>
            <div 
              className="h-full rounded-full transition-all duration-1000"
              style={{ 
                width: '84%',
                backgroundColor: '#0A84FF',
                boxShadow: '0 0 12px rgba(10, 132, 255, 0.4)'
              }}
            />
          </div>
        </div>

        {/* Factor Rows */}
        <div className="space-y-4">
          {factors.map((factor, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span 
                  className="text-xs"
                  style={{ color: '#888', fontFamily: 'DM Sans, sans-serif' }}
                >
                  {factor.label}
                </span>
                <span 
                  className="text-xs font-mono font-semibold"
                  style={{ color: factor.color }}
                >
                  {factor.score}%
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#1A1A1A' }}>
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${factor.score}%`,
                    backgroundColor: factor.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
