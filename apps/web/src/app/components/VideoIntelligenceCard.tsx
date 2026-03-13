import { Play } from 'lucide-react';
import { useState, useEffect } from 'react';

export function VideoIntelligenceCard() {
  const [score, setScore] = useState(0);
  const targetScore = 84;

  // Animate score on mount
  useEffect(() => {
    const duration = 1200;
    const steps = 60;
    const increment = targetScore / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetScore) {
        setScore(targetScore);
        clearInterval(timer);
      } else {
        setScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  const getScoreColor = (score: number) => {
    if (score > 75) return '#30D158';
    if (score >= 50) return '#FFD60A';
    return '#FF453A';
  };

  const scoreColor = getScoreColor(score);
  const scorePercent = (score / 100) * 100;

  return (
    <div 
      className="rounded-xl p-4 border"
      style={{
        backgroundColor: '#141414',
        borderColor: '#222'
      }}
    >
      {/* Video Info */}
      <div className="flex items-start gap-3 mb-4">
        <div 
          className="w-16 h-16 rounded-lg bg-gradient-to-br flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)'
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="text-white font-medium text-sm mb-1">my-video.mp4</div>
          <div className="text-[#666] text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            03:24 · 1080p · 30fps
          </div>
        </div>
      </div>

      {/* Virality Score */}
      <div className="mb-3">
        <div className="text-[#888] text-xs font-medium mb-2">VIRALITY SCORE</div>
        
        {/* Progress Bar */}
        <div className="relative h-2 bg-[#1a1a1a] rounded-full overflow-hidden mb-2">
          <div 
            className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${scorePercent}%`,
              backgroundColor: scoreColor,
              boxShadow: `0 0 10px ${scoreColor}80`
            }}
          />
        </div>

        {/* Score Text */}
        <div className="flex items-center justify-between">
          <div className="text-white font-bold text-lg" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {score}/100
          </div>
          <div className="text-[#666] text-xs">
            Top 12% of videos in your niche
          </div>
        </div>
      </div>

      {/* Watch Analysis Button */}
      <button 
        className="w-full py-2 rounded-lg border transition-colors flex items-center justify-center gap-2 text-sm font-medium"
        style={{
          backgroundColor: '#1a1a1a',
          borderColor: '#2a2a2a',
          color: '#888'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#0A84FF';
          e.currentTarget.style.color = '#fff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#2a2a2a';
          e.currentTarget.style.color = '#888';
        }}
      >
        <Play size={14} />
        Watch Analysis
      </button>
    </div>
  );
}
