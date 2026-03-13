import { AlignLeft, AlignCenter, AlignRight, AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd, AlignHorizontalDistributeCenter, AlignVerticalDistributeCenter } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function AlignTab() {
  const [activeAlign, setActiveAlign] = useState<string | null>(null);

  const alignOptions = [
    { id: 'left', icon: AlignLeft, label: 'Align Left' },
    { id: 'center', icon: AlignCenter, label: 'Align Center' },
    { id: 'right', icon: AlignRight, label: 'Align Right' },
    { id: 'top', icon: AlignVerticalJustifyStart, label: 'Align Top' },
    { id: 'middle', icon: AlignVerticalJustifyCenter, label: 'Align Middle' },
    { id: 'bottom', icon: AlignVerticalJustifyEnd, label: 'Align Bottom' },
  ];

  const distributeOptions = [
    { id: 'horizontal', icon: AlignHorizontalDistributeCenter, label: 'Distribute Horizontal' },
    { id: 'vertical', icon: AlignVerticalDistributeCenter, label: 'Distribute Vertical' },
  ];

  const handleAlign = (id: string, label: string) => {
    setActiveAlign(id);
    toast.success(`${label} applied`);
    setTimeout(() => setActiveAlign(null), 1000);
  };

  return (
    <div className="space-y-4" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Alignment Options */}
      <div>
        <h3 className="text-[#8A8A8A] text-xs mb-3">Alignment</h3>
        <div className="grid grid-cols-3 gap-2">
          {alignOptions.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => handleAlign(id, label)}
              className={`aspect-square p-3 rounded-lg border transition-all ${
                activeAlign === id
                  ? 'bg-[#0A84FF] border-[#0A84FF] text-white'
                  : 'border-[#3A3A3A] text-[#8A8A8A] hover:border-[#8A8A8A] hover:text-white'
              }`}
              title={label}
            >
              <Icon size={18} className="mx-auto" />
            </button>
          ))}
        </div>
      </div>

      {/* Distribution Options */}
      <div>
        <h3 className="text-[#8A8A8A] text-xs mb-3">Distribution</h3>
        <div className="space-y-2">
          {distributeOptions.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => handleAlign(id, label)}
              className={`w-full p-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                activeAlign === id
                  ? 'bg-[#0A84FF] border-[#0A84FF] text-white'
                  : 'border-[#3A3A3A] text-[#8A8A8A] hover:border-[#8A8A8A] hover:text-white'
              }`}
            >
              <Icon size={16} />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
