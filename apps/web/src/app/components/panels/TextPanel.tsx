import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function TextPanel() {
  const [selectedFont, setSelectedFont] = useState('Syne');
  const [fontSize, setFontSize] = useState(48);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');

  const fonts = ['Syne', 'DM Sans', 'Playfair Display', 'Oswald', 'Bebas Neue'];
  const colorSwatches = ['#FFFFFF', '#FF6B6B', '#4ECDC4', '#FFD93D', '#95E1D3', '#AA96DA', '#FCBAD3', '#0A84FF'];

  const handleAddToTimeline = () => {
    toast.success('Text clip added to Timeline');
  };

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="px-4 py-4 border-b border-[#3A3A3A]">
        <h3 className="text-white font-semibold text-sm">Text Tools</h3>
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto space-y-4">
        {/* Font Selector */}
        <div>
          <label className="text-[#8A8A8A] text-xs mb-2 block">Font Family</label>
          <select
            value={selectedFont}
            onChange={(e) => setSelectedFont(e.target.value)}
            className="w-full bg-[#1E1E1E] text-white text-sm px-3 py-2 rounded-md border border-[#3A3A3A] focus:border-[#0A84FF] focus:outline-none"
          >
            {fonts.map((font) => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <div>
          <label className="text-[#8A8A8A] text-xs mb-2 block">Font Size: {fontSize}px</label>
          <input
            type="range"
            min="8"
            max="120"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full h-1 bg-[#3A3A3A] rounded-lg appearance-none cursor-pointer accent-[#0A84FF]"
          />
        </div>

        {/* Text Styles */}
        <div>
          <label className="text-[#8A8A8A] text-xs mb-2 block">Style</label>
          <div className="flex gap-2">
            <button
              onClick={() => setIsBold(!isBold)}
              className={`flex-1 p-2 rounded-md border transition-all ${
                isBold
                  ? 'bg-[#0A84FF] border-[#0A84FF] text-white'
                  : 'border-[#3A3A3A] text-[#8A8A8A] hover:border-[#8A8A8A]'
              }`}
            >
              <Bold size={16} className="mx-auto" />
            </button>
            <button
              onClick={() => setIsItalic(!isItalic)}
              className={`flex-1 p-2 rounded-md border transition-all ${
                isItalic
                  ? 'bg-[#0A84FF] border-[#0A84FF] text-white'
                  : 'border-[#3A3A3A] text-[#8A8A8A] hover:border-[#8A8A8A]'
              }`}
            >
              <Italic size={16} className="mx-auto" />
            </button>
            <button
              onClick={() => setIsUnderline(!isUnderline)}
              className={`flex-1 p-2 rounded-md border transition-all ${
                isUnderline
                  ? 'bg-[#0A84FF] border-[#0A84FF] text-white'
                  : 'border-[#3A3A3A] text-[#8A8A8A] hover:border-[#8A8A8A]'
              }`}
            >
              <Underline size={16} className="mx-auto" />
            </button>
          </div>
        </div>

        {/* Alignment */}
        <div>
          <label className="text-[#8A8A8A] text-xs mb-2 block">Alignment</label>
          <div className="flex gap-2">
            <button
              onClick={() => setAlignment('left')}
              className={`flex-1 p-2 rounded-md border transition-all ${
                alignment === 'left'
                  ? 'bg-[#0A84FF] border-[#0A84FF] text-white'
                  : 'border-[#3A3A3A] text-[#8A8A8A] hover:border-[#8A8A8A]'
              }`}
            >
              <AlignLeft size={16} className="mx-auto" />
            </button>
            <button
              onClick={() => setAlignment('center')}
              className={`flex-1 p-2 rounded-md border transition-all ${
                alignment === 'center'
                  ? 'bg-[#0A84FF] border-[#0A84FF] text-white'
                  : 'border-[#3A3A3A] text-[#8A8A8A] hover:border-[#8A8A8A]'
              }`}
            >
              <AlignCenter size={16} className="mx-auto" />
            </button>
            <button
              onClick={() => setAlignment('right')}
              className={`flex-1 p-2 rounded-md border transition-all ${
                alignment === 'right'
                  ? 'bg-[#0A84FF] border-[#0A84FF] text-white'
                  : 'border-[#3A3A3A] text-[#8A8A8A] hover:border-[#8A8A8A]'
              }`}
            >
              <AlignRight size={16} className="mx-auto" />
            </button>
          </div>
        </div>

        {/* Color Picker */}
        <div>
          <label className="text-[#8A8A8A] text-xs mb-2 block">Text Color</label>
          <div className="grid grid-cols-4 gap-2">
            {colorSwatches.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-full aspect-square rounded-md border-2 transition-all ${
                  selectedColor === color
                    ? 'border-[#0A84FF] scale-110'
                    : 'border-[#3A3A3A] hover:border-[#8A8A8A]'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-full mt-2 h-8 rounded-md cursor-pointer"
          />
        </div>

        {/* Add to Timeline Button */}
        <button
          onClick={handleAddToTimeline}
          className="w-full bg-[#0A84FF] text-white font-medium py-2.5 rounded-md hover:bg-[#0A84FF]/90 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          <span>Add Text to Timeline</span>
        </button>
      </div>
    </div>
  );
}
