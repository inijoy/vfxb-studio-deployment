import { Clock, RotateCcw } from 'lucide-react';

interface EditHistoryPageProps {
  onNavigate?: (section: string) => void;
}

export function EditHistoryPage({ onNavigate }: EditHistoryPageProps) {
  const history = [
    { id: 1, action: 'Cut scene', video: 'YouTube Vlog #24', time: '2 mins ago', user: 'You', details: 'Removed 00:12 - 00:24' },
    { id: 2, action: 'Applied AI suggestion', video: 'YouTube Vlog #24', time: '5 mins ago', user: 'AI Director', details: 'Fixed pacing in hook' },
    { id: 3, action: 'Exported video', video: 'Product Review', time: '1 hour ago', user: 'You', details: '1080p, mp4' },
    { id: 4, action: 'Added transition', video: 'YouTube Vlog #24', time: '1 hour ago', user: 'You', details: 'Cross dissolve, 0.5s' },
    { id: 5, action: 'Color correction', video: 'Product Review', time: '2 hours ago', user: 'AI Director', details: 'Auto color grade applied' },
    { id: 6, action: 'Audio enhancement', video: 'Product Review', time: '2 hours ago', user: 'AI Director', details: 'Noise reduction + EQ' },
    { id: 7, action: 'Published to YouTube', video: 'Tutorial Series EP3', time: '1 day ago', user: 'You', details: 'Public, scheduled' },
    { id: 8, action: 'Created new project', video: 'Behind the Scenes', time: '2 days ago', user: 'You', details: 'Long-form mode' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8" style={{ backgroundColor: '#070707' }}>
      {/* Header */}
      <div className="mb-6">
        <h1 
          className="text-2xl font-bold mb-1"
          style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
        >
          Edit History
        </h1>
        <p className="text-sm" style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>
          Track all changes and actions across your videos
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 mb-6">
        <select
          className="px-4 py-2 rounded-lg border text-sm outline-none"
          style={{
            backgroundColor: '#0E0E0E',
            borderColor: '#1A1A1A',
            color: 'white',
            fontFamily: 'DM Sans, sans-serif'
          }}
        >
          <option>All Videos</option>
          <option>YouTube Vlog #24</option>
          <option>Product Review</option>
          <option>Tutorial Series EP3</option>
        </select>

        <select
          className="px-4 py-2 rounded-lg border text-sm outline-none"
          style={{
            backgroundColor: '#0E0E0E',
            borderColor: '#1A1A1A',
            color: 'white',
            fontFamily: 'DM Sans, sans-serif'
          }}
        >
          <option>All Actions</option>
          <option>Cuts</option>
          <option>AI Suggestions</option>
          <option>Exports</option>
          <option>Publishing</option>
        </select>

        <select
          className="px-4 py-2 rounded-lg border text-sm outline-none"
          style={{
            backgroundColor: '#0E0E0E',
            borderColor: '#1A1A1A',
            color: 'white',
            fontFamily: 'DM Sans, sans-serif'
          }}
        >
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>All time</option>
        </select>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div 
          className="absolute left-6 top-0 bottom-0 w-0.5"
          style={{ backgroundColor: '#1A1A1A' }}
        />

        {/* History Items */}
        <div className="space-y-4">
          {history.map((item, idx) => (
            <div key={item.id} className="relative pl-16">
              {/* Timeline Dot */}
              <div 
                className="absolute left-4 top-5 w-4 h-4 rounded-full border-2"
                style={{
                  backgroundColor: item.user === 'AI Director' ? 'rgba(10, 132, 255, 0.2)' : '#0E0E0E',
                  borderColor: item.user === 'AI Director' ? '#0A84FF' : '#444'
                }}
              />

              {/* Card */}
              <div
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: '#0E0E0E',
                  borderColor: '#1A1A1A'
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className="text-sm font-semibold"
                        style={{ color: 'white', fontFamily: 'DM Sans, sans-serif' }}
                      >
                        {item.action}
                      </span>
                      {item.user === 'AI Director' && (
                        <span 
                          className="px-2 py-0.5 rounded-full text-[10px]"
                          style={{
                            backgroundColor: 'rgba(10, 132, 255, 0.15)',
                            color: '#0A84FF',
                            fontFamily: 'DM Sans, sans-serif'
                          }}
                        >
                          AI
                        </span>
                      )}
                    </div>
                    <div 
                      className="text-xs mb-1"
                      style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}
                    >
                      {item.video} • {item.details}
                    </div>
                    <div 
                      className="text-[10px] flex items-center gap-1"
                      style={{ color: '#444', fontFamily: 'DM Sans, sans-serif' }}
                    >
                      <Clock size={10} />
                      {item.time}
                    </div>
                  </div>

                  <button
                    className="px-3 py-1.5 rounded text-xs font-medium transition-all hover:bg-[#1A1A1A]"
                    style={{
                      color: '#666',
                      fontFamily: 'DM Sans, sans-serif'
                    }}
                  >
                    <RotateCcw size={12} className="inline mr-1" />
                    Undo
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}