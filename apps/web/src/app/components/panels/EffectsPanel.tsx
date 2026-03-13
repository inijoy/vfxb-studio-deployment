import { useState } from 'react';
import { toast } from 'sonner';

export function EffectsPanel() {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [temperature, setTemperature] = useState(100);
  const [selectedFilter, setSelectedFilter] = useState<string>('none');

  const filters = [
    { id: 'none', name: 'None', preview: '#888888' },
    { id: 'cinematic', name: 'Cinematic', preview: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' },
    { id: 'vintage', name: 'Vintage', preview: 'linear-gradient(135deg, #c9a16b 0%, #8b6f47 100%)' },
    { id: 'cold', name: 'Cold', preview: 'linear-gradient(135deg, #5f9ea0 0%, #2f4f4f 100%)' },
    { id: 'warm', name: 'Warm', preview: 'linear-gradient(135deg, #ff7f50 0%, #ff6347 100%)' },
    { id: 'bw', name: 'B&W', preview: 'linear-gradient(135deg, #ffffff 0%, #000000 100%)' },
  ];

  const applyEffects = () => {
    toast.success('Effects applied ✓');
  };

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="px-4 py-4 border-b border-[#3A3A3A]">
        <h3 className="text-white font-semibold text-sm">Effects</h3>
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto space-y-5">
        {/* Color Effects */}
        <div>
          <h4 className="text-white text-xs font-medium mb-3">Color Effects</h4>
          <div className="space-y-3">
            <div>
              <label className="text-[#8A8A8A] text-xs mb-1.5 block">Brightness: {brightness}</label>
              <input
                type="range"
                min="0"
                max="200"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full h-1 bg-[#3A3A3A] rounded-lg appearance-none cursor-pointer accent-[#0A84FF]"
              />
            </div>
            <div>
              <label className="text-[#8A8A8A] text-xs mb-1.5 block">Contrast: {contrast}</label>
              <input
                type="range"
                min="0"
                max="200"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full h-1 bg-[#3A3A3A] rounded-lg appearance-none cursor-pointer accent-[#0A84FF]"
              />
            </div>
            <div>
              <label className="text-[#8A8A8A] text-xs mb-1.5 block">Saturation: {saturation}</label>
              <input
                type="range"
                min="0"
                max="200"
                value={saturation}
                onChange={(e) => setSaturation(Number(e.target.value))}
                className="w-full h-1 bg-[#3A3A3A] rounded-lg appearance-none cursor-pointer accent-[#0A84FF]"
              />
            </div>
            <div>
              <label className="text-[#8A8A8A] text-xs mb-1.5 block">Temperature: {temperature}</label>
              <input
                type="range"
                min="0"
                max="200"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full h-1 bg-[#3A3A3A] rounded-lg appearance-none cursor-pointer accent-[#0A84FF]"
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div>
          <h4 className="text-white text-xs font-medium mb-3">Filters</h4>
          <div className="grid grid-cols-3 gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`relative rounded-md overflow-hidden border-2 transition-all ${
                  selectedFilter === filter.id
                    ? 'border-[#0A84FF]'
                    : 'border-[#3A3A3A] hover:border-[#8A8A8A]'
                }`}
              >
                <div 
                  className="w-full h-12"
                  style={{ background: filter.preview }}
                />
                <div className="py-1 bg-[#1E1E1E] text-white text-[10px] text-center">
                  {filter.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={applyEffects}
          className="w-full bg-[#0A84FF] text-white font-medium py-2.5 rounded-md hover:bg-[#0A84FF]/90 transition-colors"
        >
          Apply Effects
        </button>
      </div>
    </div>
  );
}
