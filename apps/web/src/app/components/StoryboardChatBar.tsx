import { Image, Video, Music, Square, Layers, Maximize2, Sparkles, ArrowRight, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ChatMessage {
  id: number;
  type: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface Scene {
  id: number;
  sceneNumber: number;
  duration: string;
  thumbnail?: string;
  title?: string;
}

interface StoryboardChatBarProps {
  onGenerate?: (prompt: string) => string;
  scenes?: Scene[];
}

export function StoryboardChatBar({ onGenerate, scenes = [] }: StoryboardChatBarProps) {
  const [models, setModels] = useState(['nano-banana']);
  const [input, setInput] = useState('');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showRatioDropdown, setShowRatioDropdown] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState('16:9');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSceneMentions, setShowSceneMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [mentionedScenes, setMentionedScenes] = useState<Scene[]>([]);
  const [modelButtonRef, setModelButtonRef] = useState<HTMLButtonElement | null>(null);

  const availableModels = [
    'nano-banana',
    'flux-pro',
    'stability-ai',
    'runway-gen3',
    'pika-labs',
    'luma-ai'
  ];

  const availableRatios = [
    { value: '16:9', label: '16:9 Landscape', description: 'YouTube, Web' },
    { value: '9:16', label: '9:16 Portrait', description: 'TikTok, Reels' },
    { value: '1:1', label: '1:1 Square', description: 'Instagram Feed' },
    { value: '4:3', label: '4:3 Standard', description: 'Classic Video' },
    { value: '21:9', label: '21:9 Ultrawide', description: 'Cinematic' }
  ];

  const handleRemoveModel = (modelToRemove: string) => {
    setModels(models.filter(m => m !== modelToRemove));
  };

  const handleAddModel = (model: string) => {
    if (!models.includes(model)) {
      setModels([...models, model]);
    }
    setShowModelDropdown(false);
  };

  const handleSubmit = () => {
    if (input.trim()) {
      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now(),
        type: 'user',
        text: input,
        timestamp: new Date()
      };
      
      // Get AI response
      const aiResponse = onGenerate?.(input) || 'Processing your request...';
      
      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: aiResponse,
        timestamp: new Date()
      };
      
      setMessages([...messages, userMessage, aiMessage]);
      setShowHistory(true);
      setInput('');
      setMentionedScenes([]);
      
      // Auto-hide history after 5 seconds
      setTimeout(() => setShowHistory(false), 5000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const position = e.target.selectionStart || 0;
    
    setInput(value);
    setCursorPosition(position);
    
    // Check if user typed @ to trigger scene mentions
    const lastChar = value[position - 1];
    if (lastChar === '@') {
      setShowSceneMentions(true);
      setMentionedScenes(scenes);
    } else {
      // Check if we're in a mention (after @)
      const textBeforeCursor = value.slice(0, position);
      const lastAtIndex = textBeforeCursor.lastIndexOf('@');
      
      if (lastAtIndex !== -1 && textBeforeCursor.slice(lastAtIndex).indexOf(' ') === -1) {
        const searchTerm = textBeforeCursor.slice(lastAtIndex + 1);
        const filtered = scenes.filter(scene => 
          `Scene ${scene.sceneNumber}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (scene.title && scene.title.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setMentionedScenes(filtered);
        setShowSceneMentions(true);
      } else {
        setShowSceneMentions(false);
      }
    }
  };

  const handleSceneMentionSelect = (scene: Scene) => {
    const textBeforeCursor = input.slice(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const beforeMention = input.slice(0, lastAtIndex);
      const afterCursor = input.slice(cursorPosition);
      const mention = `@Scene${scene.sceneNumber}`;
      
      setInput(beforeMention + mention + ' ' + afterCursor);
      setCursorPosition(beforeMention.length + mention.length + 1);
    }
    
    setShowSceneMentions(false);
    toast.success(`Referenced Scene ${scene.sceneNumber}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleMentionSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMentionSearch(value);
    const filteredScenes = scenes.filter(scene => scene.title?.toLowerCase().includes(value.toLowerCase()));
    setMentionedScenes(filteredScenes);
  };

  const handleMentionClick = (scene: Scene) => {
    const currentInput = input;
    const mention = `@scene${scene.sceneNumber}`;
    const newInput = currentInput.slice(0, cursorPosition) + mention + currentInput.slice(cursorPosition);
    setInput(newInput);
    setCursorPosition(cursorPosition + mention.length);
    setShowSceneMentions(false);
  };

  return (
    <div className="relative">
      {/* Chat History - appears above the input bar */}
      {showHistory && messages.length > 0 && (
        <div 
          className="w-full max-w-3xl mx-auto mb-2 rounded-xl p-3 max-h-60 overflow-y-auto"
          style={{
            backgroundColor: '#0A0A0A',
            border: '1px solid #1E1E1E'
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#666] text-xs font-medium">Chat History</span>
            <button 
              onClick={() => setShowHistory(false)}
              className="text-[#666] hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
          <div className="space-y-2">
            {messages.slice(-6).map((msg) => (
              <div 
                key={msg.id}
                className={`text-xs ${msg.type === 'user' ? 'text-white' : 'text-[#0A84FF]'}`}
              >
                <span className="font-semibold">{msg.type === 'user' ? 'You' : 'AI'}:</span>{' '}
                <span className="text-[#AAA]">{msg.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Main Input Bar */}
      <div 
        className="w-full max-w-3xl mx-auto rounded-2xl p-4 mb-4"
        style={{
          backgroundColor: '#0E0E0E',
          border: '1px solid #1E1E1E',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
        }}
      >
        {/* Top Tags Row */}
        <div className="flex items-center gap-2 mb-3 overflow-x-auto overflow-y-visible pb-1 relative">
          {models.map((model) => (
            <div
              key={model}
              className="px-3 py-1.5 bg-white text-black text-xs rounded-full flex items-center gap-2 flex-shrink-0 font-medium"
            >
              <span>{model}</span>
              <button 
                onClick={() => handleRemoveModel(model)}
                className="hover:text-red-500 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <div className="relative z-50">
            <button 
              className="px-3 py-1.5 border text-xs rounded-full transition-colors flex items-center gap-1.5 flex-shrink-0 font-medium hover:bg-[#1A1A1A]"
              style={{
                borderColor: '#2A2A2A',
                color: '#888'
              }}
              onClick={(e) => {
                e.stopPropagation();
                console.log('Add Models clicked, current state:', showModelDropdown);
                setShowModelDropdown(!showModelDropdown);
              }}
              ref={setModelButtonRef}
            >
              <span>Add Models</span>
              <span className="text-[10px]">⇅</span>
            </button>
            {showModelDropdown && modelButtonRef && (
              <>
                <div 
                  className="fixed inset-0 z-[999]" 
                  onClick={() => {
                    console.log('Backdrop clicked');
                    setShowModelDropdown(false);
                  }}
                />
                <div 
                  className="fixed bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-2xl z-[1000] min-w-[180px] max-w-[220px]"
                  style={{ 
                    boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
                    bottom: `${window.innerHeight - modelButtonRef.getBoundingClientRect().top + 8}px`,
                    left: `${modelButtonRef.getBoundingClientRect().left}px`
                  }}
                >
                  <div className="px-3 py-2 border-b border-[#2A2A2A]">
                    <span className="text-[#888] text-[10px] uppercase tracking-wide font-semibold">AI Models</span>
                  </div>
                  {availableModels.filter(m => !models.includes(m)).map(model => (
                    <button
                      key={model}
                      className="w-full px-3 py-2.5 text-white text-xs text-left hover:bg-[#2A2A2A] transition-colors last:rounded-b-lg flex items-center justify-between group"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Adding model:', model);
                        handleAddModel(model);
                      }}
                    >
                      <span>{model}</span>
                      <span className="text-[#0A84FF] opacity-0 group-hover:opacity-100 transition-opacity text-[10px]">+</span>
                    </button>
                  ))}
                  {availableModels.filter(m => !models.includes(m)).length === 0 && (
                    <div className="px-3 py-2.5 text-[#666] text-xs">
                      All models added
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="mb-3 relative">
          {/* Mentioned Scenes Pills - show above input */}
          {input.includes('@Scene') && (
            <div className="flex flex-wrap gap-2 mb-2">
              {input.match(/@Scene\d+/g)?.map((mention, idx) => {
                const sceneNum = parseInt(mention.replace('@Scene', ''));
                const scene = scenes.find(s => s.sceneNumber === sceneNum);
                return scene ? (
                  <div 
                    key={idx}
                    className="px-2 py-1 bg-[#0A84FF] text-white text-xs rounded flex items-center gap-1"
                  >
                    <span>Scene {scene.sceneNumber}</span>
                    <span className="text-[10px] opacity-70">{scene.duration}</span>
                  </div>
                ) : null;
              })}
            </div>
          )}
          
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type @ to mention a scene, or describe what you want to generate/edit"
            className="w-full bg-transparent text-white text-sm placeholder:text-[#555] placeholder:italic outline-none"
          />
          
          {/* Scene Mention Dropdown */}
          {showSceneMentions && mentionedScenes.length > 0 && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowSceneMentions(false)}
              />
              <div 
                className="absolute left-0 top-full mt-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-lg z-20 min-w-[200px] max-h-60 overflow-y-auto"
              >
                <div className="px-3 py-2 text-[#666] text-xs border-b border-[#2A2A2A]">
                  Select a scene to mention
                </div>
                {mentionedScenes.map(scene => (
                  <button
                    key={scene.id}
                    className="w-full px-3 py-2 text-white text-xs text-left hover:bg-[#2A2A2A] transition-colors flex items-center justify-between group"
                    onClick={() => handleSceneMentionSelect(scene)}
                  >
                    <div>
                      <div className="font-medium">Scene {scene.sceneNumber}</div>
                      {scene.title && (
                        <div className="text-[#888] text-[10px] mt-0.5">{scene.title}</div>
                      )}
                    </div>
                    <div className="text-[#666] group-hover:text-white text-[10px]">
                      {scene.duration}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Bottom Toolbar */}
        <div className="flex items-center justify-between">
          {/* Left Icon Group */}
          <div className="flex items-center gap-2">
            <button 
              className="p-1.5 text-[#666] hover:text-white transition-colors rounded hover:bg-[#1A1A1A]" 
              title="Generate image"
              onClick={() => {
                setInput(input ? `${input} [image]` : 'Generate an image');
                toast.success('Image mode activated');
              }}
            >
              <Image size={16} />
            </button>
            <button 
              className="p-1.5 text-[#666] hover:text-white transition-colors rounded hover:bg-[#1A1A1A]" 
              title="Generate video"
              onClick={() => {
                setInput(input ? `${input} [video]` : 'Generate a video');
                toast.success('Video mode activated');
              }}
            >
              <Video size={16} />
            </button>
            <button 
              className="p-1.5 text-[#666] hover:text-white transition-colors rounded hover:bg-[#1A1A1A] hidden sm:block" 
              title="Generate audio"
              onClick={() => {
                setInput(input ? `${input} [audio]` : 'Generate audio');
                toast.success('Audio mode activated');
              }}
            >
              <Music size={16} />
            </button>
            <div className="w-px h-4 bg-[#2A2A2A] hidden sm:block"></div>
            <div className="relative">
              <button 
                className="px-2 py-1 text-[#666] hover:text-white transition-colors flex items-center gap-1.5 text-xs rounded hover:bg-[#1A1A1A]"
                onClick={() => setShowRatioDropdown(!showRatioDropdown)}
              >
                <Square size={14} />
                <span className="hidden sm:inline">{selectedRatio}</span>
              </button>
              {showRatioDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowRatioDropdown(false)}
                  />
                  <div 
                    className="absolute bottom-full mb-2 left-0 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-lg z-20 min-w-[220px]"
                  >
                    <div className="px-3 py-2 border-b border-[#2A2A2A]">
                      <span className="text-[#888] text-[10px] uppercase tracking-wide font-semibold">Aspect Ratio</span>
                    </div>
                    {availableRatios.map(ratio => (
                      <button
                        key={ratio.value}
                        className={`w-full px-3 py-2.5 text-left hover:bg-[#2A2A2A] transition-colors last:rounded-b-lg flex items-center justify-between group ${
                          selectedRatio === ratio.value ? 'bg-[#0A84FF]/20' : ''
                        }`}
                        onClick={() => {
                          setSelectedRatio(ratio.value);
                          toast.success(`Aspect ratio: ${ratio.label}`);
                          setShowRatioDropdown(false);
                        }}
                      >
                        <div>
                          <div className={`text-xs font-medium ${
                            selectedRatio === ratio.value ? 'text-[#0A84FF]' : 'text-white'
                          }`}>
                            {ratio.label}
                          </div>
                          <div className="text-[10px] text-[#666] mt-0.5">{ratio.description}</div>
                        </div>
                        {selectedRatio === ratio.value && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#0A84FF]"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button 
              className="px-2 py-1 text-[#666] hover:text-white transition-colors items-center gap-1.5 text-xs rounded hover:bg-[#1A1A1A] hidden md:flex"
              onClick={() => {
                const currentLayers = 1;
                const newLayers = currentLayers + 1;
                toast.success(`Layers: ${newLayers > 5 ? 1 : newLayers}`);
              }}
            >
              <Layers size={14} />
              <span>1</span>
            </button>
          </div>

          {/* Right Icon Group */}
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-[#666] hover:text-white transition-colors rounded hover:bg-[#1A1A1A] hidden sm:block">
              <Maximize2 size={16} />
            </button>
            <button className="p-1.5 text-[#666] hover:text-white transition-colors rounded hover:bg-[#1A1A1A]">
              <Sparkles size={16} />
            </button>
            <button 
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-[#0A84FF] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                boxShadow: input.trim() ? '0 0 15px rgba(10,132,255,0.4)' : 'none'
              }}
            >
              <ArrowRight size={16} className="text-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}