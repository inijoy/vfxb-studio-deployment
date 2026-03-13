import { useState } from 'react';
import { InfoTab } from './ai-tabs/InfoTab';
import { AlignTab } from './ai-tabs/AlignTab';
import { AIChatTab } from './ai-tabs/AIChatTab';
import { PreviewTab } from './ai-tabs/PreviewTab';
import { AudioTab } from './ai-tabs/AudioTab';

export function AIPanel() {
  const [activeTab, setActiveTab] = useState('chat');

  const tabs = [
    { id: 'info', label: 'Info' },
    { id: 'align', label: 'Align' },
    { id: 'chat', label: 'AI Chat' },
    { id: 'preview', label: 'Preview' },
    { id: 'audio', label: 'Audio' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return <InfoTab />;
      case 'align':
        return <AlignTab />;
      case 'chat':
        return <AIChatTab />;
      case 'preview':
        return <PreviewTab />;
      case 'audio':
        return <AudioTab />;
      default:
        return <AIChatTab />;
    }
  };

  return (
    <div className="w-full md:w-64 lg:w-[300px] bg-[#161616] flex flex-col h-full border-l border-[#3A3A3A]" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="px-3 sm:px-4 py-3 border-b border-[#3A3A3A]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold text-sm">VFXB AI</h2>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-500 text-xs">Online</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 sm:gap-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative text-xs pb-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id ? 'text-white' : 'text-[#8A8A8A] hover:text-white'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0A84FF]"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'chat' ? (
          renderTabContent()
        ) : (
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4">
            {renderTabContent()}
          </div>
        )}
      </div>
    </div>
  );
}