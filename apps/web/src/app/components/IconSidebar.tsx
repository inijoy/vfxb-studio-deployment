import { Film, Type, Square, Layers, AudioWaveform, Sparkles, Palette, Settings } from 'lucide-react';
import vfxbLogo from "../../assets/87baff59339294d92e591456a1fc7b6ab9585915.png";

interface IconSidebarProps {
  activeIcon: string;
  onIconClick: (icon: string) => void;
}

const icons = [
  { id: 'media', icon: Film, label: 'Media' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'shapes', icon: Square, label: 'Shapes' },
  { id: 'transitions', icon: Layers, label: 'Transitions' },
  { id: 'music', icon: AudioWaveform, label: 'Music' },
  { id: 'effects', icon: Sparkles, label: 'Effects' },
  { id: 'color', icon: Palette, label: 'Color' },
];

export function IconSidebar({ activeIcon, onIconClick }: IconSidebarProps) {
  return (
    <div className="w-12 sm:w-14 md:w-16 bg-[#111111] flex flex-col items-center py-4 sm:py-6 gap-4 sm:gap-6" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Logo */}
      <div className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center mb-1 sm:mb-2">
        <img 
          src={vfxbLogo} 
          alt="VFXB" 
          className="h-6 sm:h-8 w-auto"
          style={{
            filter: 'brightness(0) invert(1) drop-shadow(0 0 10px rgba(10, 132, 255, 0.5))',
            opacity: 0.95
          }}
        />
      </div>

      {/* Icon Stack */}
      <div className="flex-1 flex flex-col gap-2 sm:gap-4">
        {icons.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onIconClick(id)}
            className={`group relative w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center rounded-lg transition-colors ${
              activeIcon === id ? 'text-white' : 'text-[#8A8A8A] hover:text-white'
            }`}
            title={label}
          >
            {activeIcon === id && (
              <div className="absolute left-0 w-0.5 sm:w-1 h-4 sm:h-6 bg-[#0A84FF] rounded-r"></div>
            )}
            <Icon size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={1.5} />
            
            {/* Tooltip - Hidden on touch devices */}
            <div className="hidden md:block absolute left-12 sm:left-16 px-2 py-1 bg-[#1E1E1E] text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
              {label}
            </div>
          </button>
        ))}
      </div>

      {/* Settings at bottom */}
      <button
        onClick={() => onIconClick('settings')}
        className={`group relative w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center rounded-lg transition-colors ${
          activeIcon === 'settings' ? 'text-white' : 'text-[#8A8A8A] hover:text-white'
        }`}
        title="Settings"
      >
        {activeIcon === 'settings' && (
          <div className="absolute left-0 w-0.5 sm:w-1 h-4 sm:h-6 bg-[#0A84FF] rounded-r"></div>
        )}
        <Settings size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={1.5} />
        
        {/* Tooltip - Hidden on touch devices */}
        <div className="hidden md:block absolute left-12 sm:left-16 px-2 py-1 bg-[#1E1E1E] text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
          Settings
        </div>
      </button>
    </div>
  );
}