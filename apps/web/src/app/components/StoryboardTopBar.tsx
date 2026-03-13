import { Menu, Undo, Redo, Plus, Sparkles, Share2 } from 'lucide-react';
import { useState } from 'react';

interface StoryboardTopBarProps {
  onAddScene?: () => void;
  onGenerate?: () => void;
  onExportShare?: () => void;
}

export function StoryboardTopBar({ onAddScene, onGenerate, onExportShare }: StoryboardTopBarProps) {
  const [projectTitle, setProjectTitle] = useState('Dark Dream');
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div 
      className="h-12 sm:h-14 border-b px-3 sm:px-4 lg:px-6 flex items-center justify-between flex-shrink-0" 
      style={{ 
        backgroundColor: '#0A0A0A',
        borderColor: '#1E1E1E',
        fontFamily: 'DM Sans, sans-serif' 
      }}
    >
      {/* Left - Menu and Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button className="text-[#666] hover:text-white transition-colors hidden sm:block">
          <Menu size={18} />
        </button>
        <div className="w-px h-4 bg-[#1E1E1E] hidden sm:block"></div>
        <button className="text-[#666] hover:text-white transition-colors">
          <Undo size={16} />
        </button>
        <button className="text-[#666] hover:text-white transition-colors">
          <Redo size={16} />
        </button>
        <div className="w-px h-4 bg-[#1E1E1E]"></div>
        <button 
          onClick={onAddScene}
          className="text-[#666] hover:text-white transition-colors flex items-center gap-1.5 text-xs sm:text-sm"
        >
          <Plus size={14} />
          <span className="hidden md:inline">Add Scene</span>
        </button>
        <button 
          onClick={onGenerate}
          className="px-2.5 py-1.5 bg-[#0A84FF] hover:bg-[#0A84FF]/90 text-white transition-colors flex items-center gap-1.5 text-xs sm:text-sm rounded-lg font-medium"
        >
          <Sparkles size={14} />
          <span>Generate</span>
        </button>
      </div>

      {/* Center - Project Title */}
      <div className="flex items-center gap-2">
        {isEditing ? (
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
            className="bg-transparent text-white text-sm font-medium outline-none border-b border-[#0A84FF] w-32 sm:w-auto"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-white text-sm font-semibold hover:text-[#0A84FF] transition-colors"
          >
            {projectTitle}
          </button>
        )}
        <span className="text-[#666] text-xs sm:text-sm hidden sm:inline">· 12 Mar</span>
      </div>

      {/* Right - Export/Share and Zoom */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onExportShare && (
          <button
            onClick={onExportShare}
            className="px-2.5 py-1.5 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white transition-colors flex items-center gap-1.5 text-xs sm:text-sm rounded-lg font-medium border border-[#3A3A3A]"
          >
            <Share2 size={14} />
            <span className="hidden lg:inline">Export</span>
          </button>
        )}
        <div className="text-[#666] text-xs sm:text-sm hidden md:block font-mono">100%</div>
      </div>
    </div>
  );
}