import { useState, useRef, useEffect } from 'react';
import { VideoIntelligenceCard } from './VideoIntelligenceCard';
import { InsightCard } from './InsightCard';
import { ChatThread } from './ChatThread';
import { AgentSelector } from './AgentSelector';
import { ChatInput } from './ChatInput';
import { toast } from 'sonner';

interface AIDirectorPanelProps {
  mode: 'long-form' | 'short-form' | 'agency';
  onShowTools: () => void;
  onShowBeforeAfter: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: { label: string; onClick: () => void }[];
}

export function AIDirectorPanel({ mode, onShowTools, onShowBeforeAfter }: AIDirectorPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedAgent, setSelectedAgent] = useState('VFXB Engine');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initial insights
  const insights = [
    {
      type: 'critical' as const,
      icon: '🔴',
      title: 'Hook · 0:00–0:03',
      description: 'Static opening. No motion, no face, no text. 71% of viewers leave in the first 3 seconds.',
      actions: [
        { label: 'Fix This Now', onClick: () => handleFixHook() },
        { label: 'Tell me more', onClick: () => handleTellMore('hook') }
      ]
    },
    {
      type: 'warning' as const,
      icon: '🟡',
      title: 'Pacing · 0:45–1:20',
      description: '35-second segment with no cuts. Retention drops 40% here.',
      actions: [
        { label: 'Fix This Now', onClick: () => handleFixPacing() },
        { label: 'Tell me more', onClick: () => handleTellMore('pacing') }
      ]
    },
    {
      type: 'success' as const,
      icon: '🟢',
      title: 'Audio Sync · Good',
      description: 'Music matches edit rhythm. Retention boost: ~18%',
      actions: [
        { label: '✓ Nice', onClick: () => {} }
      ]
    }
  ];

  const handleFixHook = () => {
    onShowBeforeAfter();
    addMessage('assistant', 'I trimmed 4 seconds from your intro and added a zoom-in on frame 1. Want to see the before and after?', [
      { label: '▶ Preview Change', onClick: onShowBeforeAfter },
      { label: 'Undo', onClick: () => toast.info('Changes reverted') }
    ]);
  };

  const handleFixPacing = () => {
    addMessage('assistant', 'I found 3 dead spots in your video. Fix all of them?', [
      { label: 'Yes, fix all', onClick: () => handleFixAll() },
      { label: 'Show me first', onClick: onShowBeforeAfter }
    ]);
  };

  const handleFixAll = () => {
    toast.success('Applied 3 cuts to improve pacing');
    addMessage('assistant', 'Done! I made 3 cuts in the slow segments. Your retention should improve by ~25%. Want to see the edits?', [
      { label: '▶ Preview', onClick: onShowBeforeAfter },
      { label: 'Export now', onClick: () => toast.success('Exporting...') }
    ]);
  };

  const handleTellMore = (topic: string) => {
    if (topic === 'hook') {
      addMessage('assistant', 'Your hook needs immediate visual interest. Research shows viewers decide in 3 seconds whether to watch. I recommend starting with movement, a face, or bold text overlay.');
    } else {
      addMessage('assistant', 'Long static segments cause viewers to lose interest. I detected a 35-second segment with zero cuts. Adding cuts every 5-7 seconds significantly boosts retention.');
    }
  };

  const handleUserMessage = (content: string) => {
    addMessage('user', content);

    // Simulate AI responses
    setTimeout(() => {
      const lowerContent = content.toLowerCase();
      
      if (lowerContent.includes('timeline') || lowerContent.includes('show')) {
        onShowTools();
        addMessage('assistant', 'Opening the timeline for you.');
      } else if (lowerContent.includes('tiktok') || lowerContent.includes('60')) {
        addMessage('assistant', 'Creating 60s cut for TikTok... Done! Your video is now optimized for vertical format with auto-captions.', [
          { label: '▶ Preview', onClick: onShowBeforeAfter },
          { label: 'Export', onClick: () => toast.success('Exporting TikTok version...') }
        ]);
      } else if (lowerContent.includes('caption')) {
        addMessage('assistant', 'Generating captions... Done! 47 lines added. Want to change the font?', [
          { label: 'Change font', onClick: () => toast.info('Font selector opened') },
          { label: 'Preview', onClick: onShowBeforeAfter }
        ]);
      } else if (lowerContent.includes('silence')) {
        addMessage('assistant', 'Found 12 silence gaps totaling 47 seconds. Remove all?', [
          { label: 'Yes, remove all', onClick: () => {
            toast.success('Removed 12 silence gaps');
            addMessage('assistant', 'Done! Your video is now 47 seconds shorter and much tighter.');
          }},
          { label: 'Show me first', onClick: onShowBeforeAfter }
        ]);
      } else if (lowerContent.includes('music') || lowerContent.includes('audio')) {
        addMessage('assistant', 'Here are 3 tracks that match your video mood:', [
          { label: '♪ Play Track 1', onClick: () => toast.info('Playing...') },
          { label: '♪ Play Track 2', onClick: () => toast.info('Playing...') },
          { label: '♪ Play Track 3', onClick: () => toast.info('Playing...') }
        ]);
      } else if (lowerContent.includes('best') || lowerContent.includes('30 second')) {
        addMessage('assistant', 'Analyzing engagement data... The strongest 30 seconds are 1:14–1:44. Want me to extract that as a clip?', [
          { label: 'Yes, extract it', onClick: () => {
            toast.success('Created 30-second highlight clip');
            addMessage('assistant', 'Created! Your highlight clip is ready. Score: 92/100');
          }},
          { label: 'Show me that section', onClick: onShowBeforeAfter }
        ]);
      } else {
        addMessage('assistant', 'I understand. Let me work on that for you...');
      }
    }, 800);
  };

  const addMessage = (role: 'user' | 'assistant', content: string, actions?: { label: string; onClick: () => void }[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      actions
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div 
        className="px-3 sm:px-4 py-3 sm:py-4 border-b flex-shrink-0"
        style={{ borderColor: '#1e1e1e' }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 
            className="text-white font-semibold text-sm sm:text-base"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            AI Director
          </h2>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[#666] text-xs">Online</span>
          </div>
        </div>

        <AgentSelector 
          selected={selectedAgent}
          onSelect={setSelectedAgent}
        />
      </div>

      {/* Scrollable Content */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
        {/* Video Intelligence Card */}
        <VideoIntelligenceCard />

        {/* AI Insights */}
        <div className="space-y-2 sm:space-y-3">
          {insights.map((insight, index) => (
            <InsightCard key={index} {...insight} />
          ))}
        </div>

        {/* Chat Thread */}
        {messages.length > 0 && (
          <div className="pt-3 sm:pt-4">
            <ChatThread messages={messages} />
          </div>
        )}
      </div>

      {/* Fixed Bottom Section */}
      <div className="flex-shrink-0 border-t p-3 sm:p-4" style={{ borderColor: '#1e1e1e' }}>
        <ChatInput onSend={handleUserMessage} />
      </div>
    </div>
  );
}