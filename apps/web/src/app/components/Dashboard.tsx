import { useMemo } from 'react';
import { Sparkles, TrendingUp, Eye, Clock, Film, Smartphone, BarChart3, Zap } from 'lucide-react';
import { useAuthStore } from '../../store/auth'; // <-- Import your auth store

interface DashboardProps {
  onNavigate?: (section: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  // --- 1. GET USER FROM STORE ---
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);

  // --- 2. CALCULATE DYNAMIC GREETING & NAME ---
  const { greeting, displayName } = useMemo(() => {
    // Determine Time of Day
    const hour = new Date().getHours();
    let timeGreeting = 'Good evening';
    if (hour >= 5 && hour < 12) timeGreeting = 'Good morning';
    else if (hour >= 12 && hour < 17) timeGreeting = 'Good afternoon';
    else if (hour >= 17 && hour < 21) timeGreeting = 'Good evening';
    else timeGreeting = 'Good night';

    // Determine User's Name (Fallback to 'Creator')
    const fullName = profile?.full_name || user?.name || 'Creator';
    const firstName = fullName.split(' ')[0]; // Gets just the first name for a friendlier feel

    return { greeting: timeGreeting, displayName: firstName };
  }, [user?.name, profile?.full_name]);

  const stats =[
    { label: 'TOTAL VIDEOS', value: '24', trend: '↑ 3 this week', trendColor: '#30D158' },
    { label: 'AVG VIRALITY SCORE', value: '78', trend: '↑ +6 pts from last month', trendColor: '#30D158', valueColor: '#FFD60A' },
    { label: 'TOTAL VIEWS GENERATED', value: '2.4M', trend: '↑ 340K this week', trendColor: '#30D158' },
    { label: 'HOURS SAVED', value: '142h', trend: 'vs manual editing', trendColor: '#444', valueColor: '#0A84FF' }
  ];

  const videos =[
    { title: 'YouTube Vlog #24', duration: '03:24', score: 84, date: '2 days ago', status: 'Published', platforms: ['YT', 'TK'] },
    { title: 'Product Review', duration: '05:12', score: 91, date: '3 days ago', status: 'Published', platforms: ['YT'] },
    { title: 'Tutorial Series EP3', duration: '12:45', score: 78, date: '1 week ago', status: 'Draft', platforms:[] }
  ];

