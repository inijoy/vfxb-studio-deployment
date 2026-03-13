import { 
  Undo, Redo, Scissors, Magnet, SplitSquareHorizontal, Lock, Eye, Volume2, 
  ZoomIn, ZoomOut, Play, Pause, SkipBack, SkipForward, Plus, Minus, Layers, 
  Copy, Sparkles, Trash2, Settings, GripVertical, MousePointer, Type, Link2,
  Crop, RotateCw, ImageIcon, Music, FileVideo, ChevronDown, Maximize2,
  TrendingUp, Activity, Move
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { toast } from 'sonner';
import { AIFeaturesPanel } from './AIFeaturesPanel';

interface Clip {
  id: string;
  start: number;
  duration: number;
  color: string;
  label?: string;
  thumbnails?: boolean;
  speed: number;
  volume: number;
  linked?: string[];
  effects?: string[];
}

interface Track {
  id: number;
  name: string;
  type: 'video' | 'audio' | 'text';
  clips: Clip[];
  muted: boolean;
  visible: boolean;
  locked: boolean;
  height: number;
}

interface HistoryState {
  tracks: Track[];
  timestamp: number;
}

const DRAG_TRACK = 'TRACK_ROW';
const DRAG_MEDIA = 'MEDIA_ITEM';

// ─── Draggable Track Header ────────────────────────────────────────────────────
interface TrackHeaderProps {
  track: Track;
  index: number;
  onMove: (fromIndex: number, toIndex: number) => void;
  onToggleVisible: () => void;
  onToggleMute: () => void;
  onToggleLock: () => void;
  onAIOpen: () => void;
  onDelete: () => void;
}

function TrackHeader({ track, index, onMove, onToggleVisible, onToggleMute, onToggleLock, onAIOpen, onDelete }: TrackHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: DRAG_TRACK,
    item: { index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: DRAG_TRACK,
    hover(item: { index: number }) {
      if (item.index === index) return;
      onMove(item.index, index);
      item.index = index;
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`border-b border-[#2A2A2A] px-2 flex items-center justify-between group relative transition-all ${
        isDragging ? 'opacity-40' : 'opacity-100'
      } ${isOver ? 'bg-[#0A84FF]/10' : ''}`}
      style={{ cursor: 'grab', height: `${track.height}px` }}
    >
      {/* Drag indicator */}
      <div className="mr-1 text-[#3A3A3A] group-hover:text-[#666] transition-colors">
        <GripVertical size={12} />
      </div>

      <div className="flex items-center gap-1 flex-1 min-w-0">
        <span className="text-white text-xs truncate">{track.name}</span>
        <button
          onClick={onAIOpen}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-[#0A84FF] hover:text-[#0A84FF]/80 hover:scale-110"
          title="AI Features"
        >
          <Sparkles size={12} className="animate-pulse" />
        </button>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onToggleVisible}
          className={track.visible ? 'text-[#8A8A8A] hover:text-white' : 'text-[#3A3A3A]'}
          title="Toggle visibility"
        >
          <Eye size={10} />
        </button>
        <button
          onClick={onToggleMute}
          className={track.muted ? 'text-[#3A3A3A]' : 'text-[#8A8A8A] hover:text-white'}
          title="Toggle mute"
        >
          <Volume2 size={10} />
        </button>
        <button
          onClick={onToggleLock}
          className={track.locked ? 'text-white' : 'text-[#8A8A8A] hover:text-white'}
          title="Toggle lock"
        >
          <Lock size={10} />
        </button>
        <button
          onClick={onDelete}
          className="text-[#8A8A8A] hover:text-red-500"
          title="Delete track"
        >
          <Trash2 size={10} />
        </button>
      </div>
    </div>
  );
}

// ─── Droppable Track Row ────────────────────────────────────────────────────────
interface TrackRowProps {
  track: Track;
  trackIndex: number;
  pixelsPerSecond: number;
  selectedClip: string | null;
  draggingClip: { clipId: string; trackId: number; offsetX: number } | null;
  resizingClip: { clipId: string; trackId: number; edge: 'left' | 'right'; initialX: number; initialStart: number; initialDuration: number } | null;
  duration: number;
  currentTime: number;
  showWaveforms: boolean;
  onClipMouseDown: (e: React.MouseEvent, clipId: string, trackId: number, clipStart: number) => void;
  onClipResize: (e: React.MouseEvent, clipId: string, trackId: number, edge: 'left' | 'right') => void;
  onContextMenu: (clipId: string) => void;
  onSplit: (clipId: string, trackId: number) => void;
  onDuplicate: (clipId: string, trackId: number) => void;
  onDelete: (clipId: string, trackId: number) => void;
  onMediaDrop: (trackId: number, mediaItem: Record<string, unknown>) => void;
  onSpeedChange: (clipId: string, trackId: number, speed: number) => void;
}

function TrackRow({
  track,
  trackIndex,
  pixelsPerSecond,
  selectedClip,
  draggingClip,
  resizingClip,
  duration,
  currentTime,
  showWaveforms,
  onClipMouseDown,
  onClipResize,
  onContextMenu,
  onSplit,
  onDuplicate,
  onDelete,
  onMediaDrop,
  onSpeedChange,
}: TrackRowProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  // HTML5 drag handlers for media panel items
  const handleDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('media-item')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const raw = e.dataTransfer.getData('media-item');
    if (raw) {
      try {
        const item = JSON.parse(raw);
        onMediaDrop(track.id, item);
      } catch {}
    }
  };

  return (
    <div
      className="border-b border-[#2A2A2A] relative transition-colors"
      style={{
        height: `${track.height}px`,
        minWidth: `${duration * pixelsPerSecond}px`,
        opacity: track.visible ? 1 : 0.3,
        backgroundColor: isDragOver ? 'rgba(10,132,255,0.08)' : 'transparent',
        outline: isDragOver ? '1px dashed rgba(10,132,255,0.5)' : 'none',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drop hint */}
      {isDragOver && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <span className="text-[#0A84FF] text-xs font-medium px-2 py-1 rounded bg-[#0A84FF]/10">
            Drop to add clip
          </span>
        </div>
      )}

      {track.clips.map((clip) => {
        const isPlaying = currentTime >= clip.start && currentTime <= clip.start + clip.duration;
        return (
          <div
            key={clip.id}
            className={`absolute top-1 bottom-1 rounded cursor-move transition-all ${
              selectedClip === clip.id ? 'ring-2 ring-[#0A84FF] ring-offset-1 ring-offset-[#0F0F0F] z-20' : ''
            } ${track.locked ? 'cursor-not-allowed' : 'group hover:brightness-110'}`}
            style={{
              left: `${clip.start * pixelsPerSecond}px`,
              width: `${clip.duration * pixelsPerSecond}px`,
              backgroundColor: clip.color,
              border: selectedClip === clip.id ? '2px solid #0A84FF' : '1px solid rgba(255,255,255,0.1)',
              boxShadow: isPlaying ? '0 0 20px rgba(10,132,255,0.6)' : 'none',
            }}
            onMouseDown={(e) => onClipMouseDown(e, clip.id, track.id, clip.start)}
            onContextMenu={(e) => {
              e.preventDefault();
              onContextMenu(clip.id);
            }}
          >
            {/* Clip Content */}
            <div className="px-2 py-1 h-full flex items-center justify-between overflow-hidden relative">
              <div className="flex flex-col gap-0.5">
                <span className="text-white text-[10px] font-medium truncate">{clip.label}</span>
                {clip.speed !== 1 && (
                  <span className="text-[#0A84FF] text-[8px] font-mono">{clip.speed}x</span>
                )}
              </div>

              {/* Waveform visualization for audio tracks */}
              {showWaveforms && track.type === 'audio' && (
                <div className="absolute inset-0 flex items-center px-1 opacity-30 pointer-events-none">
                  {Array.from({ length: Math.floor(clip.duration * 4) }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-white mx-[1px] rounded-full"
                      style={{ height: `${20 + Math.sin(i) * 15}%` }}
                    />
                  ))}
                </div>
              )}

              {/* Right Resize Handle */}
              <div
                className="absolute right-0 top-0 bottom-0 w-2 bg-white/0 hover:bg-white/20 cursor-ew-resize transition-colors opacity-0 group-hover:opacity-100 z-10"
                onMouseDown={(e) => onClipResize(e, clip.id, track.id, 'right')}
              />

              {/* Left Resize Handle */}
              <div
                className="absolute left-0 top-0 bottom-0 w-2 bg-white/0 hover:bg-white/20 cursor-ew-resize transition-colors opacity-0 group-hover:opacity-100 z-10"
                onMouseDown={(e) => onClipResize(e, clip.id, track.id, 'left')}
              />
            </div>

            {/* Clip Action Menu (appears when selected) */}
            {selectedClip === clip.id && !draggingClip && !resizingClip && (
              <div
                className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg shadow-xl flex items-center gap-1 px-2 py-1.5 z-30"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onSplit(clip.id, track.id)}
                  className="text-[#8A8A8A] hover:text-white p-1 transition-colors"
                  title="Split clip at current time"
                >
                  <Scissors size={12} />
                </button>
                <button
                  onClick={() => onDuplicate(clip.id, track.id)}
                  className="text-[#8A8A8A] hover:text-white p-1 transition-colors"
                  title="Duplicate clip"
                >
                  <Copy size={12} />
                </button>
                <div className="w-px h-3 bg-[#3A3A3A]" />
                <select
                  value={clip.speed}
                  onChange={(e) => onSpeedChange(clip.id, track.id, parseFloat(e.target.value))}
                  className="bg-[#0E0E0E] text-white text-[10px] px-1 py-0.5 rounded border border-[#3A3A3A] outline-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="0.25">0.25x</option>
                  <option value="0.5">0.5x</option>
                  <option value="0.75">0.75x</option>
                  <option value="1">1x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                  <option value="4">4x</option>
                </select>
                <div className="w-px h-3 bg-[#3A3A3A]" />
                <button
                  onClick={() => onDelete(clip.id, track.id)}
                  className="text-[#8A8A8A] hover:text-red-500 p-1 transition-colors"
                  title="Delete clip"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Timeline Component ────────────────────────────────────────────────────
function TimelineContent() {
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: 1,
      name: 'Video 1',
      type: 'video',
      clips: [
        { id: 'v1', start: 0, duration: 25, color: '#0A84FF', label: 'Main footage', speed: 1, volume: 1 },
        { id: 'v2', start: 28, duration: 20, color: '#0A84FF', label: 'B-roll', speed: 1, volume: 1 },
      ],
      muted: false,
      visible: true,
      locked: false,
      height: 64,
    },
    {
      id: 2,
      name: 'Audio 1',
      type: 'audio',
      clips: [{ id: 'a1', start: 0, duration: 60, color: '#34C759', label: 'Background music', speed: 1, volume: 0.8 }],
      muted: false,
      visible: true,
      locked: false,
      height: 48,
    },
    {
      id: 3,
      name: 'Text 1',
      type: 'text',
      clips: [
        { id: 't1', start: 5, duration: 8, color: '#FF9500', label: 'Intro title', speed: 1, volume: 1 },
        { id: 't2', start: 35, duration: 6, color: '#FF9500', label: 'Outro', speed: 1, volume: 1 },
      ],
      muted: false,
      visible: true,
      locked: false,
      height: 48,
    },
  ]);

  const [history, setHistory] = useState<HistoryState[]>([{ tracks, timestamp: Date.now() }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<'select' | 'cut' | 'text' | 'crop'>('select');
  const [draggingClip, setDraggingClip] = useState<{ clipId: string; trackId: number; offsetX: number } | null>(null);
  const [resizingClip, setResizingClip] = useState<{ clipId: string; trackId: number; edge: 'left' | 'right'; initialX: number; initialStart: number; initialDuration: number } | null>(null);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const [isDragOverEmpty, setIsDragOverEmpty] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState<{ trackId: number; trackType: string; trackName: string } | null>(null);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [showWaveforms, setShowWaveforms] = useState(true);
  const [masterVolume, setMasterVolume] = useState(1);

  const timelineRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const pixelsPerSecond = (zoom / 100) * 20;

  // ── History Management ────────────────────────────────────────────────────────
  const saveToHistory = () => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ tracks, timestamp: Date.now() });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setTracks(history[historyIndex - 1].tracks);
      toast.success('Undo');
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setTracks(history[historyIndex + 1].tracks);
      toast.success('Redo');
    }
  };

  // ── Track reorder ────────────────────────────────────────────────────────────
  const handleMoveTrack = (fromIndex: number, toIndex: number) => {
    setTracks((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  };

  // ── Add new track ─────────────────────────────────────────────────────────────
  const addNewTrack = (type: 'video' | 'audio' | 'text') => {
    const color = type === 'video' ? '#0A84FF' : type === 'audio' ? '#34C759' : '#FF9500';
    const maxId = Math.max(...tracks.map((t) => t.id), 0);
    const newTrack: Track = {
      id: maxId + 1,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${maxId + 1}`,
      type,
      muted: false,
      visible: true,
      locked: false,
      height: type === 'video' ? 64 : 48,
      clips: [],
    };
    setTracks((prev) => [...prev, newTrack]);
    saveToHistory();
    toast.success(`${type} track added`);
  };

  // ── Delete track ──────────────────────────────────────────────────────────────
  const deleteTrack = (trackId: number) => {
    setTracks((prev) => prev.filter((t) => t.id !== trackId));
    saveToHistory();
    toast.success('Track deleted');
  };

  // ── Media drop onto track ────────────────────────────────────────────────────
  const handleMediaDrop = (trackId: number, mediaItem: Record<string, unknown>) => {
    const name = (mediaItem.name as string) || 'New clip';
    const type = (mediaItem.type as string) || 'video';
    const color = type === 'video' ? '#0A84FF' : type === 'audio' ? '#34C759' : '#FF9500';
    const newClip: Clip = {
      id: `clip_${Date.now()}`,
      start: Math.round(currentTime * 10) / 10,
      duration: 30,
      color,
      label: name.replace(/\.[^.]+$/, ''),
      speed: 1,
      volume: 1,
    };
    setTracks((prev) =>
      prev.map((t) =>
        t.id === trackId ? { ...t, clips: [...t.clips, newClip] } : t
      )
    );
    saveToHistory();
    toast.success(`"${name}" added to track`);
  };

  // ── Playback ─────────────────────────────────────────────────────────────────
  const togglePlayPause = () => {
    setIsPlaying((p) => !p);
    if (!isPlaying) {
      toast.success('Playing');
    } else {
      toast.success('Paused');
    }
  };

  useEffect(() => {
    if (isPlaying) {
      const startTime = Date.now();
      const startCurrentTime = currentTime;
      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        const newTime = startCurrentTime + elapsed;
        if (newTime >= duration) {
          setCurrentTime(duration);
          setIsPlaying(false);
        } else {
          setCurrentTime(newTime);
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };
      animationFrameRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };
    }
  }, [isPlaying, currentTime, duration]);

  const skipBackward = () => {
    setCurrentTime((t) => Math.max(0, t - 5));
    toast.success('Skip -5s');
  };

  const skipForward = () => {
    setCurrentTime((t) => Math.min(duration, t + 5));
    toast.success('Skip +5s');
  };

  const handleZoomIn = () => {
    setZoom((z) => Math.min(z + 25, 400));
    toast.success(`Zoom: ${Math.min(zoom + 25, 400)}%`);
  };

  const handleZoomOut = () => {
    setZoom((z) => Math.max(z - 25, 25));
    toast.success(`Zoom: ${Math.max(zoom - 25, 25)}%`);
  };

  // ── Clip drag / resize ────────────────────────────────────────────────────────
  const handleClipMouseDown = (
    e: React.MouseEvent,
    clipId: string,
    trackId: number,
    _clipStart: number
  ) => {
    if (tracks.find((t) => t.id === trackId)?.locked) return;
    e.stopPropagation();
    setSelectedClip(clipId);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    setDraggingClip({ clipId, trackId, offsetX });
  };

  const handleClipResize = (
    e: React.MouseEvent,
    clipId: string,
    trackId: number,
    edge: 'left' | 'right'
  ) => {
    if (tracks.find((t) => t.id === trackId)?.locked) return;
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const initialX = e.clientX - rect.left;
    const clip = tracks.find((t) => t.id === trackId)?.clips.find((c) => c.id === clipId);
    if (!clip) return;
    setResizingClip({ clipId, trackId, edge, initialX, initialStart: clip.start, initialDuration: clip.duration });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (draggingClip && timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - draggingClip.offsetX;
      let newStart = Math.max(0, x / pixelsPerSecond);
      
      // Snap to grid if enabled
      if (snapEnabled) {
        newStart = Math.round(newStart * 4) / 4; // Snap to 0.25s increments
      }
      
      setTracks((prev) =>
        prev.map((track) => {
          if (track.id === draggingClip.trackId) {
            return {
              ...track,
              clips: track.clips.map((clip) =>
                clip.id === draggingClip.clipId
                  ? { ...clip, start: newStart }
                  : clip
              ),
            };
          }
          return track;
        })
      );
    } else if (resizingClip && timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setTracks((prev) =>
        prev.map((track) => {
          if (track.id === resizingClip.trackId) {
            return {
              ...track,
              clips: track.clips.map((clip) => {
                if (clip.id === resizingClip.clipId) {
                  if (resizingClip.edge === 'right') {
                    const newDuration = Math.max(0.5, x / pixelsPerSecond - clip.start);
                    return { ...clip, duration: Math.round(newDuration * 10) / 10 };
                  } else {
                    const newStart = Math.max(0, x / pixelsPerSecond);
                    const diff = clip.start - newStart;
                    return {
                      ...clip,
                      start: newStart,
                      duration: Math.max(0.5, clip.duration + diff),
                    };
                  }
                }
                return clip;
              }),
            };
          }
          return track;
        })
      );
    } else if (isDraggingPlayhead && timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newTime = Math.max(0, Math.min(duration, x / pixelsPerSecond));
      setCurrentTime(newTime);
    }
  };

  const handleMouseUp = () => {
    if (draggingClip) {
      toast.success('Clip moved');
      saveToHistory();
    }
    if (resizingClip) {
      toast.success('Clip resized');
      saveToHistory();
    }
    setDraggingClip(null);
    setResizingClip(null);
    setIsDraggingPlayhead(false);
  };

  useEffect(() => {
    if (draggingClip || resizingClip || isDraggingPlayhead) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingClip, resizingClip, isDraggingPlayhead, tracks, pixelsPerSecond, snapEnabled]);

  // ── Clip operations ───────────────────────────────────────────────────────────
  const handleDeleteClip = (clipId: string, trackId: number) => {
    setTracks((prev) =>
      prev.map((track) =>
        track.id === trackId
          ? { ...track, clips: track.clips.filter((c) => c.id !== clipId) }
          : track
      )
    );
    saveToHistory();
    toast.success('Clip deleted');
    setSelectedClip(null);
  };

  const handleDuplicateClip = (clipId: string, trackId: number) => {
    setTracks((prev) =>
      prev.map((track) => {
        if (track.id === trackId) {
          const clipToDupe = track.clips.find((c) => c.id === clipId);
          if (clipToDupe) {
            const newClip: Clip = {
              ...clipToDupe,
              id: `${clipToDupe.id}_copy_${Date.now()}`,
              start: clipToDupe.start + clipToDupe.duration + 0.5,
            };
            return { ...track, clips: [...track.clips, newClip] };
          }
        }
        return track;
      })
    );
    saveToHistory();
    toast.success('Clip duplicated');
  };

  const handleSplitClip = (clipId: string, trackId: number) => {
    setTracks((prev) =>
      prev.map((track) => {
        if (track.id === trackId) {
          const clipToSplit = track.clips.find((c) => c.id === clipId);
          if (clipToSplit) {
            // Split at playhead position if it's within the clip, otherwise split at midpoint
            const relativeTime = currentTime - clipToSplit.start;
            const splitPoint = (relativeTime > 0 && relativeTime < clipToSplit.duration) 
              ? relativeTime 
              : clipToSplit.duration / 2;
            
            const clip1: Clip = { ...clipToSplit, duration: splitPoint };
            const clip2: Clip = {
              ...clipToSplit,
              id: `${clipToSplit.id}_split_${Date.now()}`,
              start: clipToSplit.start + splitPoint,
              duration: clipToSplit.duration - splitPoint,
            };
            return {
              ...track,
              clips: [...track.clips.filter((c) => c.id !== clipId), clip1, clip2],
            };
          }
        }
        return track;
      })
    );
    saveToHistory();
    toast.success('Clip split');
  };

  const handleSpeedChange = (clipId: string, trackId: number, speed: number) => {
    setTracks((prev) =>
      prev.map((track) => {
        if (track.id === trackId) {
          return {
            ...track,
            clips: track.clips.map((clip) =>
              clip.id === clipId ? { ...clip, speed } : clip
            ),
          };
        }
        return track;
      })
    );
    saveToHistory();
    toast.success(`Speed changed to ${speed}x`);
  };

  // ── Track toggle helpers ──────────────────────────────────────────────────────
  const toggleVisible = (trackId: number) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, visible: !t.visible } : t))
    );
    toast.success('Visibility toggled');
  };

  const toggleMute = (trackId: number) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, muted: !t.muted } : t))
    );
    toast.success('Mute toggled');
  };

  const toggleLock = (trackId: number) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, locked: !t.locked } : t))
    );
    toast.success('Lock toggled');
  };

  // ── Empty area drop (create new track) ────────────────────────────────────────
  const handleEmptyDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('media-item')) {
      e.preventDefault();
      setIsDragOverEmpty(true);
    }
  };

  const handleEmptyDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverEmpty(false);
    const raw = e.dataTransfer.getData('media-item');
    if (!raw) return;
    try {
      const mediaItem = JSON.parse(raw);
      const type = (mediaItem.type as string) || 'video';
      const color = type === 'video' ? '#0A84FF' : type === 'audio' ? '#34C759' : '#FF9500';
      const maxId = Math.max(...tracks.map((t) => t.id), 0);
      const name = (mediaItem.name as string) || 'New clip';
      const newTrack: Track = {
        id: maxId + 1,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${maxId + 1}`,
        type: type as 'video' | 'audio' | 'text',
        muted: false,
        visible: true,
        locked: false,
        height: type === 'video' ? 64 : 48,
        clips: [
          {
            id: `clip_${Date.now()}`,
            start: 0,
            duration: 30,
            color,
            label: name.replace(/\.[^.]+$/, ''),
            speed: 1,
            volume: 1,
          },
        ],
      };
      setTracks((prev) => [...prev, newTrack]);
      saveToHistory();
      toast.success(`New track created from "${name}"`);
    } catch {}
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ') {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && e.code === 'KeyY') {
        e.preventDefault();
        redo();
      } else if (e.code === 'Delete' && selectedClip) {
        const track = tracks.find((t) => t.clips.some((c) => c.id === selectedClip));
        if (track) {
          handleDeleteClip(selectedClip, track.id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, selectedClip, tracks, historyIndex]);

  return (
    <div
      className="h-full bg-[#0F0F0F] border-t border-[#2A2A2A] flex flex-col overflow-hidden"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Top Toolbar */}
      <div className="h-10 bg-[#070707] border-b border-[#2A2A2A] px-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          {/* Add dropdown */}
          <div className="relative group">
            <button
              className="px-2 py-1.5 text-white hover:bg-[#1A1A1A] rounded transition-colors flex items-center gap-1"
              title="Add track"
            >
              <Plus size={14} />
              <ChevronDown size={10} />
            </button>
            <div className="absolute top-full left-0 mt-1 bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg shadow-xl hidden group-hover:block z-50 min-w-[120px]">
              <button
                onClick={() => addNewTrack('video')}
                className="w-full px-3 py-2 text-left text-white hover:bg-[#2A2A2A] flex items-center gap-2"
              >
                <FileVideo size={12} /> Video Track
              </button>
              <button
                onClick={() => addNewTrack('audio')}
                className="w-full px-3 py-2 text-left text-white hover:bg-[#2A2A2A] flex items-center gap-2"
              >
                <Music size={12} /> Audio Track
              </button>
              <button
                onClick={() => addNewTrack('text')}
                className="w-full px-3 py-2 text-left text-white hover:bg-[#2A2A2A] flex items-center gap-2"
              >
                <Type size={12} /> Text Track
              </button>
            </div>
          </div>

          {/* Tools */}
          <div className="w-px h-4 bg-[#2A2A2A]" />
          <button
            onClick={() => setSelectedTool('select')}
            className={`px-2 py-1.5 rounded transition-colors ${
              selectedTool === 'select' ? 'bg-[#0A84FF] text-white' : 'text-[#8A8A8A] hover:text-white hover:bg-[#1A1A1A]'
            }`}
            title="Selection tool (V)"
          >
            <MousePointer size={14} />
          </button>
          <button
            onClick={() => setSelectedTool('cut')}
            className={`px-2 py-1.5 rounded transition-colors ${
              selectedTool === 'cut' ? 'bg-[#0A84FF] text-white' : 'text-[#8A8A8A] hover:text-white hover:bg-[#1A1A1A]'
            }`}
            title="Cut tool (C)"
          >
            <Scissors size={14} />
          </button>
          <button
            onClick={() => setSelectedTool('text')}
            className={`px-2 py-1.5 rounded transition-colors ${
              selectedTool === 'text' ? 'bg-[#0A84FF] text-white' : 'text-[#8A8A8A] hover:text-white hover:bg-[#1A1A1A]'
            }`}
            title="Text tool (T)"
          >
            <Type size={14} />
          </button>

          {/* History */}
          <div className="w-px h-4 bg-[#2A2A2A]" />
          <button
            onClick={undo}
            disabled={historyIndex === 0}
            className="px-2 py-1.5 text-[#8A8A8A] hover:text-white hover:bg-[#1A1A1A] disabled:opacity-30 disabled:hover:bg-transparent rounded transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo size={14} />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex === history.length - 1}
            className="px-2 py-1.5 text-[#8A8A8A] hover:text-white hover:bg-[#1A1A1A] disabled:opacity-30 disabled:hover:bg-transparent rounded transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo size={14} />
          </button>

          {/* Utilities */}
          <div className="w-px h-4 bg-[#2A2A2A]" />
          <button
            onClick={() => {
              setSnapEnabled(!snapEnabled);
              toast.success(snapEnabled ? 'Snap disabled' : 'Snap enabled');
            }}
            className={`px-2 py-1.5 rounded transition-colors ${
              snapEnabled ? 'bg-[#0A84FF] text-white' : 'text-[#8A8A8A] hover:text-white hover:bg-[#1A1A1A]'
            }`}
            title="Snap to grid"
          >
            <Magnet size={14} />
          </button>
          <button
            onClick={() => {
              setShowWaveforms(!showWaveforms);
              toast.success(showWaveforms ? 'Waveforms hidden' : 'Waveforms shown');
            }}
            className={`px-2 py-1.5 rounded transition-colors ${
              showWaveforms ? 'bg-[#0A84FF] text-white' : 'text-[#8A8A8A] hover:text-white hover:bg-[#1A1A1A]'
            }`}
            title="Show waveforms"
          >
            <Activity size={14} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#8A8A8A] text-[10px]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {formatTime(currentTime)}
          </span>
        </div>
      </div>

      {/* Bottom Toolbar - Playback Controls */}
      <div className="h-10 bg-[#111111] border-b border-[#2A2A2A] px-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={skipBackward}
            className="p-1.5 text-[#8A8A8A] hover:text-white hover:bg-[#1A1A1A] rounded transition-colors"
            title="Skip backward 5s"
          >
            <SkipBack size={14} />
          </button>
          <button
            onClick={togglePlayPause}
            className="px-3 py-1.5 bg-[#0A84FF] text-white hover:bg-[#0A84FF]/90 rounded transition-colors flex items-center gap-1.5"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            onClick={skipForward}
            className="p-1.5 text-[#8A8A8A] hover:text-white hover:bg-[#1A1A1A] rounded transition-colors"
            title="Skip forward 5s"
          >
            <SkipForward size={14} />
          </button>

          <div className="w-px h-4 bg-[#2A2A2A] mx-1" />

          {/* Volume */}
          <div className="flex items-center gap-2">
            <Volume2 size={14} className="text-[#8A8A8A]" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={masterVolume}
              onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
              className="w-20 h-1 bg-[#2A2A2A] rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #0A84FF 0%, #0A84FF ${masterVolume * 100}%, #2A2A2A ${masterVolume * 100}%, #2A2A2A 100%)`,
              }}
            />
            <span className="text-[#8A8A8A] text-[10px] w-8">{Math.round(masterVolume * 100)}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#5A5A5A] text-[10px]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            / {formatTime(duration)}
          </span>
          <div className="w-px h-4 bg-[#2A2A2A] mx-1" />
          <button onClick={handleZoomOut} className="p-1 text-[#8A8A8A] hover:text-white">
            <ZoomOut size={14} />
          </button>
          <span className="text-[#8A8A8A] text-[10px] w-12 text-center">{zoom}%</span>
          <button onClick={handleZoomIn} className="p-1 text-[#8A8A8A] hover:text-white">
            <ZoomIn size={14} />
          </button>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Track Headers */}
        <div className="w-28 sm:w-32 bg-[#111111] border-r border-[#2A2A2A] flex flex-col overflow-y-auto">
          {tracks.map((track, index) => (
            <TrackHeader
              key={track.id}
              track={track}
              index={index}
              onMove={handleMoveTrack}
              onToggleVisible={() => toggleVisible(track.id)}
              onToggleMute={() => toggleMute(track.id)}
              onToggleLock={() => toggleLock(track.id)}
              onAIOpen={() =>
                setAiPanelOpen({ trackId: track.id, trackType: track.type, trackName: track.name })
              }
              onDelete={() => deleteTrack(track.id)}
            />
          ))}

          {/* Empty drop zone in header area */}
          <div
            className="flex-1 min-h-[20px]"
            onDragOver={handleEmptyDragOver}
            onDragLeave={() => setIsDragOverEmpty(false)}
            onDrop={handleEmptyDrop}
          />
        </div>

        {/* Timeline Tracks */}
        <div ref={timelineRef} className="flex-1 overflow-x-auto overflow-y-auto relative bg-[#0A0A0A]">
          {/* Time Ruler */}
          <div className="sticky top-0 h-6 bg-[#0F0F0F] border-b border-[#2A2A2A] flex items-end z-20">
            {Array.from({ length: Math.ceil(duration / 5) + 1 }).map((_, i) => (
              <div
                key={i}
                className="absolute flex flex-col items-start"
                style={{ left: `${i * 5 * pixelsPerSecond}px` }}
              >
                <span
                  className="text-[#5A5A5A] text-[9px] sm:text-[10px] mb-0.5"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {formatTimeShort(i * 5)}
                </span>
                <div className="w-px h-1.5 bg-[#3A3A3A]" />
              </div>
            ))}
          </div>

          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-[#0A84FF] z-30 cursor-ew-resize"
            style={{
              left: `${currentTime * pixelsPerSecond}px`,
              boxShadow: '0 0 10px rgba(10,132,255,0.8)',
            }}
            ref={playheadRef}
            onMouseDown={() => setIsDraggingPlayhead(true)}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0A84FF] rounded-full cursor-ew-resize" />
          </div>

          {/* Track Rows */}
          {tracks.map((track, trackIndex) => (
            <TrackRow
              key={track.id}
              track={track}
              trackIndex={trackIndex}
              pixelsPerSecond={pixelsPerSecond}
              selectedClip={selectedClip}
              draggingClip={draggingClip}
              resizingClip={resizingClip}
              duration={duration}
              currentTime={currentTime}
              showWaveforms={showWaveforms}
              onClipMouseDown={handleClipMouseDown}
              onClipResize={handleClipResize}
              onContextMenu={(id) => setSelectedClip(id)}
              onSplit={handleSplitClip}
              onDuplicate={handleDuplicateClip}
              onDelete={handleDeleteClip}
              onMediaDrop={handleMediaDrop}
              onSpeedChange={handleSpeedChange}
            />
          ))}

          {/* Empty area below tracks */}
          <div
            className="min-h-[40px] transition-colors"
            style={{
              minWidth: `${duration * pixelsPerSecond}px`,
              backgroundColor: isDragOverEmpty ? 'rgba(10,132,255,0.06)' : 'transparent',
              border: isDragOverEmpty ? '1px dashed rgba(10,132,255,0.3)' : '1px dashed transparent',
            }}
            onDragOver={handleEmptyDragOver}
            onDragLeave={() => setIsDragOverEmpty(false)}
            onDrop={handleEmptyDrop}
          >
            {isDragOverEmpty && (
              <div className="flex items-center justify-center h-full py-3">
                <span className="text-[#0A84FF] text-xs">Drop to create new track</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Features Panel */}
      {aiPanelOpen && (
        <AIFeaturesPanel
          trackType={aiPanelOpen.trackType}
          trackName={aiPanelOpen.trackName}
          onClose={() => setAiPanelOpen(null)}
        />
      )}
    </div>
  );
}

export function Timeline() {
  return (
    <DndProvider backend={HTML5Backend}>
      <TimelineContent />
    </DndProvider>
  );
}

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
    .toString()
    .padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

function formatTimeShort(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}