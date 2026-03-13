import { Upload, ChevronDown, SkipBack, Rewind, Pause, FastForward, SkipForward, Volume2, ZoomIn, Film } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function CenterStage() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [droppedMedia, setDroppedMedia] = useState<{ name: string; color: string } | null>(null);

  const collaborators = [
    { initial: 'A', color: '#FF6B6B' },
    { initial: 'B', color: '#4ECDC4' },
    { initial: 'C', color: '#FFD93D' },
  ];

  // HTML5 drag handlers — accepts media from MediaPanel
  const handleDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('media-item') || e.dataTransfer.types.includes('Files')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only hide if leaving the entire container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    // Media panel item
    const raw = e.dataTransfer.getData('media-item');
    if (raw) {
      try {
        const item = JSON.parse(raw);
        setDroppedMedia({ name: item.name, color: item.thumb || '#0A84FF' });
        toast.success(`"${item.name}" loaded into preview`);
        return;
      } catch {}
    }

    // File system drop
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/') || file.type.startsWith('image/')) {
        setDroppedMedia({ name: file.name, color: '#0A84FF' });
        toast.success(`"${file.name}" loaded into preview`);
      } else {
        toast.error('Please drop a video or image file');
      }
    }
  };

  return (
    <div
      className="flex-1 flex flex-col bg-[#0D0D0D] relative"
      style={{ fontFamily: 'Inter, sans-serif' }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag-over overlay */}
      {isDragOver && (
        <div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none"
          style={{
            backgroundColor: 'rgba(10,132,255,0.12)',
            border: '2px dashed #0A84FF',
            borderRadius: '12px',
          }}
        >
          <Film size={36} className="text-[#0A84FF] mb-3" style={{ filter: 'drop-shadow(0 0 12px #0A84FF)' }} />
          <p className="text-[#0A84FF] text-sm font-semibold">Drop to load in preview</p>
          <p className="text-[#0A84FF]/60 text-xs mt-1">Video or image file</p>
        </div>
      )}

      {/* Video Preview */}
      <div className="flex-1 p-3 sm:p-4 md:p-6 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          {/* Player Container */}
          <div
            className="relative rounded-xl overflow-hidden"
            style={{
              backgroundColor: '#000',
              boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)',
            }}
          >
            {/* Performance Badge */}
            <div
              className="absolute top-2 right-2 sm:top-4 sm:right-4 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#0A84FF] text-white text-xs rounded-full flex items-center gap-1 sm:gap-1.5 z-10"
              style={{ boxShadow: '0 0 20px rgba(10,132,255,0.6)' }}
            >
              <span>⚡</span>
              <span className="font-semibold hidden sm:inline">Score 84 / 100</span>
              <span className="font-semibold sm:hidden">84</span>
            </div>

            {/* 16:9 Aspect Ratio Container */}
            <div className="aspect-video bg-black relative">
              {droppedMedia ? (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                  style={{
                    background: `linear-gradient(135deg, ${droppedMedia.color}22 0%, #000 100%)`,
                  }}
                >
                  <Film size={32} style={{ color: droppedMedia.color }} />
                  <p className="text-white text-sm font-medium">{droppedMedia.name}</p>
                  <p className="text-[#666] text-xs">Playing preview</p>
                </div>
              ) : (
                /* Empty state with drop hint */
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-30">
                  <Upload size={24} className="text-[#666]" />
                  <p className="text-[#666] text-xs">Drag media here to preview</p>
                </div>
              )}
            </div>

            {/* Controls Bar */}
            <div className="bg-[#1A1A1A] px-2 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between">
              {/* Playback Controls */}
              <div className="flex items-center gap-1.5 sm:gap-3">
                <button className="text-[#8A8A8A] hover:text-white transition-colors hidden sm:block">
                  <SkipBack size={14} className="sm:w-4 sm:h-4" />
                </button>
                <button className="text-[#8A8A8A] hover:text-white transition-colors hidden sm:block">
                  <Rewind size={14} className="sm:w-4 sm:h-4" />
                </button>
                <button className="text-white hover:text-[#0A84FF] transition-colors">
                  <Pause size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
                <button className="text-[#8A8A8A] hover:text-white transition-colors hidden sm:block">
                  <FastForward size={14} className="sm:w-4 sm:h-4" />
                </button>
                <button className="text-[#8A8A8A] hover:text-white transition-colors hidden sm:block">
                  <SkipForward size={14} className="sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Timecode */}
              <div className="text-white text-xs" style={{ fontFamily: 'DM Mono, monospace' }}>
                <span className="hidden sm:inline">01:24 / 03:45</span>
                <span className="sm:hidden">01:24</span>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2 sm:gap-4">
                <button className="text-[#8A8A8A] hover:text-white transition-colors flex items-center gap-1">
                  <Volume2 size={14} className="sm:w-4 sm:h-4" />
                </button>
                <button className="text-[#8A8A8A] hover:text-white transition-colors items-center gap-1 text-xs hidden md:flex">
                  <ZoomIn size={14} />
                  <span>25%</span>
                  <ChevronDown size={12} />
                </button>
                <button className="text-[#8A8A8A] hover:text-white transition-colors items-center gap-1 text-xs hidden lg:flex">
                  <span>16:9</span>
                  <ChevronDown size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
