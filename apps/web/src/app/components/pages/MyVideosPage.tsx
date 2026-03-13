import { Search, Filter, Grid3x3, List, Clock, TrendingUp, Edit, Trash2, Download, Share2, MoreVertical } from 'lucide-react';
import { useState } from 'react';

interface MyVideosPageProps {
  onNavigate?: (section: string) => void;
}

export function MyVideosPage({ onNavigate }: MyVideosPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);
  const [showActionsMenu, setShowActionsMenu] = useState<number | null>(null);

  const videos = [
    { id: 1, title: 'YouTube Vlog #24', duration: '03:24', score: 84, date: '2 days ago', status: 'Published', platforms: ['YouTube', 'TikTok'], views: '12.4K', thumbnail: '#1A1A1A' },
    { id: 2, title: 'Product Review: Tech Edition', duration: '05:12', score: 91, date: '3 days ago', status: 'Published', platforms: ['YouTube'], views: '8.2K', thumbnail: '#1A1A1A' },
    { id: 3, title: 'Tutorial Series EP3', duration: '12:45', score: 78, date: '1 week ago', status: 'Draft', platforms: [], views: '0', thumbnail: '#1A1A1A' },
    { id: 4, title: 'Behind the Scenes Vlog', duration: '08:33', score: 88, date: '1 week ago', status: 'Published', platforms: ['YouTube', 'Instagram'], views: '15.7K', thumbnail: '#1A1A1A' },
    { id: 5, title: 'Q&A Session #5', duration: '15:20', score: 82, date: '2 weeks ago', status: 'Published', platforms: ['YouTube'], views: '6.3K', thumbnail: '#1A1A1A' },
    { id: 6, title: 'Travel Montage', duration: '04:15', score: 76, date: '2 weeks ago', status: 'Archived', platforms: [], views: '3.1K', thumbnail: '#1A1A1A' },
  ];

  const filteredVideos = videos.filter(v => {
    if (filter === 'all') return true;
    if (filter === 'published') return v.status === 'Published';
    if (filter === 'draft') return v.status === 'Draft';
    if (filter === 'archived') return v.status === 'Archived';
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#070707' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 
            className="text-xl sm:text-2xl font-bold mb-1"
            style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
          >
            My Videos
          </h1>
          <p className="text-xs sm:text-sm" style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>
            {filteredVideos.length} videos · {videos.filter(v => v.status === 'Published').length} published
          </p>
        </div>
        <button
          onClick={() => onNavigate?.('upload')}
          className="px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(10,132,255,0.3)] w-full sm:w-auto"
          style={{
            backgroundColor: '#0A84FF',
            color: 'white',
            fontFamily: 'Syne, sans-serif'
          }}
        >
          + New Video
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-6">
        {/* Search */}
        <div 
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border flex-1 sm:max-w-md"
          style={{
            backgroundColor: '#0E0E0E',
            borderColor: '#1A1A1A'
          }}
        >
          <Search size={16} style={{ color: '#444' }} />
          <input
            type="text"
            placeholder="Search videos..."
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-[#444]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          />
        </div>

        {/* Filters and View Mode */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Filter Dropdown */}
          <div 
            className="flex items-center gap-2 px-4 py-2 rounded-lg border"
            style={{
              backgroundColor: '#0E0E0E',
              borderColor: '#1A1A1A'
            }}
          >
            <Filter size={14} style={{ color: '#666' }} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent text-white text-sm outline-none"
              style={{ fontFamily: 'DM Sans, sans-serif', color: '#AAA' }}
            >
              <option value="all">All Videos</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div 
            className="flex items-center gap-1 p-1 rounded-lg border"
            style={{
              backgroundColor: '#0E0E0E',
              borderColor: '#1A1A1A'
            }}
          >
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-all ${viewMode === 'grid' ? 'bg-[#1A1A1A]' : ''}`}
              style={{ color: viewMode === 'grid' ? '#0A84FF' : '#666' }}
            >
              <Grid3x3 size={14} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-all ${viewMode === 'list' ? 'bg-[#1A1A1A]' : ''}`}
              style={{ color: viewMode === 'list' ? '#0A84FF' : '#666' }}
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Videos Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="rounded-xl border overflow-hidden hover:border-[#0A84FF] transition-all cursor-pointer"
              style={{
                backgroundColor: '#0E0E0E',
                borderColor: '#1A1A1A'
              }}
            >
              {/* Thumbnail */}
              <div 
                className="aspect-video relative flex items-center justify-center"
                style={{ backgroundColor: video.thumbnail }}
              >
                <div 
                  className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px]"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}
                >
                  {video.duration}
                </div>
                <div 
                  className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-medium"
                  style={{
                    backgroundColor: '#0A84FF',
                    color: 'white'
                  }}
                >
                  ⚡ {video.score}
                </div>
              </div>

              {/* Content */}
              <div className="p-3.5">
                <div 
                  className="text-[13px] font-semibold mb-1"
                  style={{ color: 'white', fontFamily: 'DM Sans, sans-serif' }}
                >
                  {video.title}
                </div>
                <div 
                  className="text-[11px] mb-2 flex items-center gap-2"
                  style={{ color: '#444', fontFamily: 'DM Sans, sans-serif' }}
                >
                  <span>{video.date}</span>
                  {video.status === 'Published' && (
                    <>
                      <span>•</span>
                      <span>{video.views} views</span>
                    </>
                  )}
                </div>

                {/* Platform Pills */}
                {video.platforms.length > 0 && (
                  <div className="flex gap-1 mb-2">
                    {video.platforms.map((platform, pIdx) => (
                      <span
                        key={pIdx}
                        className="px-1.5 py-0.5 rounded text-[9px]"
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
                <div className="flex items-center justify-between">
                  <span 
                    className="px-2 py-0.5 rounded-full text-[10px]"
                    style={{
                      backgroundColor: video.status === 'Published' ? 'rgba(48, 209, 88, 0.15)' : video.status === 'Draft' ? 'rgba(255, 214, 10, 0.15)' : '#1A1A1A',
                      color: video.status === 'Published' ? '#30D158' : video.status === 'Draft' ? '#FFD60A' : '#666',
                      fontFamily: 'DM Sans, sans-serif'
                    }}
                  >
                    {video.status}
                  </span>
                  <div className="relative">
                    <button 
                      className="text-[#444] hover:text-white p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActionsMenu(showActionsMenu === video.id ? null : video.id);
                      }}
                    >
                      <MoreVertical size={14} />
                    </button>
                    
                    {showActionsMenu === video.id && (
                      <div 
                        className="absolute right-0 top-6 w-40 rounded-lg border overflow-hidden shadow-xl z-10"
                        style={{
                          backgroundColor: '#0E0E0E',
                          borderColor: '#1A1A1A'
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate?.('studio');
                            setShowActionsMenu(null);
                          }}
                          className="w-full px-3 py-2 text-left text-xs hover:bg-[#1A1A1A] flex items-center gap-2"
                          style={{ color: '#AAA', fontFamily: 'DM Sans, sans-serif' }}
                        >
                          <Edit size={12} />
                          Edit Video
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowActionsMenu(null);
                          }}
                          className="w-full px-3 py-2 text-left text-xs hover:bg-[#1A1A1A] flex items-center gap-2"
                          style={{ color: '#AAA', fontFamily: 'DM Sans, sans-serif' }}
                        >
                          <Download size={12} />
                          Download
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowActionsMenu(null);
                          }}
                          className="w-full px-3 py-2 text-left text-xs hover:bg-[#1A1A1A] flex items-center gap-2"
                          style={{ color: '#AAA', fontFamily: 'DM Sans, sans-serif' }}
                        >
                          <Share2 size={12} />
                          Share
                        </button>
                        <div className="h-px" style={{ backgroundColor: '#1A1A1A' }} />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVideoId(video.id);
                            setShowDeleteModal(true);
                            setShowActionsMenu(null);
                          }}
                          className="w-full px-3 py-2 text-left text-xs hover:bg-[#1A1A1A] flex items-center gap-2"
                          style={{ color: '#FF3B30', fontFamily: 'DM Sans, sans-serif' }}
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="rounded-lg border p-4 flex items-center gap-4 hover:border-[#0A84FF] transition-all cursor-pointer"
              style={{
                backgroundColor: '#0E0E0E',
                borderColor: '#1A1A1A'
              }}
            >
              {/* Thumbnail */}
              <div 
                className="w-32 h-18 rounded relative flex-shrink-0"
                style={{ backgroundColor: video.thumbnail }}
              >
                <div 
                  className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px]"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}
                >
                  {video.duration}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div 
                  className="text-sm font-semibold mb-1"
                  style={{ color: 'white', fontFamily: 'DM Sans, sans-serif' }}
                >
                  {video.title}
                </div>
                <div 
                  className="text-xs mb-1"
                  style={{ color: '#444', fontFamily: 'DM Sans, sans-serif' }}
                >
                  {video.date} {video.status === 'Published' && `• ${video.views} views`}
                </div>
                {video.platforms.length > 0 && (
                  <div className="flex gap-1">
                    {video.platforms.map((platform, pIdx) => (
                      <span
                        key={pIdx}
                        className="px-1.5 py-0.5 rounded text-[9px]"
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
              </div>

              {/* Score */}
              <div 
                className="px-3 py-1.5 rounded text-xs font-medium"
                style={{
                  backgroundColor: 'rgba(10, 132, 255, 0.15)',
                  color: '#0A84FF'
                }}
              >
                ⚡ {video.score}
              </div>

              {/* Status */}
              <span 
                className="px-3 py-1 rounded-full text-xs"
                style={{
                  backgroundColor: video.status === 'Published' ? 'rgba(48, 209, 88, 0.15)' : video.status === 'Draft' ? 'rgba(255, 214, 10, 0.15)' : '#1A1A1A',
                  color: video.status === 'Published' ? '#30D158' : video.status === 'Draft' ? '#FFD60A' : '#666',
                  fontFamily: 'DM Sans, sans-serif'
                }}
              >
                {video.status}
              </span>

              <button className="text-[#444] hover:text-white">⋯</button>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
          onClick={() => setShowDeleteModal(false)}
        >
          <div 
            className="rounded-2xl border max-w-md w-full p-6"
            style={{
              backgroundColor: '#0E0E0E',
              borderColor: '#1A1A1A'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(255, 59, 48, 0.15)' }}
            >
              <Trash2 size={24} style={{ color: '#FF3B30' }} />
            </div>
            
            <h2 
              className="text-xl font-bold mb-2"
              style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
            >
              Delete Video?
            </h2>
            <p 
              className="text-sm mb-6"
              style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}
            >
              This action cannot be undone. The video and all its data will be permanently deleted.
            </p>

            <div className="flex gap-3">
              <button
                className="flex-1 py-3 rounded-lg font-semibold text-sm border transition-all"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: '#1A1A1A',
                  color: '#AAA',
                  fontFamily: 'Syne, sans-serif'
                }}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 rounded-lg font-semibold text-sm transition-all"
                style={{
                  backgroundColor: '#FF3B30',
                  color: 'white',
                  fontFamily: 'Syne, sans-serif'
                }}
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedVideoId(null);
                  // Handle delete logic here
                }}
              >
                Delete Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}