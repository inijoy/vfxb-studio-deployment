import { useState } from 'react';
import { BeautifulAIChat } from './BeautifulAIChat';
import { VideoPreview } from './VideoPreview';
import { ToolsDrawer } from './ToolsDrawer';
import { FeaturesPanel } from './FeaturesPanel';
import { MessageSquare, X } from 'lucide-react';

interface MainInterfaceProps {
  mode: 'long-form' | 'short-form' | 'agency';
}

export function MainInterface({ mode }: MainInterfaceProps) {
  const [showToolsDrawer, setShowToolsDrawer] = useState(false);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [showFeaturesPanel, setShowFeaturesPanel] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);

  return (
    <div className="w-full h-full flex overflow-hidden relative" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      {/* Features Panel Modal */}
      {showFeaturesPanel && <FeaturesPanel onClose={() => setShowFeaturesPanel(false)} />}

      {/* Mobile Chat Toggle Button */}
      <button
        onClick={() => setShowMobileChat(!showMobileChat)}
        className="lg:hidden fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all"
        style={{
          backgroundColor: '#0A84FF',
          color: 'white'
        }}
      >
        {showMobileChat ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* LEFT PANEL - Video Preview (flexible) */}
      <div 
        className="flex-1 relative flex flex-col min-h-0"
        style={{ backgroundColor: '#070707' }}
      >
        <VideoPreview 
          mode={mode}
          showBeforeAfter={showBeforeAfter}
          onCloseBeforeAfter={() => setShowBeforeAfter(false)}
          onShowFeatures={() => setShowFeaturesPanel(true)}
        />

        {/* Tools Drawer (hidden by default, slides up from bottom) */}
        {showToolsDrawer && (
          <ToolsDrawer onClose={() => setShowToolsDrawer(false)} />
        )}
      </div>

      {/* RIGHT PANEL - AI Director Chat (400px on desktop, overlay on mobile) */}
      <div 
        className={`
          lg:w-[400px] lg:relative lg:flex-shrink-0 lg:border-l
          fixed inset-y-0 right-0 w-full sm:w-[400px] z-40
          flex flex-col h-full
          transition-transform duration-300 ease-in-out
          ${showMobileChat ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
        style={{
          backgroundColor: '#0A0A0A',
          borderColor: '#1A1A1A'
        }}
      >
        <BeautifulAIChat 
          mode={mode}
          onShowTools={() => setShowToolsDrawer(true)}
          onShowBeforeAfter={() => setShowBeforeAfter(true)}
        />
      </div>

      {/* Mobile Overlay */}
      {showMobileChat && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setShowMobileChat(false)}
        />
      )}
    </div>
  );
}