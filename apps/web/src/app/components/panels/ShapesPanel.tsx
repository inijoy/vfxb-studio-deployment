import { Square, Circle, Triangle, Minus, MoveRight, Star, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function ShapesPanel() {
  const [selectedShape, setSelectedShape] = useState<string>('rectangle');
  const [fillColor, setFillColor] = useState('#0A84FF');
  const [strokeColor, setStrokeColor] = useState('#FFFFFF');
  const [opacity, setOpacity] = useState(100);

  const shapes = [
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'triangle', icon: Triangle, label: 'Triangle' },
    { id: 'line', icon: Minus, label: 'Line' },
    { id: 'arrow', icon: MoveRight, label: 'Arrow' },
    { id: 'star', icon: Star, label: 'Star' },
  ];

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="px-4 py-4 border-b border-[#3A3A3A]">
        <h3 className="text-white font-semibold text-sm">Shapes</h3>
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto space-y-4">
        {/* Shape Grid */}
        <div>
          <label className="text-[#8A8A8A] text-xs mb-2 block">Select Shape</label>
          <div className="grid grid-cols-3 gap-2">
            {shapes.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setSelectedShape(id)}
                className={`aspect-square p-3 rounded-md border transition-all ${
                  selectedShape === id
                    ? 'bg-[#0A84FF] border-[#0A84FF] text-white'
                    : 'border-[#3A3A3A] text-[#8A8A8A] hover:border-[#8A8A8A]'
                }`}
                title={label}
              >
                <Icon size={20} className="mx-auto" />
              </button>
            ))}
          </div>
        </div>

        {/* Fill Color */}
        <div>
          <label className="text-[#8A8A8A] text-xs mb-2 block">Fill Color</label>
          <input
            type="color"
            value={fillColor}
            onChange={(e) => setFillColor(e.target.value)}
            className="w-full h-10 rounded-md cursor-pointer"
          />
        </div>

        {/* Stroke Color */}
        <div>
          <label className="text-[#8A8A8A] text-xs mb-2 block">Stroke Color</label>
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
            className="w-full h-10 rounded-md cursor-pointer"
          />
        </div>

        {/* Opacity */}
        <div>
          <label className="text-[#8A8A8A] text-xs mb-2 block">Opacity: {opacity}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-full h-1 bg-[#3A3A3A] rounded-lg appearance-none cursor-pointer accent-[#0A84FF]"
          />
        </div>

        <button
          onClick={() => toast.success('Shape added to canvas')}
          className="w-full bg-[#0A84FF] text-white font-medium py-2.5 rounded-md hover:bg-[#0A84FF]/90 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          <span>Add to Canvas</span>
        </button>
      </div>
    </div>
  );
}
