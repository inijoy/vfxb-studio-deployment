import { MousePointer2, Type, Square } from 'lucide-react';
import { useState } from 'react';

export function StoryboardToolbar() {
  const [activeTool, setActiveTool] = useState('select');

  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'frame', icon: Square, label: 'Frame' },
  ];

  return (
    <div className="w-10 flex flex-col items-center py-6 gap-4">
      {tools.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => setActiveTool(id)}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            activeTool === id
              ? 'bg-[#1E1E1E] text-white'
              : 'text-[#4A4A4A] hover:text-white'
          }`}
          title={label}
        >
          <Icon size={16} strokeWidth={1.5} />
        </button>
      ))}
    </div>
  );
}
