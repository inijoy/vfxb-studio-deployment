import { X, Sparkles, Wand2, Palette, Eraser, Video, Volume2, Type, Languages, Captions, Mic, Music, Image as ImageIcon, Zap } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AIFeaturesPanelProps {
  trackType: 'video' | 'audio' | 'text';
  trackName: string;
  onClose: () => void;
}

export function AIFeaturesPanel({ trackType, trackName, onClose }: AIFeaturesPanelProps) {
  const [processing, setProcessing] = useState(false);

  const handleFeatureClick = (featureName: string) => {
    setProcessing(true);
    toast.loading(`Processing ${featureName}...`);
    
    setTimeout(() => {
      setProcessing(false);
      toast.success(`${featureName} applied successfully!`);
      onClose();
    }, 2000);
  };

  const videoFeatures = [
    { id: 'color-grade', name: 'AI Color Grading', icon: Palette, desc: 'Automatically enhance colors and tone' },
    { id: 'stabilize', name: 'AI Stabilization', icon: Video, desc: 'Remove camera shake and jitter' },
    { id: 'object-remove', name: 'Object Removal', icon: Eraser, desc: 'Remove unwanted objects from video' },
    { id: 'upscale', name: 'AI Upscale', icon: Zap, desc: 'Enhance resolution with AI' },
    { id: 'slow-mo', name: 'AI Slow Motion', icon: Video, desc: 'Generate smooth slow-motion' },
    { id: 'scene-detect', name: 'Scene Detection', icon: ImageIcon, desc: 'Auto-detect and split scenes' },
  ];

  const audioFeatures = [
    { id: 'denoise', name: 'AI Noise Reduction', icon: Volume2, desc: 'Remove background noise' },
    { id: 'voice-enhance', name: 'Voice Enhancement', icon: Mic, desc: 'Enhance vocal clarity' },
    { id: 'music-gen', name: 'AI Music Generator', icon: Music, desc: 'Generate background music' },
    { id: 'audio-ducking', name: 'Auto Ducking', icon: Volume2, desc: 'Auto-adjust music levels' },
    { id: 'voice-clone', name: 'Voice Cloning', icon: Mic, desc: 'Clone and modify voices' },
    { id: 'audio-enhance', name: 'Audio Enhancement', icon: Sparkles, desc: 'Overall audio improvement' },
  ];

  const textFeatures = [
    { id: 'subtitle-gen', name: 'AI Subtitle Generator', icon: Captions, desc: 'Auto-generate subtitles from audio' },
    { id: 'translate', name: 'AI Translation', icon: Languages, desc: 'Translate to 100+ languages' },
    { id: 'style-text', name: 'Smart Text Styling', icon: Type, desc: 'AI-powered text animations' },
    { id: 'highlight', name: 'Auto Highlights', icon: Sparkles, desc: 'Highlight key words automatically' },
    { id: 'caption-style', name: 'Caption Templates', icon: Wand2, desc: 'Apply trending caption styles' },
    { id: 'timing', name: 'Smart Timing', icon: Zap, desc: 'Optimize caption timing' },
  ];

  const features = trackType === 'video' ? videoFeatures : trackType === 'audio' ? audioFeatures : textFeatures;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
      
      <div 
        className="relative w-full max-w-2xl bg-[#111111] rounded-xl border border-[#2A2A2A] shadow-2xl max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2A2A2A] flex items-center justify-between">
          <div>
            <h2 className="text-white text-lg font-semibold flex items-center gap-2">
              <Sparkles className="text-[#0A84FF]" size={20} />
              AI Features - {trackName}
            </h2>
            <p className="text-[#8A8A8A] text-xs mt-1">Powered by advanced AI video editing</p>
          </div>
          <button 
            onClick={onClose}
            className="text-[#8A8A8A] hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Features Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.id}
                  onClick={() => handleFeatureClick(feature.name)}
                  disabled={processing}
                  className="group p-4 bg-[#0D0D0D] hover:bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#0A84FF]/50 rounded-lg transition-all text-left disabled:opacity-50"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0A84FF]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#0A84FF]/20 transition-colors">
                      <Icon className="text-[#0A84FF]" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white text-sm font-medium mb-1">{feature.name}</h3>
                      <p className="text-[#8A8A8A] text-xs">{feature.desc}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#2A2A2A] flex justify-between items-center">
          <p className="text-[#5A5A5A] text-xs">
            <span className="text-[#0A84FF]">⚡</span> AI processing uses GPU acceleration
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white text-sm rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
