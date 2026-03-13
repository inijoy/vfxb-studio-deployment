import { X } from 'lucide-react';

interface CreatorDNAPanelProps {
  onClose: () => void;
}

export function CreatorDNAPanel({ onClose }: CreatorDNAPanelProps) {
  const styleMetrics = [
    { label: 'Avg cut speed', value: '2.4s between cuts' },
    { label: 'Tone', value: 'High energy, direct' },
    { label: 'Caption style', value: 'Bold, bottom-third' },
    { label: 'Music preference', value: 'Trap / Electronic' },
    { label: 'Hook style', value: 'Question opener' }
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
          Creator DNA
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
        <p className="text-xs mb-6" style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>
          VFXB has learned your style
        </p>

        {/* Style Metrics */}
        <div className="space-y-4 mb-6">
          {styleMetrics.map((metric, idx) => (
            <div key={idx} className="flex items-start justify-between gap-4">
              <span 
                className="text-xs"
                style={{ color: '#444', fontFamily: 'DM Sans, sans-serif' }}
              >
                {metric.label}:
              </span>
              <span 
                className="text-xs text-right"
                style={{ color: 'white', fontFamily: 'DM Sans, sans-serif' }}
              >
                {metric.value}
              </span>
            </div>
          ))}
        </div>

        {/* Progress Section */}
        <div 
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: 'rgba(0, 210, 255, 0.05)',
            borderColor: 'rgba(0, 210, 255, 0.2)'
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span 
              className="text-xs font-medium"
              style={{ color: '#00D4FF', fontFamily: 'DM Sans, sans-serif' }}
            >
              Style confidence
            </span>
            <span 
              className="text-xs font-bold"
              style={{ color: '#00D4FF', fontFamily: 'JetBrains Mono, monospace' }}
            >
              87%
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0, 210, 255, 0.1)' }}>
            <div 
              className="h-full rounded-full transition-all duration-1000"
              style={{ 
                width: '87%',
                backgroundColor: '#00D4FF',
                boxShadow: '0 0 12px rgba(0, 210, 255, 0.4)'
              }}
            />
          </div>
        </div>

        {/* Info Text */}
        <p className="text-[10px] mt-4 leading-relaxed" style={{ color: '#444', fontFamily: 'DM Sans, sans-serif' }}>
          AI learns your style, voice, and pacing over time. Every edit feels authentically you.
        </p>
      </div>
    </div>
  );
}
