import { TrendingUp, Eye, Users, Clock, BarChart3 } from 'lucide-react';

interface AnalyticsPageProps {
  onNavigate?: (section: string) => void;
}

export function AnalyticsPage({ onNavigate }: AnalyticsPageProps) {
  const stats = [
    { label: 'TOTAL VIEWS', value: '2.4M', change: '+12.3%', trend: 'up' },
    { label: 'AVG WATCH TIME', value: '4:32', change: '+8.5%', trend: 'up' },
    { label: 'ENGAGEMENT RATE', value: '6.8%', change: '+1.2%', trend: 'up' },
    { label: 'SUBSCRIBERS GAINED', value: '+1,234', change: '+23%', trend: 'up' },
  ];

  const topVideos = [
    { title: 'Behind the Scenes Vlog', views: '15.7K', engagement: '8.2%', score: 88 },
    { title: 'YouTube Vlog #24', views: '12.4K', engagement: '7.1%', score: 84 },
    { title: 'Product Review: Tech Edition', views: '8.2K', engagement: '6.5%', score: 91 },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8" style={{ backgroundColor: '#070707' }}>
      {/* Header */}
      <div className="mb-6">
        <h1 
          className="text-2xl font-bold mb-1"
          style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
        >
          Analytics
        </h1>
        <p className="text-sm" style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>
          Performance insights for the last 30 days
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl border"
            style={{
              backgroundColor: '#0E0E0E',
              borderColor: '#1A1A1A'
            }}
          >
            <div 
              className="text-[9px] uppercase mb-2 tracking-wider"
              style={{ color: '#444', fontFamily: 'DM Sans, sans-serif' }}
            >
              {stat.label}
            </div>
            <div 
              className="text-3xl font-bold mb-1"
              style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
            >
              {stat.value}
            </div>
            <div 
              className="text-xs flex items-center gap-1"
              style={{ color: '#30D158', fontFamily: 'DM Sans, sans-serif' }}
            >
              <TrendingUp size={12} />
              {stat.change} vs last month
            </div>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div
        className="p-6 rounded-xl border mb-8"
        style={{
          backgroundColor: '#0E0E0E',
          borderColor: '#1A1A1A'
        }}
      >
        <h3 
          className="text-sm font-bold mb-4"
          style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
        >
          Views Over Time
        </h3>
        <div 
          className="h-64 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: '#070707' }}
        >
          <div className="text-center">
            <BarChart3 size={48} style={{ color: '#1A1A1A', margin: '0 auto' }} />
            <p className="text-sm mt-4" style={{ color: '#444', fontFamily: 'DM Sans, sans-serif' }}>
              Chart visualization coming soon
            </p>
          </div>
        </div>
      </div>

      {/* Top Performing Videos */}
      <div>
        <h3 
          className="text-sm font-bold mb-4"
          style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
        >
          Top Performing Videos
        </h3>
        <div className="space-y-3">
          {topVideos.map((video, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border flex items-center justify-between"
              style={{
                backgroundColor: '#0E0E0E',
                borderColor: '#1A1A1A'
              }}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="text-lg font-bold"
                  style={{ color: '#444', fontFamily: 'Syne, sans-serif' }}
                >
                  {idx + 1}
                </div>
                <div>
                  <div 
                    className="text-sm font-semibold mb-1"
                    style={{ color: 'white', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {video.title}
                  </div>
                  <div 
                    className="text-xs flex items-center gap-3"
                    style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <span className="flex items-center gap-1">
                      <Eye size={12} />
                      {video.views}
                    </span>
                    <span>•</span>
                    <span>Engagement: {video.engagement}</span>
                  </div>
                </div>
              </div>
              <div 
                className="px-3 py-1.5 rounded text-xs font-medium"
                style={{
                  backgroundColor: 'rgba(10, 132, 255, 0.15)',
                  color: '#0A84FF'
                }}
              >
                ⚡ {video.score}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}