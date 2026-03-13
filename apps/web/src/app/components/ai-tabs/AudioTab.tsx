import { Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function AudioTab() {
  const [videoVolume, setVideoVolume] = useState(75);
  const [musicVolume, setMusicVolume] = useState(60);
  const [voiceVolume, setVoiceVolume] = useState(85);
  const [masterVolume, setMasterVolume] = useState(80);
  const [mutedTracks, setMutedTracks] = useState<{ [key: string]: boolean }>({});

  const toggleMute = (track: string) => {
    setMutedTracks((prev) => {
      const newMuted = { ...prev, [track]: !prev[track] };
      toast.success(`${track} ${newMuted[track] ? 'muted' : 'unmuted'}`);
      return newMuted;
    });
  };

  const channels = [
    { id: 'video', label: 'Video Audio', volume: videoVolume, setVolume: setVideoVolume },
    { id: 'music', label: 'Music Track', volume: musicVolume, setVolume: setMusicVolume },
    { id: 'voice', label: 'Voice Track', volume: voiceVolume, setVolume: setVoiceVolume },
  ];

  return (
    <div className="space-y-6" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Channel Strips */}
      {channels.map(({ id, label, volume, setVolume }) => (
        <div key={id} className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-white text-xs font-medium">{label}</label>
            <button
              onClick={() => toggleMute(label)}
              className={`p-1.5 rounded-md transition-all ${
                mutedTracks[label]
                  ? 'bg-red-500/20 text-red-500'
                  : 'bg-[#1E1E1E] text-[#8A8A8A] hover:text-white'
              }`}
            >
              {mutedTracks[label] ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
          <div className={`transition-opacity ${mutedTracks[label] ? 'opacity-40' : 'opacity-100'}`}>
            <input
              type="range"
              min="0"
              max="100"
              value={mutedTracks[label] ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              disabled={mutedTracks[label]}
              className="w-full h-1 bg-[#3A3A3A] rounded-lg appearance-none cursor-pointer accent-[#0A84FF] disabled:cursor-not-allowed"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[#5A5A5A] text-[10px]">0%</span>
              <span className="text-[#8A8A8A] text-[10px]">{mutedTracks[label] ? '0%' : `${volume}%`}</span>
              <span className="text-[#5A5A5A] text-[10px]">100%</span>
            </div>
          </div>
        </div>
      ))}

      {/* Divider */}
      <div className="border-t border-[#3A3A3A]"></div>

      {/* Master Volume */}
      <div className="space-y-2">
        <label className="text-white text-xs font-semibold">Master Volume</label>
        <input
          type="range"
          min="0"
          max="100"
          value={masterVolume}
          onChange={(e) => setMasterVolume(Number(e.target.value))}
          className="w-full h-2 bg-[#3A3A3A] rounded-lg appearance-none cursor-pointer accent-[#0A84FF]"
        />
        <div className="flex justify-between">
          <span className="text-[#5A5A5A] text-[10px]">0%</span>
          <span className="text-white text-sm font-medium">{masterVolume}%</span>
          <span className="text-[#5A5A5A] text-[10px]">100%</span>
        </div>
      </div>
    </div>
  );
}
