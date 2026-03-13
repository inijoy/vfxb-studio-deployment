import { Zap, Copy, Trash2, GripVertical } from 'lucide-react';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { toast } from 'sonner';

interface SceneCardProps {
  sceneNumber: number;
  duration: string;
  label: string;
  aiInsight?: string;
  thumbnail?: string;
  isSelected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onFix?: () => void;
  index?: number;
  onMove?: (fromIndex: number, toIndex: number) => void;
}

interface DragItem {
  index: number;
  type: string;
}

export function SceneCard({ 
  sceneNumber, 
  duration, 
  label, 
  aiInsight, 
  thumbnail, 
  isSelected, 
  onSelect,
  onDelete,
  onDuplicate,
  onFix,
  index,
  onMove
}: SceneCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'SCENE_CARD',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'SCENE_CARD',
    hover(item: DragItem) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      if (onMove && dragIndex !== undefined && hoverIndex !== undefined) {
        onMove(dragIndex, hoverIndex);
        item.index = hoverIndex;
      }
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      onClick={onSelect}
      className={`group w-full rounded-xl overflow-hidden cursor-pointer transition-all ${
        isSelected
          ? 'scale-[1.02] shadow-[0_0_30px_rgba(10,132,255,0.5)]'
          : 'hover:shadow-[0_0_20px_rgba(10,132,255,0.3)]'
      } ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      style={{
        backgroundColor: '#0E0E0E',
        border: isSelected ? '2px solid #0A84FF' : '1px solid #1E1E1E',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
      }}
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-[#070707] relative overflow-hidden">
        {thumbnail ? (
          <img src={thumbnail} alt={`Scene ${sceneNumber}`} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1A1A1A] to-[#070707]"></div>
        )}
        
        {/* Hover Actions */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate?.();
            }}
            className="p-1.5 bg-[#1A1A1A]/90 hover:bg-[#0A84FF] text-white rounded-lg transition-colors backdrop-blur-sm"
            title="Duplicate"
          >
            <Copy size={14} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="p-1.5 bg-[#1A1A1A]/90 hover:bg-red-600 text-white rounded-lg transition-colors backdrop-blur-sm"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onFix?.();
              toast.success('Scene fixed!');
            }}
            className="px-2 py-1 bg-[#0A84FF] hover:bg-[#0A84FF]/90 text-white text-xs rounded-lg flex items-center gap-1 font-medium backdrop-blur-sm"
            title="Fix"
          >
            <Zap size={12} />
            <span>Fix</span>
          </button>
        </div>

        {/* Drag Handle */}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move p-1.5 bg-[#1A1A1A]/90 rounded-lg backdrop-blur-sm">
          <GripVertical size={14} className="text-[#888]" />
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-white text-sm font-semibold">Scene {sceneNumber.toString().padStart(2, '0')}</span>
          <span className="text-[#666] text-xs font-mono">{duration}</span>
        </div>
        <p className="text-[#CCC] text-xs mb-2 leading-relaxed">{label}</p>
        {aiInsight && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md" style={{ backgroundColor: 'rgba(10, 132, 255, 0.1)' }}>
            <div className="w-1.5 h-1.5 bg-[#0A84FF] rounded-full animate-pulse"></div>
            <p className="text-[#0A84FF] text-xs font-medium">{aiInsight}</p>
          </div>
        )}
      </div>
    </div>
  );
}