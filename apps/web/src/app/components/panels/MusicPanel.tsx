import { Search, Play, Pause, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function MusicPanel() {
  const [searchTerm, setSearchTerm] = useState('');
  const [playingTrack, setPlayingTrack] = useState<number | null>(null);

  const tracks = [
    { id: 1, title: 'Epic Intro', duration: '0:32', genre: 'Cinematic' },
    { id: 2, title: 'Chill Beats', duration: '1:04', genre: 'Lo-fi' },
    { id: 3, title: 'Hype Drop', duration: '0:18', genre: 'Trap' },
    { id: 4, title: 'Emotional Rise', duration: '0:45', genre: 'Ambient' },
    { id: 5, title: 'Fast Energy', duration: '0:22', genre: 'Electronic' },
  ];

  const togglePlay = (trackId: number) => {
    setPlayingTrack(playingTrack === trackId ? null : trackId);
  };

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="px-4 py-4 border-b border-[#3A3A3A]">
        <h3 className="text-white font-semibold text-sm mb-3">Music & Sounds</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]" size={14} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search sounds..."
            className="w-full bg-[#1E1E1E] text-white text-xs pl-9 pr-3 py-2 rounded-md border border-[#3A3A3A] focus:border-[#0A84FF] focus:outline-none placeholder:text-[#8A8A8A]"
          />
        </div>
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="space-y-2">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="flex items-center gap-2 p-2 rounded-lg border border-[#3A3A3A] hover:border-[#8A8A8A] transition-colors group"
            >
              {/* Play Button */}
              <button
                onClick={() => togglePlay(track.id)}
                className="w-8 h-8 flex items-center justify-center bg-[#1E1E1E] rounded-md text-[#8A8A8A] hover:text-white hover:bg-[#0A84FF] transition-all"
              >
                {playingTrack === track.id ? (
                  <Pause size={14} />
                ) : (
                  <Play size={14} className="ml-0.5" />
                )}
              </button>

              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px]">🎵</span>
                  <p className="text-white text-xs truncate">{track.title}</p>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[#8A8A8A] text-[10px]" style={{ fontFamily: 'DM Mono, monospace' }}>
                    {track.duration}
                  </span>
                  <span className="text-[#8A8A8A] text-[10px]">·</span>
                  <span className="text-[#8A8A8A] text-[10px]">{track.genre}</span>
                </div>
              </div>

              {/* Add Button */}
              <button
                onClick={() => toast.success(`"${track.title}" added to Timeline`)}
                className="w-6 h-6 flex items-center justify-center bg-[#1E1E1E] rounded-md text-[#8A8A8A] opacity-0 group-hover:opacity-100 hover:text-white hover:bg-[#0A84FF] transition-all"
              >
                <Plus size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
