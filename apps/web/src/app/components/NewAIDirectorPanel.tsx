import { useState, useRef, useEffect } from 'react';
import { Minimize2, Settings, Play, Mic, Paperclip, Globe, ArrowUp } from 'lucide-react';
import { AgentSelector } from './AgentSelector';
import { toast } from 'sonner';

interface NewAIDirectorPanelProps {
  mode: 'long-form' | 'short-form' | 'agency';
  onShowTools: () => void;
  onShowBeforeAfter: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: { label: string; onClick: () => void }[][];
}

const EXAMPLE_PROMPTS = [
  "Cut everything after the 2 minute mark...",
  "Add captions with yellow background...",
  "Remove all silent parts...",
  "Make this hook more engaging...",
  "Create a 60-second TikTok version...",
  "Find the best 30 seconds for Reels..."
];

export function NewAIDirectorPanel({ mode, onShowTools, onShowBeforeAfter }: NewAIDirectorPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedAgent, setSelectedAgent] = useState('VFXB Engine');
  const [inputValue, setInputValue] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Rotate placeholder prompts
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % EXAMPLE_PROMPTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    addMessage('user', inputValue);
    setInputValue('');

    // Simulate AI responses
    setTimeout(() => {
      const lower = inputValue.toLowerCase();
      
      if (lower.includes('timeline') || lower.includes('show') || lower.includes('studio')) {
        onShowTools();
        addMessage('assistant', 'Opening the timeline for you.');
      } else if (lower.includes('tiktok') || lower.includes('60')) {
        addMessage('assistant', 'Creating 60s cut for TikTok... Done! Your video is now optimized for vertical format with auto-captions.', [
          [
            { label: '▶ Preview', onClick: onShowBeforeAfter },
            { label: 'Export', onClick: () => toast.success('Exporting TikTok version...') }
          ]
        ]);
      } else if (lower.includes('caption')) {
        addMessage('assistant', 'Generating captions... Done! 47 lines added. Want to change the font?', [
          [
            { label: 'Change font', onClick: () => toast.info('Font selector opened') },
            { label: 'Preview', onClick: onShowBeforeAfter }
          ]
        ]);
      } else if (lower.includes('silence')) {
        addMessage('assistant', 'Found 12 silence gaps totaling 47 seconds. Remove all?', [
          [
            { label: 'Yes, remove all', onClick: () => {
              toast.success('Removed 12 silence gaps');
              addMessage('assistant', 'Done! Your video is now 47 seconds shorter and much tighter.');
            }},
            { label: 'Show me first', onClick: onShowBeforeAfter }
          ]
        ]);
      } else {
        addMessage('assistant', 'I understand. Let me work on that for you...');
      }
    }, 800);
  };

  const addMessage = (role: 'user' | 'assistant', content: string, actions?: { label: string; onClick: () => void }[][]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      actions
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleFixHook = () => {
    onShowBeforeAfter();
    addMessage('assistant', 'I trimmed 4 seconds from your intro and added a zoom-in on frame 1. Want to see the before and after?', [
      [
        { label: '▶ Preview Change', onClick: onShowBeforeAfter },
        { label: '↩ Undo', onClick: () => toast.info('Changes reverted') }
      ]
    ]);
  };

  const handleFixPacing = () => {
    addMessage('assistant', 'I found 3 dead spots in your video. Fix all of them?', [
      [
        { label: 'Yes, fix all', onClick: () => {
          toast.success('Applied 3 cuts to improve pacing');
          addMessage('assistant', 'Done! I made 3 cuts in the slow segments. Your retention should improve by ~25%. Want to see the edits?', [
            [
              { label: '▶ Preview', onClick: onShowBeforeAfter },
              { label: 'Export now', onClick: () => toast.success('Exporting...') }
            ]
          ]);
        }},
        { label: 'Show me first', onClick: onShowBeforeAfter }
      ]
    ]);
  };

  const handleTellMore = (topic: string) => {
    if (topic === 'hook') {
      addMessage('assistant', 'Your hook needs immediate visual interest. Research shows viewers decide in 3 seconds whether to watch. I recommend starting with movement, a face, or bold text overlay.');
    } else {
      addMessage('assistant', 'Long static segments cause viewers to lose interest. I detected a 35-second segment with zero cuts. Adding cuts every 5-7 seconds significantly boosts retention.');
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const quickChips = [
    { label: 'Fix all issues', onClick: () => setInputValue('Fix all issues') },
    { label: 'Make TikTok cut', onClick: () => setInputValue('Make a 60s TikTok cut') },
    { label: 'Add captions', onClick: () => setInputValue('Add captions') },
    { label: 'Remove silences', onClick: () => setInputValue('Remove all silent parts') },
    { label: 'Boost hook', onClick: () => setInputValue('Make the hook more engaging') }
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* PANEL HEADER - 52px */}
      <div 
        className="h-[52px] px-4 flex items-center justify-between border-b flex-shrink-0"
        style={{ borderColor: '#1A1A1A' }}
      >
        <div 
          className="text-[#444] text-[11px] font-semibold uppercase tracking-widest"
          style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.1em' }}
        >
          AI DIRECTOR
        </div>
        <div className="flex items-center gap-2">
          <button className="w-7 h-7 flex items-center justify-center hover:bg-[#141414] rounded transition-colors">
            <Minimize2 size={14} className="text-[#444]" />
          </button>
          <button className="w-7 h-7 flex items-center justify-center hover:bg-[#141414] rounded transition-colors">
            <Settings size={14} className="text-[#444]" />
          </button>
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {/* VIDEO INTELLIGENCE CARD */}
        <div 
          className="rounded-xl border p-3.5"
          style={{
            backgroundColor: '#0E0E0E',
            borderColor: '#1E1E1E',
            boxShadow: '0 1px 3px rgba(0,0,0,0.4)'
          }}
        >
          {/* Row 1: Thumbnail + Info */}
          <div className="flex items-start gap-3 mb-3">
            <div 
              className="w-12 h-[27px] rounded flex-shrink-0"
              style={{ backgroundColor: '#1A1A1A' }}
            ></div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium mb-0.5">my-video.mp4</div>
              <div 
                className="text-[#444] text-[11px]"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                03:24  ·  1080p  ·  30fps
              </div>
            </div>
          </div>

          {/* Row 2: Virality Score */}
          <div className="mb-3">
            <div 
              className="text-[#444] text-[9px] font-semibold uppercase tracking-widest mb-2"
              style={{ letterSpacing: '0.1em' }}
            >
              VIRALITY SCORE
            </div>
            
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-[#30D158] text-4xl font-bold" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>
                84
              </span>
              <span className="text-[#444] text-xl">/100</span>
            </div>

            {/* Score Bar */}
            <div 
              className="h-1.5 rounded-full overflow-hidden mb-1.5"
              style={{ backgroundColor: '#1A1A1A' }}
            >
              <div 
                className="h-full rounded-full transition-all duration-1200"
                style={{
                  width: '84%',
                  background: 'linear-gradient(90deg, #30D158 0%, #00D4FF 100%)'
                }}
              ></div>
            </div>

            <div className="text-[#555] text-[11px]">
              Top 12% in your niche · Long-form
            </div>
          </div>

          {/* Row 3: Watch Analysis Button */}
          <button 
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-colors hover:bg-[#161616]"
            style={{
              backgroundColor: '#141414',
              borderColor: '#1E1E1E'
            }}
          >
            <Play size={12} className="text-white" />
            <span className="text-white text-[11px]">Watch Full Analysis</span>
          </button>
        </div>

        {/* AI BRIEFING CARDS */}
        <div 
          className="text-[#444] text-[9px] font-semibold uppercase tracking-widest px-0.5 pt-1"
          style={{ letterSpacing: '0.1em' }}
        >
          VFXB FOUND 3 ISSUES
        </div>

        {/* Card 1 - Critical */}
        <div 
          className="rounded-[10px] border overflow-hidden"
          style={{
            backgroundColor: 'rgba(255,69,58,0.06)',
            borderColor: 'rgba(255,69,58,0.2)'
          }}
        >
          <div className="flex">
            <div className="w-[3px] flex-shrink-0 rounded-l" style={{ backgroundColor: '#FF453A' }}></div>
            <div className="flex-1 p-2.5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-white text-[11px] font-semibold">
                  🔴 Hook  ·  0:00–0:03
                </div>
                <div 
                  className="px-2 py-0.5 rounded-full text-[9px]"
                  style={{
                    backgroundColor: 'rgba(255,69,58,0.15)',
                    color: '#FF453A'
                  }}
                >
                  Critical
                </div>
              </div>
              <div className="text-[#888] text-[10px] leading-relaxed mb-2">
                Static opening. No motion or face detected. 71% of viewers leave in the first 3 seconds.
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleFixHook}
                  className="px-3 py-1.5 rounded-md text-white text-[10px] font-semibold transition-colors"
                  style={{ backgroundColor: '#0A84FF' }}
                >
                  ⚡ Fix This Now
                </button>
                <button 
                  onClick={() => handleTellMore('hook')}
                  className="text-[#555] text-[10px] hover:text-white transition-colors"
                >
                  Tell me more
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 - Warning */}
        <div 
          className="rounded-[10px] border overflow-hidden"
          style={{
            backgroundColor: 'rgba(255,214,10,0.04)',
            borderColor: 'rgba(255,214,10,0.15)'
          }}
        >
          <div className="flex">
            <div className="w-[3px] flex-shrink-0 rounded-l" style={{ backgroundColor: '#FFD60A' }}></div>
            <div className="flex-1 p-2.5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-white text-[11px] font-semibold">
                  🟡 Pacing  ·  0:45–1:20
                </div>
                <div 
                  className="px-2 py-0.5 rounded-full text-[9px]"
                  style={{
                    backgroundColor: 'rgba(255,214,10,0.15)',
                    color: '#FFD60A'
                  }}
                >
                  Warning
                </div>
              </div>
              <div className="text-[#888] text-[10px] leading-relaxed mb-2">
                35-second segment with no cuts. Retention drops 40% in this window.
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleFixPacing}
                  className="px-3 py-1.5 rounded-md text-white text-[10px] font-semibold transition-colors"
                  style={{ backgroundColor: '#0A84FF' }}
                >
                  ⚡ Fix This Now
                </button>
                <button 
                  onClick={() => handleTellMore('pacing')}
                  className="text-[#555] text-[10px] hover:text-white transition-colors"
                >
                  Tell me more
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 - Good */}
        <div 
          className="rounded-[10px] border overflow-hidden"
          style={{
            backgroundColor: 'rgba(48,209,88,0.04)',
            borderColor: 'rgba(48,209,88,0.12)'
          }}
        >
          <div className="flex">
            <div className="w-[3px] flex-shrink-0 rounded-l" style={{ backgroundColor: '#30D158' }}></div>
            <div className="flex-1 p-2.5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-white text-[11px] font-semibold">
                  🟢 Audio Sync
                </div>
                <div 
                  className="px-2 py-0.5 rounded-full text-[9px]"
                  style={{
                    backgroundColor: 'rgba(48,209,88,0.15)',
                    color: '#30D158'
                  }}
                >
                  Good
                </div>
              </div>
              <div className="text-[#888] text-[10px] leading-relaxed mb-2">
                Music BPM matches edit rhythm. Retention boost: ~18%.
              </div>
              <button 
                className="px-3 py-1.5 rounded-md text-[10px] font-semibold transition-colors"
                style={{
                  backgroundColor: 'rgba(48,209,88,0.1)',
                  color: '#30D158'
                }}
              >
                ✓ Looking Good
              </button>
            </div>
          </div>
        </div>

        {/* CHAT THREAD */}
        {messages.map((message) => (
          <div key={message.id} className={message.role === 'user' ? 'flex justify-end' : ''}>
            {message.role === 'assistant' ? (
              <div 
                className="rounded-[10px] border p-3 max-w-[95%]"
                style={{
                  backgroundColor: '#111111',
                  borderColor: '#1A1A1A'
                }}
              >
                <div className="text-[#CCCCCC] text-[13px] leading-relaxed mb-2">
                  {message.content}
                </div>
                {message.actions && message.actions.map((actionRow, idx) => (
                  <div key={idx} className="flex gap-2 flex-wrap">
                    {actionRow.map((action, actionIdx) => (
                      <button
                        key={actionIdx}
                        onClick={action.onClick}
                        className="px-3 py-1.5 rounded-full border text-[10px] hover:border-[#0A84FF] hover:text-white transition-colors"
                        style={{
                          borderColor: '#1E1E1E',
                          color: '#666'
                        }}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div 
                className="rounded-[10px] p-2.5 max-w-[80%]"
                style={{ backgroundColor: '#0A84FF' }}
              >
                <div className="text-white text-[13px]">{message.content}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* BOTTOM SECTION - Pinned */}
      <div className="flex-shrink-0">
        {/* AGENT SELECTOR BAR - 32px */}
        <div 
          className="h-8 px-3 flex items-center justify-between border-t border-b"
          style={{ borderColor: '#1A1A1A' }}
        >
          <AgentSelector 
            selected={selectedAgent}
            onSelect={setSelectedAgent}
          />
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#30D158]"></div>
            <span className="text-[#555] text-[10px]">Online</span>
          </div>
        </div>

        {/* CHAT INPUT - Bottom */}
        <div className="p-3">
          {/* Quick Chips */}
          <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={chip.onClick}
                className="px-2.5 py-1 rounded-full border text-[10px] whitespace-nowrap hover:border-[#0A84FF] hover:text-white transition-colors flex-shrink-0"
                style={{
                  backgroundColor: '#111',
                  borderColor: '#1E1E1E',
                  color: '#666'
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Container */}
          <div 
            className="rounded-xl border p-3"
            style={{
              backgroundColor: '#0E0E0E',
              borderColor: '#1E1E1E'
            }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={EXAMPLE_PROMPTS[placeholderIndex]}
              className="w-full bg-transparent text-white text-[13px] outline-none placeholder:text-[#333] placeholder:italic mb-3"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="w-7 h-7 flex items-center justify-center hover:bg-[#141414] rounded transition-colors">
                  <Mic size={16} className="text-[#333]" />
                </button>
                <button className="w-7 h-7 flex items-center justify-center hover:bg-[#141414] rounded transition-colors">
                  <Paperclip size={16} className="text-[#333]" />
                </button>
                <button className="w-7 h-7 flex items-center justify-center hover:bg-[#141414] rounded transition-colors">
                  <Globe size={16} className="text-[#333]" />
                </button>
              </div>

              <button 
                onClick={handleSendMessage}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
                style={{
                  backgroundColor: '#0A84FF',
                  boxShadow: inputValue.trim() ? '0 0 12px rgba(10,132,255,0.4)' : 'none'
                }}
              >
                <ArrowUp size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
