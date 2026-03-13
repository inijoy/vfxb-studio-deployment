import { Play, Pause, Volume2, Film, Zap, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { ViralityPanel } from './ViralityPanel';
import { PlatformsPanel } from './PlatformsPanel';
import { CreatorDNAPanel } from './CreatorDNAPanel';
import { AudienceSimulationPanel } from './AudienceSimulationPanel';
import { AutoPublishPanel } from './AutoPublishPanel';

interface VideoPreviewProps {
  mode: 'long-form' | 'short-form' | 'agency';
  showBeforeAfter: boolean;
  onCloseBeforeAfter: () => void;
  onShowFeatures?: () => void;
}

type FeaturePanel = 'virality' | 'platforms' | 'dna' | 'simulate' | 'autopublish' | null;

export function VideoPreview({ mode, showBeforeAfter, onCloseBeforeAfter, onShowFeatures }: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activePanel, setActivePanel] = useState<FeaturePanel>(null);
  const duration = 204; // 3:24 in seconds

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col p-3 sm:p-4 md:p-6 lg:p-8 lg:pr-4 relative">
      {/* Top Bar */}
      <div className="flex flex-col gap-3 mb-4 sm:mb-6">
        {/* First Row - Score, Features Button, Mode Switcher */}
        <div className="flex items-center justify-between gap-2">
          {/* Score Badge */}
          <button 
            className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium transition-all flex-shrink-0"
            style={{
              backgroundColor: '#0A84FF',
              color: 'white',
              boxShadow: '0 0 20px rgba(10, 132, 255, 0.3)',
              fontFamily: 'JetBrains Mono, monospace'
            }}
          >
            ⚡ 84
          </button>

          <div className="flex items-center gap-2">
            {/* What can VFXB do? button */}
            <button
              onClick={onShowFeatures}
              className="px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-medium transition-all border hover:border-[#0A84FF] hover:text-white"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                borderColor: '#1E1E1E',
                color: '#666',
                backgroundColor: 'transparent'
              }}
            >
              <Sparkles size={12} />
              <span>What can VFXB do?</span>
            </button>

            {/* Mode Switcher */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 sm:gap-1.5 ${
                  mode === 'long-form'
                    ? 'bg-[#0A84FF] text-white'
                    : 'bg-[#1a1a1a] text-[#666] hover:text-white'
                }`}
              >
                <Film size={12} className="sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Long-form</span>
                <span className="sm:hidden">Long</span>
              </button>
              <button
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 sm:gap-1.5 ${
                  mode === 'short-form'
                    ? 'bg-[#0A84FF] text-white'
                    : 'bg-[#1a1a1a] text-[#666] hover:text-white'
                }`}
              >
                <Zap size={12} className="sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Short-form</span>
                <span className="sm:hidden">Short</span>
              </button>
            </div>
          </div>
        </div>

        {/* Second Row - Feature Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActivePanel(activePanel === 'virality' ? null : 'virality')}
            className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-medium transition-all border whitespace-nowrap ${
              activePanel === 'virality' 
                ? 'bg-[rgba(10,132,255,0.12)] text-[#0A84FF] border-[#0A84FF]'
                : 'bg-[#0E0E0E] text-[#555] border-[#1E1E1E] hover:border-[#0A84FF] hover:text-white'
            }`}
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Virality
          </button>
          <button
            onClick={() => setActivePanel(activePanel === 'platforms' ? null : 'platforms')}
            className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-medium transition-all border whitespace-nowrap ${
              activePanel === 'platforms' 
                ? 'bg-[rgba(10,132,255,0.12)] text-[#0A84FF] border-[#0A84FF]'
                : 'bg-[#0E0E0E] text-[#555] border-[#1E1E1E] hover:border-[#0A84FF] hover:text-white'
            }`}
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Platforms
          </button>
          <button
            onClick={() => setActivePanel(activePanel === 'dna' ? null : 'dna')}
            className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-medium transition-all border whitespace-nowrap ${
              activePanel === 'dna' 
                ? 'bg-[rgba(10,132,255,0.12)] text-[#0A84FF] border-[#0A84FF]'
                : 'bg-[#0E0E0E] text-[#555] border-[#1E1E1E] hover:border-[#0A84FF] hover:text-white'
            }`}
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            DNA
          </button>
          <button
            onClick={() => setActivePanel(activePanel === 'simulate' ? null : 'simulate')}
            className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-medium transition-all border whitespace-nowrap ${
              activePanel === 'simulate' 
                ? 'bg-[rgba(10,132,255,0.12)] text-[#0A84FF] border-[#0A84FF]'
                : 'bg-[#0E0E0E] text-[#555] border-[#1E1E1E] hover:border-[#0A84FF] hover:text-white'
            }`}
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Simulate
          </button>
          <button
            onClick={() => setActivePanel(activePanel === 'autopublish' ? null : 'autopublish')}
            className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-medium transition-all border whitespace-nowrap ${
              activePanel === 'autopublish' 
                ? 'bg-[rgba(10,132,255,0.12)] text-[#0A84FF] border-[#0A84FF]'
                : 'bg-[#0E0E0E] text-[#555] border-[#1E1E1E] hover:border-[#0A84FF] hover:text-white'
            }`}
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Auto-Publish
          </button>
        </div>
      </div>

      {/* Video Player */}
      <div className="flex-1 flex items-center justify-center">
        {showBeforeAfter ? (
          // Before/After Split View
          <div className="w-full max-w-5xl">
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Before */}
              <div>
                <div className="text-[#666] text-xs font-medium mb-2 text-center">BEFORE</div>
                <div 
                  className="aspect-video rounded-xl overflow-hidden"
                  style={{
                    backgroundColor: '#0d0d0d',
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)'
                  }}
                />
              </div>
              {/* After */}
              <div>
                <div className="text-[#0A84FF] text-xs font-medium mb-2 text-center">AFTER</div>
                <div 
                  className="aspect-video rounded-xl overflow-hidden"
                  style={{
                    backgroundColor: '#0d0d0d',
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
                    boxShadow: '0 0 20px rgba(10, 132, 255, 0.2)'
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={onCloseBeforeAfter}
                className="px-6 py-2.5 bg-[#30D158] text-white rounded-lg font-medium hover:bg-[#30D158]/90 transition-colors"
              >
                ✓ Keep This
              </button>
              <button
                onClick={onCloseBeforeAfter}
                className="px-6 py-2.5 bg-[#1a1a1a] text-[#888] border border-[#2a2a2a] rounded-lg font-medium hover:text-white hover:bg-[#222] transition-colors"
              >
                ✗ Revert
              </button>
            </div>
          </div>
        ) : (
          // Normal Single View
          <div className="w-full max-w-5xl">
            <div 
              className="aspect-video rounded-xl overflow-hidden relative"
              style={{
                backgroundColor: '#0d0d0d',
                background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
              }}
            >
              {/* Vignette */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.4) 100%)'
                }}
              />
            </div>

            {/* Playback Controls */}
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                {isPlaying ? (
                  <Pause size={16} className="text-black" />
                ) : (
                  <Play size={16} className="text-black ml-0.5" />
                )}
              </button>

              <div 
                className="text-[#666] text-xs" 
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {formatTime(currentTime)}
              </div>

              {/* Progress Bar */}
              <div className="flex-1 h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              <div 
                className="text-[#666] text-xs" 
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {formatTime(duration)}
              </div>

              <button className="p-2 text-[#666] hover:text-white transition-colors">
                <Volume2 size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Feature Panels */}
      {activePanel === 'virality' && <ViralityPanel onClose={() => setActivePanel(null)} />}
      {activePanel === 'platforms' && <PlatformsPanel onClose={() => setActivePanel(null)} />}
      {activePanel === 'dna' && <CreatorDNAPanel onClose={() => setActivePanel(null)} />}
      {activePanel === 'simulate' && <AudienceSimulationPanel onClose={() => setActivePanel(null)} />}
      {activePanel === 'autopublish' && <AutoPublishPanel onClose={() => setActivePanel(null)} />}
    </div>
  );
}