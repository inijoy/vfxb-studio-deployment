import { Mic, Send } from 'lucide-react';
import { useState } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      onSend(inputValue);
      setInputValue('');
    }
  };

  const quickActions = [
    { label: 'Cut', icon: '✂️', prompt: 'Cut everything after the 2 minute mark' },
    { label: 'TikTok', icon: '🎬', prompt: 'Make a 60-second TikTok version' },
    { label: 'Silence', icon: '🔇', prompt: 'Remove all silences automatically' },
    { label: 'Captions', icon: '💬', prompt: 'Add captions in my brand font' },
    { label: 'Trailer', icon: '🎞️', prompt: 'Find the best 30 seconds for a trailer' }
  ];

  return (
    <div>
      {/* Quick Actions */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => {
              setInputValue(action.prompt);
              setTimeout(() => handleSend(), 100);
            }}
            className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs bg-[#1a1a1a] text-[#666] hover:text-white hover:bg-[#2a2a2a] transition-all border border-[#2a2a2a] flex items-center gap-1 sm:gap-1.5"
          >
            <span>{action.icon}</span>
            <span className="hidden sm:inline">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="relative">
        <button className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white transition-colors">
          <Mic size={14} className="sm:w-4 sm:h-4" />
        </button>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask VFXB anything..."
          className="w-full bg-[#1a1a1a] text-white text-xs sm:text-sm pl-8 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-2.5 rounded-lg border border-[#2a2a2a] focus:border-[#0A84FF] focus:outline-none placeholder:text-[#666]"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        />
        <button 
          onClick={handleSend}
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-[#0A84FF] hover:text-[#0A84FF]/80 transition-colors"
        >
          <Send size={14} className="sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
}