import { Sparkles, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface GeneratorModalProps {
  onClose: () => void;
  onGenerate: (script: string, sceneCount: number, style: string, format: string) => void;
}

export function GeneratorModal({ onClose, onGenerate }: GeneratorModalProps) {
  const [script, setScript] = useState('');
  const [sceneCount, setSceneCount] = useState(6);
  const [style, setStyle] = useState('Cinematic');
  const [format, setFormat] = useState('16:9');

  const handleGenerate = () => {
    onGenerate(script, sceneCount, style, format);
    onClose();
    // Reset form
    setScript('');
    setSceneCount(6);
    setStyle('Cinematic');
    setFormat('16:9');
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-[600px] rounded-2xl overflow-hidden"
        style={{
          backgroundColor: '#161616',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#222222] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-[#0A84FF]" />
            <h2 className="text-white text-lg font-semibold">Generate Storyboard from Script</h2>
          </div>
          <button onClick={onClose} className="text-[#5A5A5A] hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Textarea */}
          <div className="mb-6">
            <label className="text-[#5A5A5A] text-sm mb-2 block">Script or Video Idea</label>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Paste your script or describe your video idea..."
              className="w-full bg-[#0D0D0D] text-white text-sm p-4 rounded-xl border border-[#2A2A2A] focus:border-[#0A84FF] focus:outline-none placeholder:text-[#4A4A4A] resize-none"
              rows={8}
            />
          </div>

          {/* Settings Row */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <label className="text-[#5A5A5A] text-xs mb-1 block">Scene Count</label>
              <input
                type="number"
                value={sceneCount}
                onChange={(e) => setSceneCount(parseInt(e.target.value) || 1)}
                min="1"
                max="20"
                className="w-full bg-[#0D0D0D] text-white text-sm px-3 py-2 rounded-lg border border-[#2A2A2A] focus:border-[#0A84FF] focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="text-[#5A5A5A] text-xs mb-1 block">Style</label>
              <div className="relative">
                <select 
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full bg-[#0D0D0D] text-white text-sm px-3 py-2 rounded-lg border border-[#2A2A2A] focus:border-[#0A84FF] focus:outline-none appearance-none"
                >
                  <option>Cinematic</option>
                  <option>Documentary</option>
                  <option>Vlog</option>
                  <option>Commercial</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5A5A] pointer-events-none" />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-[#5A5A5A] text-xs mb-1 block">Format</label>
              <div className="relative">
                <select 
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full bg-[#0D0D0D] text-white text-sm px-3 py-2 rounded-lg border border-[#2A2A2A] focus:border-[#0A84FF] focus:outline-none appearance-none"
                >
                  <option>16:9</option>
                  <option>9:16</option>
                  <option>1:1</option>
                  <option>4:3</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5A5A] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!script.trim()}
            className="w-full py-3 bg-[#0A84FF] text-white font-semibold rounded-xl hover:bg-[#0A84FF]/90 disabled:bg-[#2A2A2A] disabled:text-[#5A5A5A] disabled:cursor-not-allowed transition-colors"
          >
            Generate Scenes
          </button>
        </div>
      </div>
    </div>
  );
}