  const activities =[
    { icon: '🔵', text: 'VFXB fixed hook on "Video Title"', time: '2 mins ago' },
    { icon: '🟢', text: 'Published to YouTube', time: '1 hour ago' },
    { icon: '🟡', text: 'Score improved 71 → 89', time: '3 hours ago' },
    { icon: '⚪', text: 'New collab invite from @user', time: 'Yesterday' }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10" style={{ backgroundColor: '#070707' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-7 lg:mb-8">
        <h1 
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold"
          style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
        >
          {/* --- DYNAMIC TEXT INJECTED HERE --- */}
          {greeting}, {displayName} 👋
        </h1>
        <button
          onClick={() => onNavigate?.('upload')}
          className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-semibold text-xs sm:text-sm md:text-base flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(10,132,255,0.3)] w-full sm:w-auto"
          style={{
            backgroundColor: '#0A84FF',
            color: 'white',
            fontFamily: 'Syne, sans-serif'
          }}
        >
          <Sparkles size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
          New Video
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5 mb-6 sm:mb-8 lg:mb-9">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg sm:rounded-xl border flex flex-col justify-center"
            style={{
              backgroundColor: '#0E0E0E',
              borderColor: '#1A1A1A'
            }}
          >
            <div 
              className="text-[8px] sm:text-[9px] md:text-[10px] uppercase mb-1.5 sm:mb-2 tracking-wider"
              style={{ color: '#444', fontFamily: 'DM Sans, sans-serif' }}
            >
              {stat.label}
            </div>
            <div 
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-0.5 sm:mb-1"
              style={{ 
                fontFamily: 'Syne, sans-serif', 
                color: stat.valueColor || 'white' 
              }}
            >
              {stat.value}
            </div>
            <div 
              className="text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs"
              style={{ color: stat.trendColor, fontFamily: 'DM Sans, sans-serif' }}
            >
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Videos Section */}
      <div className="mb-6 sm:mb-8 lg:mb-9">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 
            className="text-sm sm:text-base md:text-lg lg:text-xl font-bold"
            style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
          >
            Recent Videos
          </h2>
          <button 
            className="text-xs sm:text-sm hover:underline"
            style={{ color: '#0A84FF', fontFamily: 'DM Sans, sans-serif' }}
          >
            View all →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {videos.map((video, idx) => (
            <div
              key={idx}
              className="rounded-lg sm:rounded-xl border overflow-hidden hover:border-[#0A84FF] transition-all cursor-pointer flex flex-col"
              style={{
                backgroundColor: '#0E0E0E',
                borderColor: '#1A1A1A'
              }}
            >
              {/* Thumbnail */}
              <div 
                className="aspect-video relative flex items-center justify-center"
                style={{ backgroundColor: '#141414' }}
              >
                <div 
                  className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px]"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}
                >
                  {video.duration}
                </div>
                <div 
                  className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-medium"
                  style={{
                    backgroundColor: '#0A84FF',
                    color: 'white'
                  }}
                >
                  ⚡ {video.score}
                </div>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-3.5 md:p-4 flex flex-col flex-1">
                <div 
                  className="text-xs sm:text-[13px] md:text-sm font-semibold mb-1"
                  style={{ color: 'white', fontFamily: 'DM Sans, sans-serif' }}
                >
                  {video.title}
                </div>
                <div 
                  className="text-[10px] sm:text-[11px] mb-2"
                  style={{ color: '#444', fontFamily: 'DM Sans, sans-serif' }}
                >
                  Edited {video.date}
                </div>

                {/* Platform Pills */}
                {video.platforms.length > 0 && (
                  <div className="flex gap-1 mb-2">
                    {video.platforms.map((platform, pIdx) => (
                      <span
                        key={pIdx}
                        className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px]"
                        style={{
                          backgroundColor: '#1A1A1A',
                          color: '#666',
                          fontFamily: 'JetBrains Mono, monospace'
                        }}
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bottom Row */}
                <div className="flex items-center justify-between mt-auto pt-2">
                  <span 
                    className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px]"
                    style={{
                      backgroundColor: video.status === 'Published' ? 'rgba(48, 209, 88, 0.15)' : '#1A1A1A',
                      color: video.status === 'Published' ? '#30D158' : '#666',
                      fontFamily: 'DM Sans, sans-serif'
                    }}
                  >
                    {video.status}
                  </span>
                  <button className="text-[#444] hover:text-white text-sm sm:text-base">⋯</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 sm:mb-8 lg:mb-9">
        <h2 
          className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-3 sm:mb-4"
          style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
        >
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {[
            { icon: Zap, label: 'Analyze New Video' },
            { icon: Film, label: 'Continue Last Edit' },
            { icon: Smartphone, label: 'Make TikTok Cut' },
            { icon: BarChart3, label: 'View Analytics' }
          ].map((action, idx) => (
            <button
              key={idx}
              className="p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border transition-all hover:border-[#0A84FF] hover:bg-[#0E0E0E] flex flex-col items-start"
              style={{
                backgroundColor: '#0A0A0A',
                borderColor: '#1A1A1A'
              }}
            >
              <div className="text-[#0A84FF] mb-1.5 sm:mb-2">
                <action.icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
              </div>
              <div 
                className="text-[10px] sm:text-xs md:text-sm text-left hover:text-white transition-colors"
                style={{ color: '#888', fontFamily: 'DM Sans, sans-serif' }}
              >
                {action.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 
          className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4"
          style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
        >
          Recent Activity
        </h2>

        <div className="space-y-2.5 sm:space-y-3">
          {activities.map((activity, idx) => (
            <div key={idx} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg hover:bg-[#0A0A0A] transition-colors">
              <span className="text-xs sm:text-sm md:text-base flex-shrink-0">{activity.icon}</span>
              <div className="flex-1 min-w-0">
                <div 
                  className="text-[11px] sm:text-xs md:text-sm"
                  style={{ color: '#888', fontFamily: 'DM Sans, sans-serif' }}
                >
                  {activity.text}
                </div>
                <div 
                  className="text-[9px] sm:text-[10px] md:text-xs mt-0.5"
                  style={{ color: '#333', fontFamily: 'DM Sans, sans-serif' }}
                >
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}