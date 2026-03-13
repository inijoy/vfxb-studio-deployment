import { useState, useRef, useEffect } from 'react';
import { Mic, Send, Upload, ChevronDown, Check, Loader2, Zap, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { ExportShareModal } from '../ExportShareModal';

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  insightCard?: {
    status: 'critical' | 'warning' | 'good';
    title: string;
    description: string;
    action?: string;
  };
}

export function AIChatTab() {
  const [selectedAgent, setSelectedAgent] = useState('VFXB Engine');
  const [isAgentDropdownOpen, setIsAgentDropdownOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [fixingStates, setFixingStates] = useState<{ [key: number]: boolean }>({});
  const [showShareModal, setShowShareModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const responseIndexRef = useRef(0);

  const agents = [
    {
      category: 'VFXB',
      items: [
        { name: 'VFXB Engine', description: 'Optimized for viral video analysis', color: '#0A84FF', icon: '✦' },
      ],
    },
    {
      category: 'Google',
      items: [
        { name: 'Gemini 2.0 Flash', description: '', color: '#4285F4', icon: '◆' },
        { name: 'Gemini 1.5 Pro', description: '', color: '#4285F4', icon: '◆' },
        { name: 'Gemini 1.5 Flash', description: '', color: '#4285F4', icon: '◆' },
      ],
    },
    {
      category: 'OpenAI',
      items: [
        { name: 'GPT-4o', description: '', color: '#10A37F', icon: '●' },
        { name: 'GPT-4 Turbo', description: '', color: '#10A37F', icon: '●' },
        { name: 'GPT-3.5 Turbo', description: '', color: '#10A37F', icon: '●' },
      ],
    },
    {
      category: 'Anthropic',
      items: [
        { name: 'Claude 3.5 Sonnet', description: '', color: '#D97757', icon: '◎' },
        { name: 'Claude 3 Opus', description: '', color: '#D97757', icon: '◎' },
        { name: 'Claude 3 Haiku', description: '', color: '#D97757', icon: '◎' },
      ],
    },
    {
      category: 'Audio / Music',
      items: [
        { name: 'Suno v4', description: 'Music Generation', color: '#9333EA', icon: '♪' },
        { name: 'Udio', description: 'Music Generation', color: '#9333EA', icon: '♪' },
        { name: 'ElevenLabs', description: 'Voice Synthesis', color: '#9333EA', icon: '♪' },
      ],
    },
    {
      category: 'Video',
      items: [
        { name: 'Runway Gen-3', description: 'Video Generation', color: '#EC4899', icon: '▶' },
        { name: 'Pika 2.0', description: 'Video Generation', color: '#EC4899', icon: '▶' },
        { name: 'Kling AI', description: 'Video Generation', color: '#EC4899', icon: '▶' },
      ],
    },
  ];

  const vfxbResponses = [
    {
      insightCard: {
        status: 'critical' as const,
        title: 'Hook Strength',
        description: 'Your first 3 seconds show static framing. Viewers drop off 73% faster without motion in the opening frame.',
        action: 'One-Click Fix',
      },
    },
    {
      insightCard: {
        status: 'warning' as const,
        title: 'Pacing',
        description: 'Average cut every 8.2 seconds. Top-performing videos in your niche cut every 2.4 seconds.',
        action: 'One-Click Fix',
      },
    },
    {
      insightCard: {
        status: 'good' as const,
        title: 'Audio Sync',
        description: 'Music BPM matches your edit rhythm well. This improves retention by ~18%.',
        action: 'Looks Good',
      },
    },
    {
      content: 'Based on 100M+ video analysis, your thumbnail has strong contrast but lacks a human face. Videos with faces in thumbnails get 34% more clicks.',
    },
  ];

  const agentResponses: { [key: string]: string } = {
    'Gemini 2.0 Flash': "I've analyzed your video structure. The narrative arc peaks too early at 0:45. Consider moving your strongest moment to the 60% mark for maximum impact.",
    'GPT-4o': "Your caption timing is off by ~0.3s on 3 clips. I can auto-sync them. Also detected background noise at 1:23 — want me to remove it?",
    'Claude 3.5 Sonnet': "The color grading shifts noticeably at 2:14 — likely a different recording session. A LUT correction would unify the look.",
    'Suno v4': "Generated 3 music options for your video mood:\n🎵 Track A — Cinematic Build · 3:24\n🎵 Track B — Energetic Pop · 2:58\n🎵 Track C — Emotional Ambient · 4:01",
    'Runway Gen-3': "Ready to generate a video clip. Describe the scene you want, I'll create a 4-second preview.",
  };

  const quickActions = [
    { label: 'Analyze Video', message: 'Analyze my video for viral potential' },
    { label: 'Fix Pacing', message: 'Fix the pacing of my video' },
    { label: 'Add Music', message: 'Suggest music', agent: 'Suno v4' },
    { label: 'Boost Hook', message: 'How do I improve my hook?' },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleQuickAction = (action: typeof quickActions[0]) => {
    if (action.agent) {
      setSelectedAgent(action.agent);
    }
    handleSendMessage(action.message);
    setShowQuickActions(false);
  };

  const handleSendMessage = (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let assistantMessage: Message;

      if (selectedAgent === 'VFXB Engine') {
        const response = vfxbResponses[responseIndexRef.current % vfxbResponses.length];
        responseIndexRef.current++;
        assistantMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: response.content || '',
          insightCard: response.insightCard,
        };
      } else {
        const responseText = agentResponses[selectedAgent] || agentResponses['GPT-4o'];
        assistantMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: responseText,
        };
      }

      setMessages((prev) => [...prev, assistantMessage]);
    }, 800);
  };

  const handleFix = (messageId: number) => {
    setFixingStates((prev) => ({ ...prev, [messageId]: true }));
    setTimeout(() => {
      setFixingStates((prev) => ({ ...prev, [messageId]: false }));
      toast.success('Fix applied to timeline');
    }, 1500);
  };

  const selectedAgentInfo = agents
    .flatMap((cat) => cat.items)
    .find((agent) => agent.name === selectedAgent);

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Agent Selector with Export Button */}
      <div className="px-4 pb-3 border-b border-[#3A3A3A]">
        <div className="flex gap-2 mb-2">
          <div className="relative flex-1">
            <button
              onClick={() => setIsAgentDropdownOpen(!isAgentDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 bg-[#1E1E1E] rounded-lg border border-[#3A3A3A] hover:border-[#8A8A8A] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span style={{ color: selectedAgentInfo?.color }}>{selectedAgentInfo?.icon}</span>
                <span className="text-white text-xs">{selectedAgent}</span>
              </div>
              <ChevronDown size={14} className="text-[#8A8A8A]" />
            </button>

            {/* Dropdown Menu */}
            {isAgentDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#1E1E1E] border border-[#3A3A3A] rounded-lg shadow-xl max-h-80 overflow-y-auto z-50">
                {agents.map((category) => (
                  <div key={category.category}>
                    <div className="px-3 py-2 text-[#5A5A5A] text-[10px] font-semibold border-b border-[#2A2A2A]">
                      ── {category.category} ──
                    </div>
                    {category.items.map((agent) => (
                      <button
                        key={agent.name}
                        onClick={() => {
                          setSelectedAgent(agent.name);
                          setIsAgentDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#252525] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span style={{ color: agent.color }}>{agent.icon}</span>
                          <div className="text-left">
                            <p className="text-white text-xs">{agent.name}</p>
                            {agent.description && (
                              <p className="text-[#5A5A5A] text-[10px]">{agent.description}</p>
                            )}
                          </div>
                        </div>
                        {selectedAgent === agent.name && (
                          <Check size={14} style={{ color: agent.color }} />
                        )}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Export Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="px-3 py-2 bg-[#0A84FF] hover:bg-[#0A84FF]/90 text-white rounded-lg border border-[#0A84FF] transition-colors flex items-center gap-2"
            title="Export & Share"
          >
            <Share2 size={14} />
            <span className="text-xs hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0A84FF] to-[#00C2FF] flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(10,132,255,0.4)]">
              <div className="w-10 h-10 border-2 border-white" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
            </div>
            <p className="text-[#8A8A8A] text-sm">Ask VFXB anything about your video</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={message.type === 'user' ? 'flex justify-end' : ''}>
            {message.type === 'user' ? (
              <div className="max-w-[80%] bg-[#0A84FF] text-white rounded-lg px-3 py-2 text-xs">
                {message.content}
              </div>
            ) : message.insightCard ? (
              <div className="bg-[#1E1E1E] rounded-lg p-3 border border-[#3A3A3A]">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${
                    message.insightCard.status === 'critical' ? 'bg-red-500' :
                    message.insightCard.status === 'warning' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}></span>
                  <span className="text-white text-xs font-semibold">{message.insightCard.title}</span>
                  <span className={`text-xs ${
                    message.insightCard.status === 'critical' ? 'text-red-500' :
                    message.insightCard.status === 'warning' ? 'text-yellow-500' :
                    'text-green-500'
                  }`}>· {message.insightCard.status === 'critical' ? 'Critical' : message.insightCard.status === 'warning' ? 'Needs Work' : 'Good'}</span>
                </div>
                <p className="text-[#8A8A8A] text-xs leading-relaxed mb-3">
                  {message.insightCard.description}
                </p>
                {message.insightCard.action && (
                  <button
                    onClick={() => handleFix(message.id)}
                    disabled={fixingStates[message.id]}
                    className={`w-full px-3 py-2 rounded-md text-xs transition-all flex items-center justify-center gap-1.5 ${
                      message.insightCard.status === 'good'
                        ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                        : fixingStates[message.id]
                        ? 'bg-[#3A3A3A] text-[#8A8A8A]'
                        : 'bg-[#0A84FF] text-white hover:bg-[#0A84FF]/90'
                    }`}
                  >
                    {fixingStates[message.id] ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Applying...</span>
                      </>
                    ) : message.insightCard.status === 'good' ? (
                      <>
                        <Check size={14} />
                        <span>{message.insightCard.action}</span>
                      </>
                    ) : (
                      <>
                        <Zap size={14} />
                        <span>{message.insightCard.action}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-[#1E1E1E] rounded-lg px-3 py-2 border border-[#3A3A3A]">
                <p className="text-[#E0E0E0] text-xs leading-relaxed whitespace-pre-line">{message.content}</p>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-[#8A8A8A] text-xs">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-[#8A8A8A] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-[#8A8A8A] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-[#8A8A8A] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span>{selectedAgent} is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions + Input */}
      <div className="px-4 pb-4 border-t border-[#3A3A3A] pt-3">
        {showQuickActions && (
          <div className="flex flex-wrap gap-2 mb-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => handleQuickAction(action)}
                className="px-2.5 py-1.5 bg-[#1E1E1E] text-[#8A8A8A] text-[11px] rounded-full border border-[#3A3A3A] hover:border-[#0A84FF] hover:text-white transition-colors"
              >
                {action.icon} {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="relative">
          <button className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A] hover:text-white transition-colors">
            <Mic size={16} />
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask VFXB anything..."
            className="w-full bg-[#1E1E1E] text-white text-xs pl-10 pr-10 py-2.5 rounded-lg border border-[#3A3A3A] focus:border-[#0A84FF] focus:outline-none placeholder:text-[#8A8A8A]"
          />
          <button
            onClick={() => handleSendMessage()}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-[#0A84FF] p-1 rounded hover:bg-[#0A84FF]/90 transition-colors"
          >
            <Send size={14} />
          </button>
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