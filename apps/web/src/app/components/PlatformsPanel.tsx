import { X } from 'lucide-react';
import { useState } from 'react';

interface PlatformsPanelProps {
  onClose: () => void;
}

export function PlatformsPanel({ onClose }: PlatformsPanelProps) {
  const [platforms, setPlatforms] = useState([
    { name: 'YouTube', icon: '▶', enabled: true, resolution: '1080p 16:9' },
    { name: 'TikTok', icon: '◐', enabled: true, resolution: '1080p 9:16' },
    { name: 'Instagram', icon: '□', enabled: false, resolution: '1080p 1:1' },
    { name: 'LinkedIn', icon: '□', enabled: false, resolution: '1080p 16:9' },
    { name: 'Twitter/X', icon: '□', enabled: false, resolution: '720p 16:9' },
    { name: 'Shorts', icon: '□', enabled: true, resolution: '1080p 9:16' }
  ]);

  const togglePlatform = (index: number) => {
    setPlatforms(prev => prev.map((p, i) => 
      i === index ? { ...p, enabled: !p.enabled } : p
    ));
  };

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
          Platform Optimizer
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
        <div className="space-y-3">
          {platforms.map((platform, idx) => (
            <div 
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg border"
              style={{
                backgroundColor: platform.enabled ? 'rgba(10, 132, 255, 0.05)' : '#0E0E0E',
                borderColor: platform.enabled ? 'rgba(10, 132, 255, 0.2)' : '#1A1A1A'
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{platform.icon}</span>
                <div>
                  <div 
                    className="text-xs font-medium"
                    style={{ 
                      color: platform.enabled ? 'white' : '#666',
                      fontFamily: 'DM Sans, sans-serif'
                    }}
                  >
                    {platform.name}
                  </div>
                  <div 
                    className="text-[10px]"
                    style={{ 
                      color: '#444',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}
                  >
                    {platform.resolution}
                  </div>
                </div>
              </div>

              {/* Toggle */}
              <button
                onClick={() => togglePlatform(idx)}
                className="w-8 h-5 rounded-full transition-all relative"
                style={{
                  backgroundColor: platform.enabled ? '#0A84FF' : '#1A1A1A'
                }}
              >
                <div 
                  className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all"
                  style={{
                    left: platform.enabled ? 'calc(100% - 18px)' : '2px'
                  }}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Generate Button */}
        <button
          className="w-full mt-4 py-3 rounded-lg font-semibold text-sm transition-all"
          style={{
            backgroundColor: '#0A84FF',
            color: 'white',
            fontFamily: 'Syne, sans-serif'
          }}
        >
          Generate All Versions
        </button>
      </div>
    </div>
  );
}
