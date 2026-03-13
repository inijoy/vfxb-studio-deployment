import { useState } from 'react';
import { Film, Type, Square, Layers, AudioWaveform, Sparkles, Palette, Settings, MessageSquare, X } from 'lucide-react';
import { AssetsPanel } from './AssetsPanel';
import { AIPanel } from './AIPanel';

interface MobileStudioNavProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
  onSettingsOpen: () => void;
}

const panelTabs = [
  { id: 'media', icon: Film, label: 'Media' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'shapes', icon: Square, label: 'Shapes' },
  { id: 'transitions', icon: Layers, label: 'Trans.' },
  { id: 'music', icon: AudioWaveform, label: 'Music' },
  { id: 'effects', icon: Sparkles, label: 'Effects' },
  { id: 'color', icon: Palette, label: 'Color' },
  { id: 'ai', icon: MessageSquare, label: 'AI' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export function MobileStudioNav({ activePanel, onPanelChange, onSettingsOpen }: MobileStudioNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const handleTabPress = (tabId: string) => {
    if (tabId === 'settings') {
      onSettingsOpen();
      setIsOpen(false);
      setActiveTab(null);
      return;
    }
    if (activeTab === tabId && isOpen) {
      setIsOpen(false);
      setActiveTab(null);
    } else {
      setActiveTab(tabId);
      onPanelChange(tabId === 'ai' ? 'media' : tabId);
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setActiveTab(null);
  };

  return (
    <>
      {/* Bottom Panel Sheet */}
      {isOpen && activeTab && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          {/* Bottom Sheet */}
          <div
            className="md:hidden fixed left-0 right-0 z-40 flex flex-col"
            style={{
              bottom: '70px', // just above the fixed tab bar
              maxHeight: '55vh',
              backgroundColor: '#141414',
              borderTop: '1px solid #2A2A2A',
              borderRadius: '16px 16px 0 0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: '#2A2A2A' }}
            >
              <span className="text-white text-sm font-semibold" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {panelTabs.find(t => t.id === activeTab)?.label ?? 'Panel'}
              </span>
              <button
                onClick={handleClose}
                className="w-7 h-7 flex items-center justify-center rounded-full text-[#888] hover:text-white hover:bg-[#2A2A2A] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'ai' ? (
                <AIPanel />
              ) : (
                <AssetsPanel activePanel={activeTab} />
              )}
            </div>
          </div>
        </>
      )}

      {/* Fixed Bottom Tab Bar - mobile only */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex flex-col"
        style={{ backgroundColor: '#0F0F0F', borderTop: '1px solid #2A2A2A' }}
      >
        {/* Pull Handle Indicator */}
        {isOpen && (
          <div className="flex justify-center pt-1">
            <div className="w-8 h-1 rounded-full bg-[#3A3A3A]" />
          </div>
        )}

        {/* Tab Icons */}
        <div className="flex items-center justify-around px-1 py-2">
          {panelTabs.map(({ id, icon: Icon, label }) => {
            const isActive = activeTab === id && isOpen;
            return (
              <button
                key={id}
                onClick={() => handleTabPress(id)}
                className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all min-w-0"
                style={{ flex: 1 }}
              >
                <div
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
                  style={{
                    backgroundColor: isActive ? 'rgba(10,132,255,0.15)' : 'transparent',
                    color: isActive ? '#0A84FF' : '#666',
                  }}
                >
                  <Icon size={16} strokeWidth={1.5} />
                </div>
                <span
                  className="text-[9px] leading-none truncate w-full text-center"
                  style={{
                    color: isActive ? '#0A84FF' : '#555',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}