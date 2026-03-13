import { ChevronDown, Sparkles, Mic, Music, Video } from 'lucide-react';
import { useState } from 'react';

interface AgentSelectorProps {
  selected: string;
  onSelect: (agent: string) => void;
}

export function AgentSelector({ selected, onSelect }: AgentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const agents = [
    { 
      category: 'VFXB',
      items: [
        { name: 'VFXB Engine', icon: Sparkles, description: 'Best for virality analysis + longform NLP editing', default: true }
      ]
    },
    {
      category: 'Language Models',
      items: [
        { name: 'GPT-4o', icon: Sparkles, description: 'OpenAI' },
        { name: 'Gemini 2.0 Flash', icon: Sparkles, description: 'Google' },
        { name: 'Claude 3.5 Sonnet', icon: Sparkles, description: 'Anthropic' }
      ]
    },
    {
      category: 'Music Generation',
      items: [
        { name: 'Suno v4', icon: Music, description: 'AI Music' },
        { name: 'Udio', icon: Music, description: 'AI Music' },
        { name: 'ElevenLabs', icon: Mic, description: 'Voice' }
      ]
    },
    {
      category: 'Video Generation',
      items: [
        { name: 'Kling AI', icon: Video, description: 'Video' },
        { name: 'Runway Gen-3', icon: Video, description: 'Video' },
        { name: 'Pika 2.0', icon: Video, description: 'Video' }
      ]
    }
  ];

  return (
    <div className="mb-3 relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 rounded-lg border flex items-center justify-between text-sm transition-colors hover:border-[#0A84FF]/50"
        style={{
          backgroundColor: '#1a1a1a',
          borderColor: isOpen ? '#0A84FF' : '#2a2a2a',
          color: '#fff'
        }}
      >
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-[#0A84FF]" />
          <span>{selected}</span>
        </div>
        <ChevronDown size={14} className={`text-[#666] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[100]" 
            onClick={() => setIsOpen(false)}
          />
          <div 
            className="absolute top-full left-0 right-0 mt-2 rounded-xl border overflow-hidden z-[101] max-h-[400px] overflow-y-auto shadow-2xl"
            style={{
              backgroundColor: '#1a1a1a',
              borderColor: '#2a2a2a',
              boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
            }}
          >
            {agents.map((category, catIndex) => (
              <div key={catIndex}>
                <div className="px-3 py-2 text-[#666] text-xs font-medium border-b" style={{ borderColor: '#2a2a2a' }}>
                  {category.category}
                </div>
                {category.items.map((agent, itemIndex) => {
                  const Icon = agent.icon;
                  return (
                    <button
                      key={itemIndex}
                      onClick={() => {
                        onSelect(agent.name);
                        setIsOpen(false);
                      }}
                      className="w-full px-3 py-2.5 flex items-start gap-2 hover:bg-[#222] transition-colors text-left"
                    >
                      <Icon size={14} className="text-[#0A84FF] mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm flex items-center gap-2">
                          {agent.name}
                          {agent.default && (
                            <span className="text-[#0A84FF] text-[10px] font-medium">DEFAULT</span>
                          )}
                          {selected === agent.name && (
                            <span className="text-[#0A84FF]">✓</span>
                          )}
                        </div>
                        <div className="text-[#666] text-xs">{agent.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}