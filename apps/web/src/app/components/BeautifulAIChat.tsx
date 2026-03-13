import { useState, useRef, useEffect } from 'react';
import { Minimize2, Settings, Play, Mic, Paperclip, Globe, ArrowUp, Sparkles, Zap, CheckCircle2, AlertCircle, Info, Share2 } from 'lucide-react';
import { AgentSelector } from './AgentSelector';
import { SettingsPanel } from './SettingsPanel';
import { ExportShareModal } from './ExportShareModal';
import { toast } from 'sonner';
import vfxbLogo from "../../assets/87baff59339294d92e591456a1fc7b6ab9585915.png";

interface BeautifulAIChatProps {
  mode: 'long-form' | 'short-form' | 'agency';
  onShowTools: () => void;
  onShowBeforeAfter: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  actions?: { label: string; icon?: any; onClick: () => void; variant?: 'primary' | 'secondary' | 'success' }[];
  type?: 'insight' | 'success' | 'warning';
}

const EXAMPLE_PROMPTS = [
  "Cut everything after the 2 minute mark...",
  "Add captions with yellow background...",
  "Remove all silent parts...",
  "Make this hook more engaging...",
  "Create a 60-second TikTok version...",
  "Find the best 30 seconds for Reels..."
];

export function BeautifulAIChat({ mode, onShowTools, onShowBeforeAfter }: BeautifulAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'system',
      content: 'I analyzed your video. Found 3 areas to improve your virality score.',
      timestamp: new Date(),
      type: 'insight'
    }
  ]);
  const [selectedAgent, setSelectedAgent] = useState('VFXB Engine');
  const [inputValue, setInputValue] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showViralityScore, setShowViralityScore] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    const userInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      setIsTyping(false);
      const lower = userInput.toLowerCase();
      
      if (lower.includes('timeline') || lower.includes('show') || lower.includes('studio')) {
        onShowTools();
        addMessage('assistant', 'Opening the timeline for you. You can now see all your clips and make precise edits.', undefined, 'success');
      } else if (lower.includes('tiktok') || lower.includes('60') || lower.includes('short')) {
        addMessage('assistant', 'Perfect! I created a 60-second vertical cut optimized for TikTok. Added auto-captions and adjusted pacing for maximum engagement.', [
          { label: 'Preview', icon: Play, onClick: onShowBeforeAfter, variant: 'primary' },
          { label: 'Export', icon: Zap, onClick: () => toast.success('Exporting TikTok version...'), variant: 'secondary' }
        ], 'success');
      } else if (lower.includes('caption')) {
        addMessage('assistant', 'Captions generated successfully! Added 47 lines with auto-timing. Would you like to customize the style?', [
          { label: 'Change Style', onClick: () => toast.info('Style editor opened'), variant: 'secondary' },
          { label: 'Preview', icon: Play, onClick: onShowBeforeAfter, variant: 'primary' }
        ], 'success');
      } else if (lower.includes('silence') || lower.includes('remove')) {
        addMessage('assistant', 'Found 12 silence gaps (47 seconds total). Should I remove them all?', [
          { label: 'Yes, Remove All', icon: Zap, onClick: () => {
            toast.success('Removed 12 silence gaps');
            setTimeout(() => {
              addMessage('assistant', 'Done! Your video is now 47 seconds tighter. Retention should improve significantly.', undefined, 'success');
            }, 1000);
          }, variant: 'primary' },
          { label: 'Show Me First', icon: Play, onClick: onShowBeforeAfter, variant: 'secondary' }
        ]);
      } else if (lower.includes('hook') || lower.includes('engaging')) {
        addMessage('assistant', 'I analyzed your hook. I can add a zoom effect and trim 3 seconds to make it punchier. Want to see the result?', [
          { label: 'Apply Changes', icon: Zap, onClick: () => {
            onShowBeforeAfter();
            setTimeout(() => {
              addMessage('assistant', 'Hook updated! Added dynamic zoom and tightened timing. Your first 3 seconds are now 2.4x more engaging.', undefined, 'success');
            }, 1000);
          }, variant: 'primary' },
          { label: 'Tell Me More', icon: Info, onClick: () => {
            addMessage('assistant', 'Your current hook is static for 4 seconds. Data shows 71% of viewers leave within 3 seconds if there\'s no motion. Adding a zoom effect and cutting to 1 second will dramatically improve retention.');
          }, variant: 'secondary' }
        ]);
      } else {
        addMessage('assistant', 'Got it! Let me analyze that for you... This will take just a moment.', [
          { label: 'Preview Changes', icon: Play, onClick: onShowBeforeAfter, variant: 'primary' }
        ]);
      }
    }, 800 + Math.random() * 400);
  };

  const addMessage = (role: 'user' | 'assistant' | 'system', content: string, actions?: any[], type?: 'insight' | 'success' | 'warning') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      actions,
      type
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const quickChips = [
    { label: 'Fix All Issues', icon: Zap, onClick: () => setInputValue('Fix all the issues you found') },
    { label: 'TikTok Cut', icon: Sparkles, onClick: () => setInputValue('Make a 60s TikTok cut') },
    { label: 'Add Captions', onClick: () => setInputValue('Add captions') },
    { label: 'Remove Silences', onClick: () => setInputValue('Remove all silent parts') },
    { label: 'Boost Hook', onClick: () => setInputValue('Make the hook more engaging') }
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Settings Panel Modal */}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}

      {/* ELEGANT HEADER */}
      <div 
        className="h-16 px-5 flex items-center justify-between border-b flex-shrink-0"
        style={{ 
          borderColor: '#1A1A1A',
          background: 'linear-gradient(180deg, #0A0A0A 0%, #0C0C0C 100%)'
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #0A84FF 0%, #00D4FF 100%)',
              boxShadow: '0 0 20px rgba(10,132,255,0.3)'
            }}
          >
            <img 
              src={vfxbLogo} 
              alt="VFXB" 
              className="w-5 h-5"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
          <div>
            <AgentSelector 
              selected={selectedAgent}
              onSelect={setSelectedAgent}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-2 h-2 rounded-full bg-[#30D158] animate-pulse"></div>
            <span className="text-[#666] text-xs">Online</span>
          </div>
          <button 
            onClick={() => setShowShareModal(true)}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#141414] rounded-lg transition-colors"
            title="Export & Share"
          >
            <Share2 size={15} className="text-[#666] hover:text-[#0A84FF] transition-colors" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center hover:bg-[#141414] rounded-lg transition-colors">
            <Minimize2 size={15} className="text-[#666] hover:text-white transition-colors" />
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#141414] rounded-lg transition-colors"
          >
            <Settings size={15} className="text-[#666] hover:text-white transition-colors" />
          </button>
        </div>
      </div>

      {/* COMPACT VIDEO INFO CARD */}
      <div className="px-4 pt-4 pb-3 border-b flex-shrink-0" style={{ borderColor: '#1A1A1A' }}>
        <div 
          className="rounded-xl border p-3"
          style={{
            background: 'linear-gradient(135deg, #0E0E0E 0%, #121212 100%)',
            borderColor: '#1E1E1E',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
          }}
        >
          {/* Compact Video Info */}
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-12 h-7 rounded-lg flex-shrink-0 flex items-center justify-center"
              style={{ 
                background: 'linear-gradient(135deg, #1A1A1A 0%, #222 100%)',
                border: '1px solid #2A2A2A'
              }}
            >
              <Play size={12} className="text-[#666]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-semibold">my-video.mp4</div>
              <div 
                className="text-[#666] text-[10px]"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                03:24 · 1080p · 30fps
              </div>
            </div>
          </div>

          {/* Compact Virality Score - Only shown when user requests */}
          {showViralityScore && (
            <div 
              className="p-3 rounded-lg border-t animate-fadeIn"
              style={{
                borderColor: '#1A1A1A',
                background: 'linear-gradient(180deg, rgba(10,132,255,0.03) 0%, rgba(10,132,255,0.01) 100%)'
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-[#888] text-[9px] font-medium mb-0.5 uppercase tracking-wide">Virality Score</div>
                  <div className="flex items-baseline gap-1">
                    <span 
                      className="text-2xl font-bold leading-none"
                      style={{ 
                        fontFamily: 'Syne, sans-serif',
                        background: 'linear-gradient(135deg, #30D158 0%, #00D4FF 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      84
                    </span>
                    <span className="text-[#555] text-sm">/100</span>
                  </div>
                </div>
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(48,209,88,0.15) 0%, rgba(0,212,255,0.15) 100%)',
                    border: '1px solid rgba(48,209,88,0.3)'
                  }}
                >
                  <Sparkles size={20} className="text-[#30D158]" />
                </div>
              </div>

              {/* Compact Score Bar */}
              <div 
                className="h-1.5 rounded-full overflow-hidden mb-1.5"
                style={{ backgroundColor: '#1A1A1A' }}
              >
                <div 
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: '84%',
                    background: 'linear-gradient(90deg, #30D158 0%, #00D4FF 100%)',
                    boxShadow: '0 0 8px rgba(48,209,88,0.5)'
                  }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#666]">Top 12% in your niche</span>
                <span className="text-[#30D158] font-medium">Excellent</span>
              </div>
            </div>
          )}

          {/* Suggest Analysis Button */}
          {!showViralityScore && (
            <button 
              onClick={() => setShowViralityScore(true)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg transition-all hover:bg-[#141414]"
              style={{
                border: '1px dashed #2A2A2A'
              }}
            >
              <Sparkles size={12} className="text-[#666]" />
              <span className="text-[#666] text-xs">Analyze Virality Score</span>
            </button>
          )}
        </div>
      </div>

      {/* CHAT MESSAGES - Beautiful Scrollable Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        style={{
          background: 'linear-gradient(180deg, #0A0A0A 0%, #080808 100%)'
        }}
      >
        {/* Initial Insights */}
        <div className="space-y-2">
          <div className="text-[#666] text-xs font-medium mb-3 flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#0A84FF]"></div>
            AI INSIGHTS
          </div>

          {/* Quick Insight Cards */}
          <div className="space-y-2">
            {[
              { label: 'Hook Issue', severity: 'Critical', color: '#FF453A', bg: 'rgba(255,69,58,0.1)' },
              { label: 'Pacing Warning', severity: 'Warning', color: '#FFD60A', bg: 'rgba(255,214,10,0.1)' },
              { label: 'Audio Sync Good', severity: 'Good', color: '#30D158', bg: 'rgba(48,209,88,0.1)' }
            ].map((insight, idx) => (
              <button
                key={idx}
                className="w-full p-3 rounded-xl border transition-all hover:scale-[1.02] text-left group"
                style={{
                  backgroundColor: insight.bg,
                  borderColor: insight.color + '40'
                }}
                onClick={() => {
                  if (idx === 0) {
                    setInputValue('Tell me about the hook issue');
                  } else if (idx === 1) {
                    setInputValue('Fix the pacing warning');
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: insight.color }}
                    ></div>
                    <span className="text-white text-sm font-medium">{insight.label}</span>
                  </div>
                  <span 
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ 
                      backgroundColor: insight.color + '20',
                      color: insight.color
                    }}
                  >
                    {insight.severity}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        {messages.map((message, idx) => (
          <div 
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            {message.role === 'assistant' || message.role === 'system' ? (
              <div className="max-w-[85%]">
                {/* Assistant Message */}
                <div 
                  className="rounded-2xl p-4 backdrop-blur-sm"
                  style={{
                    background: message.type === 'success' 
                      ? 'linear-gradient(135deg, rgba(48,209,88,0.15) 0%, rgba(48,209,88,0.05) 100%)'
                      : message.type === 'warning'
                      ? 'linear-gradient(135deg, rgba(255,214,10,0.15) 0%, rgba(255,214,10,0.05) 100%)'
                      : 'linear-gradient(135deg, #111 0%, #0E0E0E 100%)',
                    border: '1px solid',
                    borderColor: message.type === 'success' ? 'rgba(48,209,88,0.3)' : 'rgba(255,255,255,0.05)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                  }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    {message.type === 'success' && <CheckCircle2 size={16} className="text-[#30D158] mt-0.5 flex-shrink-0" />}
                    {message.type === 'warning' && <AlertCircle size={16} className="text-[#FFD60A] mt-0.5 flex-shrink-0" />}
                    {!message.type && (
                      <div 
                        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, #0A84FF 0%, #00D4FF 100%)'
                        }}
                      >
                        <Sparkles size={12} className="text-white" />
                      </div>
                    )}
                    <p className="text-[#E0E0E0] text-sm leading-relaxed flex-1">
                      {message.content}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  {message.actions && message.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {message.actions.map((action, actionIdx) => (
                        <button
                          key={actionIdx}
                          onClick={action.onClick}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105"
                          style={
                            action.variant === 'primary'
                              ? {
                                  background: 'linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)',
                                  color: 'white',
                                  boxShadow: '0 2px 8px rgba(10,132,255,0.3)'
                                }
                              : action.variant === 'success'
                              ? {
                                  background: 'rgba(48,209,88,0.2)',
                                  color: '#30D158',
                                  border: '1px solid rgba(48,209,88,0.3)'
                                }
                              : {
                                  backgroundColor: 'rgba(255,255,255,0.05)',
                                  color: '#999',
                                  border: '1px solid rgba(255,255,255,0.1)'
                                }
                          }
                        >
                          {action.icon && <action.icon size={12} />}
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Timestamp */}
                  {message.timestamp && (
                    <div className="text-[#555] text-xs mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div 
                className="max-w-[80%] rounded-2xl px-4 py-3"
                style={{
                  background: 'linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)',
                  boxShadow: '0 4px 12px rgba(10,132,255,0.4)'
                }}
              >
                <p className="text-white text-sm leading-relaxed">{message.content}</p>
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fadeIn">
            <div 
              className="rounded-2xl px-5 py-3 flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #111 0%, #0E0E0E 100%)',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-[#666] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-[#666] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-[#666] animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-[#888] text-xs">AI is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* BEAUTIFUL BOTTOM SECTION */}
      <div className="flex-shrink-0 border-t" style={{ borderColor: '#1A1A1A' }}>
        {/* Input Area */}
        <div className="p-4" style={{ backgroundColor: '#0A0A0A' }}>
          {/* Quick Chips - Elegant Pills */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={chip.onClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border whitespace-nowrap transition-all hover:scale-105 flex-shrink-0 group"
                style={{
                  background: 'linear-gradient(135deg, #141414 0%, #0E0E0E 100%)',
                  borderColor: '#2A2A2A'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0A84FF';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(10,132,255,0.15) 0%, rgba(10,132,255,0.05) 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#2A2A2A';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #141414 0%, #0E0E0E 100%)';
                }}
              >
                {chip.icon && <chip.icon size={12} className="text-[#888] group-hover:text-[#0A84FF] transition-colors" />}
                <span className="text-xs text-[#888] group-hover:text-white transition-colors">{chip.label}</span>
              </button>
            ))}
          </div>

          {/* Beautiful Input Container */}
          <div 
            className="rounded-2xl border p-4"
            style={{
              background: 'linear-gradient(135deg, #111 0%, #0E0E0E 100%)',
              borderColor: '#2A2A2A',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={EXAMPLE_PROMPTS[placeholderIndex]}
              className="w-full bg-transparent text-white text-sm outline-none placeholder:text-[#444] placeholder:italic mb-3 transition-all"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button className="w-9 h-9 flex items-center justify-center hover:bg-[#1A1A1A] rounded-lg transition-all group">
                  <Mic size={16} className="text-[#555] group-hover:text-[#0A84FF] transition-colors" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center hover:bg-[#1A1A1A] rounded-lg transition-all group">
                  <Paperclip size={16} className="text-[#555] group-hover:text-[#0A84FF] transition-colors" />
                </button>
                <button className="w-9 h-9 flex items-center justify-center hover:bg-[#1A1A1A] rounded-lg transition-all group">
                  <Globe size={16} className="text-[#555] group-hover:text-[#0A84FF] transition-colors" />
                </button>
              </div>

              <button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
                style={{
                  background: inputValue.trim() 
                    ? 'linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)'
                    : '#1A1A1A',
                  boxShadow: inputValue.trim() ? '0 4px 16px rgba(10,132,255,0.5)' : 'none'
                }}
              >
                <ArrowUp size={18} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export & Share Modal */}
      <ExportShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        videoDetails={{
          resolution: '1080p',
          format: 'MP4',
          quality: 'High',
          estimatedSize: '156 MB',
        }}
      />
    </div>
  );
}