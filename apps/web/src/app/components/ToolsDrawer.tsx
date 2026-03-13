import { X, Scissors } from 'lucide-react';

interface ToolsDrawerProps {
  onClose: () => void;
}

export function ToolsDrawer({ onClose }: ToolsDrawerProps) {
  return (
    <div 
      className="absolute bottom-0 left-0 right-0 border-t"
      style={{
        height: '300px',
        backgroundColor: '#0e0e0e',
        borderColor: '#1e1e1e',
        fontFamily: 'DM Sans, sans-serif'
      }}
    >
      {/* Header */}
      <div className="h-10 border-b px-4 flex items-center justify-between" style={{ borderColor: '#1e1e1e' }}>
        <div className="flex items-center gap-2 text-white text-sm font-medium">
          <Scissors size={14} />
          Timeline
        </div>
        <button
          onClick={onClose}
          className="text-[#666] hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Timeline Content */}
      <div className="h-[calc(100%-40px)] p-4">
        {/* Ruler */}
        <div className="mb-3 flex items-center">
          <div className="text-[#666] text-[10px] mr-3" style={{ fontFamily: 'JetBrains Mono, monospace', width: '40px' }}>
            0:00
          </div>
          <div className="flex-1 h-4 border-b border-[#2a2a2a] relative">
            {[...Array(13)].map((_, i) => (
              <div
                key={i}
                className="absolute top-0 w-px h-2 bg-[#2a2a2a]"
                style={{ left: `${(i / 12) * 100}%` }}
              />
            ))}
          </div>
          <div className="text-[#666] text-[10px] ml-3" style={{ fontFamily: 'JetBrains Mono, monospace', width: '40px', textAlign: 'right' }}>
            3:24
          </div>
        </div>

        {/* Tracks */}
        <div className="space-y-2">
          {/* Video Track */}
          <div className="flex items-center gap-3">
            <div className="text-[#666] text-xs w-16 flex-shrink-0">Video</div>
            <div className="flex-1 h-10 rounded border relative" style={{ backgroundColor: '#1a1a1a', borderColor: '#2a2a2a' }}>
              <div 
                className="absolute top-0 left-0 h-full rounded"
                style={{
                  width: '85%',
                  backgroundColor: '#0A84FF',
                  opacity: 0.3,
                  border: '1px solid #0A84FF'
                }}
              />
            </div>
          </div>

          {/* Audio Track */}
          <div className="flex items-center gap-3">
            <div className="text-[#666] text-xs w-16 flex-shrink-0">Audio</div>
            <div className="flex-1 h-10 rounded border relative" style={{ backgroundColor: '#1a1a1a', borderColor: '#2a2a2a' }}>
              <div 
                className="absolute top-0 left-0 h-full rounded"
                style={{
                  width: '85%',
                  backgroundColor: '#30D158',
                  opacity: 0.3,
                  border: '1px solid #30D158'
                }}
              />
            </div>
          </div>

          {/* Captions Track */}
          <div className="flex items-center gap-3">
            <div className="text-[#666] text-xs w-16 flex-shrink-0">Captions</div>
            <div className="flex-1 h-10 rounded border" style={{ backgroundColor: '#1a1a1a', borderColor: '#2a2a2a' }}>
              {/* Empty track */}
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[#666] text-xs italic">
            Use trim handles to adjust clips. Close this drawer to return to chat mode.
          </p>
        </div>
      </div>
    </div>
  );
}
