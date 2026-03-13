import { X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [projectName, setProjectName] = useState('Dark Dream');
  const [resolution, setResolution] = useState('1080p');
  const [frameRate, setFrameRate] = useState('30fps');
  const [autoSave, setAutoSave] = useState(true);

  if (!isOpen) return null;

  const handleSave = () => {
    toast.success('Settings saved ✓');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-[500px] rounded-2xl overflow-hidden"
        style={{
          backgroundColor: '#161616',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#222222] flex items-center justify-between">
          <h2 className="text-white text-lg font-semibold">Project Settings</h2>
          <button onClick={onClose} className="text-[#5A5A5A] hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Project Name */}
          <div>
            <label className="text-[#8A8A8A] text-sm mb-2 block">Project Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full bg-[#0D0D0D] text-white text-sm px-3 py-2 rounded-lg border border-[#2A2A2A] focus:border-[#0A84FF] focus:outline-none"
            />
          </div>

          {/* Resolution */}
          <div>
            <label className="text-[#8A8A8A] text-sm mb-2 block">Resolution</label>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full bg-[#0D0D0D] text-white text-sm px-3 py-2 rounded-lg border border-[#2A2A2A] focus:border-[#0A84FF] focus:outline-none"
            >
              <option value="720p">720p (1280x720)</option>
              <option value="1080p">1080p (1920x1080)</option>
              <option value="4K">4K (3840x2160)</option>
              <option value="9:16">9:16 (1080x1920)</option>
              <option value="1:1">1:1 (1080x1080)</option>
            </select>
          </div>

          {/* Frame Rate */}
          <div>
            <label className="text-[#8A8A8A] text-sm mb-2 block">Frame Rate</label>
            <div className="grid grid-cols-3 gap-2">
              {['24fps', '30fps', '60fps'].map((fps) => (
                <button
                  key={fps}
                  onClick={() => setFrameRate(fps)}
                  className={`py-2 rounded-lg border transition-all ${
                    frameRate === fps
                      ? 'bg-[#0A84FF] border-[#0A84FF] text-white'
                      : 'border-[#2A2A2A] text-[#8A8A8A] hover:border-[#8A8A8A]'
                  }`}
                >
                  {fps}
                </button>
              ))}
            </div>
          </div>

          {/* Auto-save */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white text-sm font-medium block">Auto-save</label>
              <p className="text-[#8A8A8A] text-xs mt-0.5">Automatically save your project every 2 minutes</p>
            </div>
            <button
              onClick={() => setAutoSave(!autoSave)}
              className={`w-12 h-6 rounded-full transition-all ${
                autoSave ? 'bg-[#0A84FF]' : 'bg-[#3A3A3A]'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                autoSave ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#222222] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-[#3A3A3A] text-[#8A8A8A] hover:text-white hover:border-[#8A8A8A] font-medium py-2.5 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-[#0A84FF] text-white font-medium py-2.5 rounded-lg hover:bg-[#0A84FF]/90 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
