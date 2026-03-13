import { Sparkles } from 'lucide-react';

interface AISuggestionCardProps {
  suggestion: string;
  onClick?: () => void;
}

export function AISuggestionCard({ suggestion, onClick }: AISuggestionCardProps) {
  return (
    <div
      onClick={onClick}
      className="w-[280px] rounded-xl p-4 cursor-pointer transition-all hover:border-[#0A84FF]"
      style={{
        border: '1px dashed #333333',
        backgroundColor: 'transparent'
      }}
    >
      <div className="flex items-start gap-2">
        <Sparkles size={16} className="text-[#0A84FF] mt-0.5 flex-shrink-0" />
        <div style={{ fontFamily: 'Inter, sans-serif' }}>
          <p className="text-white text-sm font-medium mb-1">Add Scene</p>
          <p className="text-[#5A5A5A] text-xs leading-relaxed">"{suggestion}"</p>
        </div>
      </div>
    </div>
  );
}
