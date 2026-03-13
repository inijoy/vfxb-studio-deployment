import { useState } from 'react';
import { toast } from 'sonner';

export function TransitionsPanel() {
  const [selectedTransition, setSelectedTransition] = useState<string>('');

  const transitions = [
    { id: 'fade', name: 'Fade', gradient: 'linear-gradient(to right, #0A0A0A 0%, #FFFFFF 100%)' },
    { id: 'wipe', name: 'Wipe', gradient: 'linear-gradient(90deg, #0A0A0A 0%, #0A0A0A 50%, #FFFFFF 50%, #FFFFFF 100%)' },
    { id: 'zoom', name: 'Zoom', gradient: 'radial-gradient(circle, #FFFFFF 0%, #0A0A0A 70%)' },
    { id: 'slide', name: 'Slide', gradient: 'linear-gradient(135deg, #0A0A0A 0%, #FFFFFF 100%)' },
    { id: 'dissolve', name: 'Dissolve', gradient: 'repeating-linear-gradient(45deg, #0A0A0A, #0A0A0A 2px, #FFFFFF 2px, #FFFFFF 4px)' },
    { id: 'blur', name: 'Blur', gradient: 'linear-gradient(to bottom, #0A0A0A 0%, #555555 50%, #FFFFFF 100%)' },
    { id: 'spin', name: 'Spin', gradient: 'conic-gradient(#0A0A0A, #FFFFFF, #0A0A0A)' },
    { id: 'glitch', name: 'Glitch', gradient: 'linear-gradient(to right, #FF0000 0%, #00FF00 50%, #0000FF 100%)' },
  ];

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="px-4 py-4 border-b border-[#3A3A3A]">
        <h3 className="text-white font-semibold text-sm">Transitions</h3>
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {transitions.map(({ id, name, gradient }) => (
            <button
              key={id}
              onClick={() => setSelectedTransition(id)}
              className={`group relative rounded-lg overflow-hidden border-2 transition-all ${
                selectedTransition === id
                  ? 'border-[#0A84FF]'
                  : 'border-[#3A3A3A] hover:border-[#8A8A8A]'
              }`}
            >
              {/* Preview Box */}
              <div 
                className="w-full h-20 transition-transform group-hover:scale-105"
                style={{ background: gradient }}
              />
              {/* Label */}
              <div className="py-2 bg-[#1E1E1E] text-white text-xs text-center">
                {name}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            if (selectedTransition) {
              toast.success('Transition applied to selection');
            } else {
              toast.error('Please select a transition first');
            }
          }}
          className="w-full mt-4 bg-[#0A84FF] text-white font-medium py-2.5 rounded-md hover:bg-[#0A84FF]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedTransition}
        >
          Apply to Selection
        </button>
      </div>
    </div>
  );
}
