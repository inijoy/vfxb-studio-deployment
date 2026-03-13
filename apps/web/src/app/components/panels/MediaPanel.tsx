import { Search, Play, Upload, Plus, Image, Film, Music, GripVertical } from 'lucide-react';
import { useState, useRef } from 'react';
import { toast } from 'sonner';

interface MediaItem {
  id: number | string;
  name: string;
  duration: string;
  type: 'video' | 'image' | 'audio';
  thumb: string;
}

export function MediaPanel() {
  const [searchTerm, setSearchTerm] = useState('');
  const [draggingId, setDraggingId] = useState<number | string | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    { id: 1, name: 'intro-clip.mp4', duration: '0:24', type: 'video', thumb: '#FF6B6B' },
    { id: 2, name: 'main-scene.mp4', duration: '1:15', type: 'video', thumb: '#4ECDC4' },
    { id: 3, name: 'broll-sunset.mp4', duration: '0:42', type: 'video', thumb: '#95E1D3' },
    { id: 4, name: 'product-demo.mp4', duration: '0:38', type: 'video', thumb: '#F38181' },
    { id: 5, name: 'background.jpg', duration: '—', type: 'image', thumb: '#AA96DA' },
    { id: 6, name: 'ambient-sound.mp3', duration: '2:30', type: 'audio', thumb: '#FCBAD3' },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      const isAudio = file.type.startsWith('audio/');

      if (!isVideo && !isImage && !isAudio) {
        toast.error(`"${file.name}" is not a valid media file`);
        return;
      }

      const newItem: MediaItem = {
        id: Date.now() + Math.random(),
        name: file.name,
        duration: isImage ? '—' : '0:00',
        type: isVideo ? 'video' : isImage ? 'image' : 'audio',
        thumb: isVideo ? '#0A84FF' : isImage ? '#34C759' : '#FF9500',
      };

      setMediaItems((prev) => [newItem, ...prev]);
      toast.success(`"${file.name}" imported successfully!`);
    });
  };

  // Drag & drop file import
  const [isDropZoneActive, setIsDropZoneActive] = useState(false);
  const handleDropZoneDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('Files')) {
      e.preventDefault();
      setIsDropZoneActive(true);
    }
  };
  const handleDropZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropZoneActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const filtered = mediaItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const TypeIcon = ({ type }: { type: string }) => {
    if (type === 'video') return <Film size={10} />;
    if (type === 'image') return <Image size={10} />;
    return <Music size={10} />;
  };

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="px-4 py-4 border-b border-[#3A3A3A]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold text-sm">Media Library</h3>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#0A84FF] hover:bg-[#0A84FF]/90 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
            title="Import media files"
          >
            <Upload size={12} />
            Import
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]" size={14} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search media..."
            className="w-full bg-[#1E1E1E] text-white text-xs pl-9 pr-3 py-2 rounded-md border border-[#3A3A3A] focus:border-[#0A84FF] focus:outline-none placeholder:text-[#8A8A8A]"
          />
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,image/*,audio/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        multiple
        className="hidden"
      />

      {/* Drop zone for file imports */}
      <div
        className="mx-4 mt-3 border border-dashed rounded-lg flex items-center justify-center gap-2 py-2 transition-colors cursor-pointer text-xs"
        style={{
          borderColor: isDropZoneActive ? '#0A84FF' : '#3A3A3A',
          backgroundColor: isDropZoneActive ? 'rgba(10,132,255,0.08)' : 'transparent',
          color: isDropZoneActive ? '#0A84FF' : '#555',
        }}
        onDragOver={handleDropZoneDragOver}
        onDragLeave={() => setIsDropZoneActive(false)}
        onDrop={handleDropZoneDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={12} />
        <span>{isDropZoneActive ? 'Release to import' : 'Drop files here'}</span>
      </div>

      {/* Drag hint */}
      <div className="px-4 pt-2 pb-1">
        <p className="text-[#444] text-[10px]">Drag items to timeline or preview</p>
      </div>

      {/* Media Grid */}
      <div className="flex-1 px-4 pb-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group cursor-grab active:cursor-grabbing"
              draggable
              onDragStart={(e) => {
                // Set data for HTML5 drop targets (Timeline, CenterStage)
                e.dataTransfer.setData('media-item', JSON.stringify(item));
                e.dataTransfer.effectAllowed = 'copy';
                setDraggingId(item.id);
              }}
              onDragEnd={() => setDraggingId(null)}
              style={{ opacity: draggingId === item.id ? 0.4 : 1 }}
            >
              <div
                className="aspect-video rounded-lg relative overflow-hidden border transition-all"
                style={{
                  background: `linear-gradient(135deg, ${item.thumb} 0%, ${item.thumb}CC 100%)`,
                  borderColor: draggingId === item.id ? '#0A84FF' : '#3A3A3A',
                  boxShadow: draggingId === item.id ? `0 0 12px ${item.thumb}88` : 'none',
                }}
              >
                {/* Duration Badge */}
                <div
                  className="absolute top-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded"
                  style={{ fontFamily: 'DM Mono, monospace' }}
                >
                  {item.duration}
                </div>

                {/* Type icon */}
                <div className="absolute top-1 left-1 bg-black/60 text-white p-0.5 rounded text-[#ddd]">
                  <TypeIcon type={item.type} />
                </div>

                {/* Drag handle overlay (always visible) */}
                <div className="absolute bottom-1 right-1 text-white/50 group-hover:text-white/80 transition-colors">
                  <GripVertical size={12} />
                </div>

                {/* Play Overlay (on hover, video only) */}
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Play size={14} className="text-white ml-0.5" />
                    </div>
                  </div>
                )}
              </div>
              <p className="text-[#8A8A8A] text-[11px] mt-1.5 truncate group-hover:text-white transition-colors">
                {item.name}
              </p>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Film size={24} className="text-[#3A3A3A] mb-2" />
            <p className="text-[#555] text-xs">No media found</p>
          </div>
        )}
      </div>
    </div>
  );
}
