export function InfoTab() {
  return (
    <div className="space-y-4" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Video Info */}
      <div className="bg-[#1E1E1E] rounded-lg p-4 border border-[#3A3A3A]">
        <h3 className="text-white text-xs font-semibold mb-3">Video Information</h3>
        <div className="space-y-2">
          {[
            { label: 'Filename', value: 'my-video.mp4' },
            { label: 'Duration', value: '00:03:24' },
            { label: 'Resolution', value: '1920x1080' },
            { label: 'File size', value: '248 MB' },
            { label: 'Format', value: 'MP4 H.264' },
            { label: 'Frame rate', value: '30fps' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-xs">
              <span className="text-[#8A8A8A]">{label}</span>
              <span className="text-white" style={{ fontFamily: label === 'Duration' ? 'DM Mono, monospace' : 'inherit' }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Score */}
      <div className="bg-[#1E1E1E] rounded-lg p-4 border border-[#3A3A3A]">
        <h3 className="text-white text-xs font-semibold mb-3">Performance Score</h3>
        <div className="flex items-center justify-center py-4">
          {/* Donut Chart */}
          <div className="relative w-24 h-24">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="#3A3A3A"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="#0A84FF"
                strokeWidth="8"
                strokeDasharray={`${(84 / 100) * 251.2} 251.2`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-2xl font-bold text-white">84</span>
              <span className="text-[10px] text-[#8A8A8A]">/ 100</span>
            </div>
          </div>
        </div>
        <p className="text-[#8A8A8A] text-xs text-center">Good performance · Minor improvements needed</p>
      </div>
    </div>
  );
}
