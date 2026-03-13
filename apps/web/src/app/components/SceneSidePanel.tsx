import { Zap, X, Trash2 } from 'lucide-react';

interface SceneSidePanelProps {
  sceneNumber: number;
  label?: string;
  duration?: string;
  thumbnail?: string;
  notes: string;
  aiFeedback?: string;
  onClose: () => void;
  onNotesChange: (notes: string) => void;
  onLabelChange?: (label: string) => void;
  onDurationChange?: (duration: string) => void;
  onDelete?: () => void;
}

export function SceneSidePanel({ 
  sceneNumber, 
  label,
  duration,
  thumbnail, 
  notes, 
  aiFeedback, 
  onClose, 
  onNotesChange,
  onLabelChange,
  onDurationChange,
  onDelete
}: SceneSidePanelProps) {
  return (
    <>
      {/* Mobile/Tablet Backdrop */}
      <div 
        className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
        onClick={onClose}
      ></div>

      {/* Panel - Fixed to top right */}
      <div 
        className="fixed right-0 top-0 bottom-0 w-full max-w-[320px] sm:w-[320px] bg-[#141414] border-l border-[#222222] flex flex-col overflow-y-auto z-[70] shadow-2xl"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#222222] flex items-center justify-between">
          <h3 className="text-white font-semibold text-sm">Scene {sceneNumber.toString().padStart(2, '0')}</h3>
          <button onClick={onClose} className="text-[#5A5A5A] hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Thumbnail */}
        <div className="p-3 border-b border-[#222222]">
          <div className="aspect-video rounded-lg overflow-hidden bg-[#0D0D0D] flex items-center justify-center">
            {thumbnail ? (
              <img src={thumbnail} alt={`Scene ${sceneNumber}`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-[#2A2A2A] rounded-lg"></div>
              </div>
            )}
          </div>
        </div>

        {/* Scene Label */}
        {onLabelChange && (
          <div className="p-4 border-b border-[#222222]">
            <label className="text-[#5A5A5A] text-xs mb-2 block">Scene Label</label>
            <input
              type="text"
              value={label || ''}
              onChange={(e) => onLabelChange(e.target.value)}
              placeholder="Enter scene label..."
              className="w-full bg-[#1E1E1E] text-white text-sm px-3 py-2 rounded-lg border border-[#2A2A2A] focus:border-[#0A84FF] focus:outline-none placeholder:text-[#4A4A4A]"
            />
          </div>
        )}

        {/* Scene Duration */}
        {onDurationChange && (
          <div className="p-4 border-b border-[#222222]">
            <label className="text-[#5A5A5A] text-xs mb-2 block">Duration</label>
            <input
              type="text"
              value={duration || ''}
              onChange={(e) => onDurationChange(e.target.value)}
              placeholder="0:00"
              className="w-full bg-[#1E1E1E] text-white text-sm px-3 py-2 rounded-lg border border-[#2A2A2A] focus:border-[#0A84FF] focus:outline-none placeholder:text-[#4A4A4A]"
              style={{ fontFamily: 'DM Mono, monospace' }}
            />
          </div>
        )}

        {/* Scene Notes */}
        <div className="p-4 border-b border-[#222222]">
          <label className="text-[#5A5A5A] text-xs mb-2 block">Scene Notes</label>
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Add notes about this scene..."
            className="w-full bg-[#1E1E1E] text-white text-sm p-2 rounded-lg border border-[#2A2A2A] focus:border-[#0A84FF] focus:outline-none placeholder:text-[#4A4A4A] resize-none"
            rows={4}
          />
        </div>

        {/* AI Feedback */}
        {aiFeedback && (
          <div className="p-4 border-b border-[#222222]">
            <div className="bg-[#1E1E1E] rounded-lg p-3 border border-[#2A2A2A]">
              <div className="flex items-start gap-2 mb-3">
                <Zap size={14} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-yellow-500 text-xs font-semibold mb-1">AI Insight</p>
                  <p className="text-[#8A8A8A] text-xs leading-relaxed">{aiFeedback}</p>
                </div>
              </div>
              <button className="w-full px-3 py-2 bg-[#0A84FF] text-white text-xs rounded-md hover:bg-[#0A84FF]/90 transition-colors">
                Apply Fix
              </button>
            </div>
          </div>
        )}

        {/* Delete Scene */}
        {onDelete && (
          <div className="p-4">
            <button
              onClick={onDelete}
              className="w-full px-3 py-2 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white text-xs rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={14} />
              <span>Delete Scene</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}