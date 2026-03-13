import { MessageSquare, Film, Layout } from 'lucide-react';

type View = 'chat' | 'studio' | 'storyboard';

interface ViewSwitcherProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

export function ViewSwitcher({ activeView, onViewChange }: ViewSwitcherProps) {
  const views = [
    { id: 'chat' as View, label: 'Chat', icon: MessageSquare },
    { id: 'studio' as View, label: 'Studio', icon: Film },
    { id: 'storyboard' as View, label: 'Storyboard', icon: Layout }
  ];

  return (
    <div 
      className="flex items-center gap-1 p-1 rounded-lg border backdrop-blur-sm"
      style={{
        backgroundColor: 'rgba(14, 14, 14, 0.9)',
        borderColor: '#2a2a2a'
      }}
    >
      {views.map((view) => {
        const Icon = view.icon;
        const isActive = activeView === view.id;
        
        return (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 ${
              isActive
                ? 'bg-[#0A84FF] text-white shadow-[0_0_15px_rgba(10,132,255,0.3)]'
                : 'text-[#666] hover:text-white hover:bg-[#1a1a1a]'
            }`}
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            <Icon size={14} className="sm:w-4 sm:h-4" />
            <span>{view.label}</span>
          </button>
        );
      })}
    </div>
  );
}