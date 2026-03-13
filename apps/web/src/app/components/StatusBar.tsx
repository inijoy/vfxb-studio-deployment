import { LayoutList, Sparkles } from 'lucide-react';
import vfxbLogo from "../../assets/87baff59339294d92e591456a1fc7b6ab9585915.png";

interface StatusBarProps {
  activeView: 'timeline' | 'storyboard';
  onViewChange: (view: 'timeline' | 'storyboard') => void;
}

export function StatusBar({ activeView, onViewChange }: StatusBarProps) {
  return (
    <div className="h-6 sm:h-7 bg-[#111111] border-t border-[#3A3A3A] px-2 sm:px-4 flex items-center justify-between text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Left */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <img 
          src={vfxbLogo} 
          alt="VFXB" 
          className="h-3 sm:h-4 w-auto"
          style={{
            filter: 'brightness(0) invert(1)',
            opacity: 0.9
          }}
        />
        <span className="text-white font-medium text-xs hidden sm:inline">VFXB Studio</span>
        <span className="text-white font-medium text-xs sm:hidden">VFXB</span>
      </div>

      {/* Center Tabs - Hidden on very small screens */}
      <div className="hidden sm:flex items-center gap-3 sm:gap-4">
        <button 
          onClick={() => onViewChange('timeline')}
          className={`flex items-center gap-1 sm:gap-1.5 transition-colors ${
            activeView === 'timeline' ? 'text-white' : 'text-[#8A8A8A] hover:text-white'
          }`}
        >
          <LayoutList size={12} className="sm:w-3.5 sm:h-3.5" />
          <span className="hidden md:inline">Timeline</span>
        </button>
        <button 
          onClick={() => onViewChange('storyboard')}
          className={`flex items-center gap-1 sm:gap-1.5 transition-colors ${
            activeView === 'storyboard' ? 'text-white' : 'text-[#8A8A8A] hover:text-white'
          }`}
        >
          <Sparkles size={12} className="sm:w-3.5 sm:h-3.5" />
          <span className="hidden md:inline">Storyboard</span>
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="text-[#8A8A8A] hidden sm:inline">v1.0.0</span>
        <div className="flex items-center gap-1 sm:gap-1.5">
          <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-red-500 rounded-full"></div>
          <span className="text-[#8A8A8A] hidden md:inline">0 errors</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5">
          <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-[#0A84FF] rounded-full"></div>
          <span className="text-[#0A84FF]">BETA</span>
        </div>
      </div>
    </div>
  );
}