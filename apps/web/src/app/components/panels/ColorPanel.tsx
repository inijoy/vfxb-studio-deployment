import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export function ColorPanel() {
  const [shadows, setShadows] = useState(0);
  const [midtones, setMidtones] = useState(0);
  const [highlights, setHighlights] = useState(0);
  const [vignette, setVignette] = useState(0);

  const handleReset = () => {
    setShadows(0);
    setMidtones(0);
    setHighlights(0);
    setVignette(0);
    toast.success('Color grading reset');
  };

  const handleApply = () => {
    toast.success('Color grading applied');
  };

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="px-4 py-4 border-b border-[#3A3A3A]">
        <h3 className="text-white font-semibold text-sm">Color Grading</h3>
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto space-y-5">
        {/* RGB Curves Placeholder */}
        <div>
          <label className="text-[#8A8A8A] text-xs mb-2 block">RGB Curves</label>
          <div className="relative w-full h-32 bg-[#0D0D0D] rounded-lg border border-[#3A3A3A] overflow-hidden">
            {/* Simplified curve visualization */}
            <svg width="100%" height="100%" className="absolute inset-0">
              {/* Red curve */}
              <path
                d="M 0 128 Q 50 100, 100 80 T 192 20"
                stroke="#FF6B6B"
                strokeWidth="2"
                fill="none"
                opacity="0.7"
              />
              {/* Green curve */}
              <path
                d="M 0 128 Q 50 105, 100 90 T 192 40"
                stroke="#4ECDC4"
                strokeWidth="2"
                fill="none"
                opacity="0.7"
              />
              {/* Blue curve */}
              <path
                d="M 0 128 Q 50 110, 100 95 T 192 50"
                stroke="#0A84FF"
                strokeWidth="2"
                fill="none"
                opacity="0.7"
              />
            </svg>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-3">
          <div>
            <label className="text-[#8A8A8A] text-xs mb-1.5 block">Shadows: {shadows}</label>
            <input
              type="range"
              min="-100"
              max="100"
              value={shadows}
              onChange={(e) => setShadows(Number(e.target.value))}
              className="w-full h-1 bg-[#3A3A3A] rounded-lg appearance-none cursor-pointer accent-[#0A84FF]"
            />
          </div>
          <div>
            <label className="text-[#8A8A8A] text-xs mb-1.5 block">Midtones: {midtones}</label>
            <input
              type="range"
              min="-100"
              max="100"
              value={midtones}
              onChange={(e) => setMidtones(Number(e.target.value))}
              className="w-full h-1 bg-[#3A3A3A] rounded-lg appearance-none cursor-pointer accent-[#0A84FF]"
            />
          </div>
          <div>
            <label className="text-[#8A8A8A] text-xs mb-1.5 block">Highlights: {highlights}</label>
            <input
              type="range"
              min="-100"
              max="100"
              value={highlights}
              onChange={(e) => setHighlights(Number(e.target.value))}
              className="w-full h-1 bg-[#3A3A3A] rounded-lg appearance-none cursor-pointer accent-[#0A84FF]"
            />
          </div>
          <div>
            <label className="text-[#8A8A8A] text-xs mb-1.5 block">Vignette: {vignette}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={vignette}
              onChange={(e) => setVignette(Number(e.target.value))}
              className="w-full h-1 bg-[#3A3A3A] rounded-lg appearance-none cursor-pointer accent-[#0A84FF]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex-1 border border-[#3A3A3A] text-[#8A8A8A] hover:text-white hover:border-[#8A8A8A] font-medium py-2.5 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
          <button
            onClick={handleApply}
            className="flex-1 bg-[#0A84FF] text-white font-medium py-2.5 rounded-md hover:bg-[#0A84FF]/90 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
