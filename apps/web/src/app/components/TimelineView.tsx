import { useState } from 'react';
import { IconSidebar } from './IconSidebar';
import { AssetsPanel } from './AssetsPanel';
import { CenterStage } from './CenterStage';
import { AIPanel } from './AIPanel';
import { Timeline } from './Timeline';
import { SettingsModal } from './SettingsModal';
import { MobileStudioNav } from './MobileStudioNav';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { GripHorizontal } from 'lucide-react';

interface TimelineViewProps {
  activeIcon: string;
  onIconClick: (icon: string) => void;
}

export function TimelineView({ activeIcon, onIconClick }: TimelineViewProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleIconClick = (icon: string) => {
    if (icon === 'settings') {
      setIsSettingsOpen(true);
    } else {
      onIconClick(icon);
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden md:pb-0 pb-[72px]">
      {/* Resizable Panel Group - Vertical split between main content and timeline */}
      <PanelGroup direction="vertical" className="flex-1">
        {/* Main Content Area - Resizable */}
        <Panel defaultSize={65} minSize={30} maxSize={85} className="flex flex-col">
          <div className="flex-1 flex overflow-auto min-h-0 h-full">
            {/* Desktop Left Icon Sidebar */}
            <div className="hidden md:block">
              <IconSidebar activeIcon={activeIcon} onIconClick={handleIconClick} />
            </div>

            {/* Desktop Assets Panel - Resizable */}
            <div className="hidden lg:block">
              <AssetsPanel activePanel={activeIcon} />
            </div>

            {/* Center Stage - Takes remaining space */}
            <div className="flex-1 min-w-0">
              <CenterStage />
            </div>

            {/* Desktop AI Chat Panel */}
            <div className="hidden xl:block">
              <AIPanel />
            </div>
          </div>
        </Panel>

        {/* Resize Handle */}
        <PanelResizeHandle className="group relative h-2 bg-[#1A1A1A] hover:bg-[#0A84FF] transition-colors flex items-center justify-center">
          <div className="w-12 h-1 bg-[#3A3A3A] rounded-full group-hover:bg-white transition-colors" />
        </PanelResizeHandle>

        {/* Timeline - Resizable with horizontal scroll */}
        <Panel defaultSize={35} minSize={15} maxSize={70} className="flex flex-col overflow-hidden">
          <Timeline />
        </Panel>
      </PanelGroup>

      {/* Mobile Bottom Nav — replaces hamburger */}
      <MobileStudioNav
        activePanel={activeIcon}
        onPanelChange={onIconClick}
        onSettingsOpen={() => setIsSettingsOpen(true)}
      />

      {/* Settings Modal */}
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
}