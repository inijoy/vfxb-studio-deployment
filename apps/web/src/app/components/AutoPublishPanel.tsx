import { X } from 'lucide-react';
import { useState } from 'react';

interface AutoPublishPanelProps {
  onClose: () => void;
}

export function AutoPublishPanel({ onClose }: AutoPublishPanelProps) {
  const [goal, setGoal] = useState('');

  const checklist = [
    { label: 'Optimize hook', completed: true },
    { label: 'Fix pacing', completed: true },
    { label: 'Add captions', completed: true },
    { label: 'Generate thumbnail', completed: true },
    { label: 'Schedule post', completed: false },
    { label: 'Cross-post all platforms', completed: false }
  ];

  return (
    <div 
      className="absolute top-0 right-0 h-full w-[320px] border-l flex flex-col animate-slideInRight"
      style={{
        backgroundColor: '#0A0A0A',
        borderColor: '#1A1A1A',
        zIndex: 100
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#1A1A1A' }}>
        <h3 className="text-sm font-semibold" style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}>
          Autonomous Agent
        </h3>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#1A1A1A] transition-colors"
        >
          <X size={16} className="text-[#666]" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Subtitle */}
        <p className="text-xs mb-4" style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>
          Set your goal. Walk away.
        </p>

        {/* Goal Input */}
        <div className="mb-4">
          <label 
            className="text-[10px] block mb-2"
            style={{ color: '#444', fontFamily: 'DM Sans, sans-serif' }}
          >
            What's the goal for this video?
          </label>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., Get 100K views on YouTube in 7 days"
            rows={3}
            className="w-full px-3 py-2 rounded-lg border text-xs resize-none focus:outline-none focus:border-[#0A84FF] transition-colors"
            style={{
              backgroundColor: '#0E0E0E',
              borderColor: '#1E1E1E',
              color: 'white',
              fontFamily: 'DM Sans, sans-serif'
            }}
          />
        </div>

        {/* Schedule Row */}
        <div className="mb-4 flex items-center gap-2 text-xs" style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>
          <span>Publish</span>
          <select 
            className="px-2 py-1 rounded border text-xs bg-[#0E0E0E] border-[#1E1E1E] text-white focus:outline-none focus:border-[#0A84FF]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            <option>Now</option>
            <option>In 1 hour</option>
            <option>Tomorrow</option>
            <option>Custom</option>
          </select>
          <span>on</span>
          <select 
            className="px-2 py-1 rounded border text-xs bg-[#0E0E0E] border-[#1E1E1E] text-white focus:outline-none focus:border-[#0A84FF]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            <option>All platforms</option>
            <option>YouTube only</option>
            <option>TikTok only</option>
            <option>Custom</option>
          </select>
        </div>

        {/* Checklist */}
        <div className="mb-4">
          <label 
            className="text-[10px] block mb-2"
            style={{ color: '#444', fontFamily: 'DM Sans, sans-serif' }}
          >
            AI PROGRESS
          </label>
          <div className="space-y-2">
            {checklist.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{
                    borderColor: item.completed ? '#30D158' : '#2A2A2A',
                    backgroundColor: item.completed ? '#30D158' : 'transparent'
                  }}
                >
                  {item.completed && (
                    <span className="text-[10px] text-white">✓</span>
                  )}
                </div>
                <span 
                  className="text-xs"
                  style={{ 
                    color: item.completed ? '#888' : 'white',
                    fontFamily: 'DM Sans, sans-serif'
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activate Button */}
        <button
          className="w-full py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2"
          style={{
            backgroundColor: '#0A84FF',
            color: 'white',
            fontFamily: 'Syne, sans-serif'
          }}
        >
          <span>🤖</span>
          Activate Agent
        </button>
      </div>
    </div>
  );
}
