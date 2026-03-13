import { Upload, Sparkles } from 'lucide-react';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import vfxbLogo from "../../assets/87baff59339294d92e591456a1fc7b6ab9585915.png";
import { useVideoUpload } from '../../hooks/useVideoUpload';
import { api } from '../../lib/api';

interface VFXBUploadScreenProps {
  onUpload: (mode: 'long-form' | 'short-form' | 'agency') => void;
  onNavigate?: (section: string) => void;
}

export function VFXBUploadScreen({ onUpload, onNavigate }: VFXBUploadScreenProps) {
  const [selectedMode, setSelectedMode] = useState<'long-form' | 'short-form' | 'agency'>('long-form');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading, progress } = useVideoUpload();

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo'];
    
    if (!validVideoTypes.includes(file.type)) {
      toast.error('Please upload a valid video file (mp4, mov, webm)');
      return;
    }

    if (file.size > 10 * 1024 * 1024 * 1024) {
      toast.error('File size must be less than 10GB');
      return;
    }

    try {
      await upload(file);
      toast.success(`"${file.name}" uploaded successfully!`);
      onUpload(selectedMode);
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Upload failed');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleUrlSubmit = async () => {
    const url = urlInputRef.current?.value;
    if (url) {
      try {
        await api.post('/api/upload/from-url', { url, platform: 'youtube' });
        toast.success('Import queued successfully');
        onUpload(selectedMode);
      } catch (err: unknown) {
        toast.error((err as Error).message || 'URL import failed');
      }
    }
  };

  return (
    <div 
      className="w-full min-h-screen flex flex-col relative overflow-auto"
      style={{ 
        backgroundColor: '#070707',
        fontFamily: 'DM Sans, sans-serif'
      }}
    >
      {/* Background Gradient Effects - Enhanced */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(10, 132, 255, 0.2), transparent 60%), radial-gradient(ellipse 60% 50% at 50% 120%, rgba(10, 132, 255, 0.15), transparent 60%)',
          opacity: 0.8
        }}
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(10, 132, 255, 0.12) 0%, transparent 70%)',
          filter: 'blur(80px)'
        }}
      />
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 20% 30%, rgba(10, 132, 255, 0.08), transparent 40%), radial-gradient(circle at 80% 70%, rgba(10, 132, 255, 0.08), transparent 40%)'
        }}
      />

      {/* Top Bar - Responsive */}
      <div 
        className="h-14 sm:h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between border-b flex-shrink-0 relative z-10"
        style={{ borderColor: '#1E1E1E' }}
      >
        {/* Left: Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div 
            className="w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(10,132,255,0.5))'
            }}
          >
            <img 
              src={vfxbLogo} 
              alt="VFXB" 
              className="w-full h-full"
              style={{
                filter: 'brightness(0) invert(1)',
              }}
            />
          </div>
          <span 
            className="text-white text-base sm:text-lg font-bold"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            VFXB
          </span>
        </div>

        {/* Right: Links and Avatar - Responsive */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          {/* Dashboard Button - Always visible */}
          <button 
            onClick={() => onNavigate?.('dashboard')}
            className="text-[#666] hover:text-white transition-colors text-xs sm:text-sm px-2 py-1 rounded hover:bg-[#1A1A1A]"
          >
            <span className="hidden sm:inline">Dashboard</span>
            <span className="sm:hidden">≡</span>
          </button>
          
          <button className="hidden lg:block text-[#666] hover:text-white transition-colors text-sm">
            Docs
          </button>
          <div 
            className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full border"
            style={{ 
              backgroundColor: '#0E0E0E',
              borderColor: '#1E1E1E'
            }}
          >
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#333] flex items-center justify-center text-[10px]">
              👤
            </div>
            <span className="text-white text-xs hidden md:inline">Creator</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#30D158]"></div>
          </div>
          <button 
            onClick={() => onNavigate?.('upgrade')}
            className="px-2.5 sm:px-3 py-1.5 rounded-full border hover:bg-[#0A84FF] hover:border-[#0A84FF] hover:text-white transition-all text-xs whitespace-nowrap"
            style={{
              borderColor: '#0A84FF',
              color: '#0A84FF'
            }}
          >
            <span className="hidden sm:inline">Upgrade </span>✦
          </button>
        </div>
      </div>

      {/* Center Hero - Vertically Centered - Responsive */}
      <div className="flex-1 flex items-center justify-center py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6 lg:px-8 overflow-y-auto relative z-10">
        <div className="text-center max-w-2xl w-full">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm,video/x-msvideo"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          {/* Logo with glow */}
          <div className="mb-3 sm:mb-4 md:mb-6 lg:mb-8 flex justify-center">
            <div 
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-xl flex items-center justify-center animate-pulse"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(10,132,255,0.6))'
              }}
            >
              <img 
                src={vfxbLogo} 
                alt="VFXB" 
                className="w-full h-full"
                style={{
                  filter: 'brightness(0) invert(1)',
                }}
              />
            </div>
          </div>

          {/* Headline - Fully Responsive */}
          <h1 
            className="text-white text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 lg:mb-4 leading-tight px-2"
            style={{ 
              fontFamily: 'Syne, sans-serif',
              letterSpacing: '-0.02em'
            }}
          >
            Your AI Video Director
          </h1>

          {/* Subtext - Fully Responsive */}
          <p className="text-[#999] text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl mb-5 sm:mb-6 md:mb-8 lg:mb-10 px-2 sm:px-4 max-w-xl mx-auto leading-relaxed">
            Upload your video. Tell VFXB what you want. Watch it happen.
          </p>

          {/* Upload Zone - Fully Responsive */}
          <div
            className="w-full mx-auto mb-4 sm:mb-5 md:mb-6 p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 rounded-xl sm:rounded-2xl border border-dashed cursor-pointer transition-all"
            style={{
              backgroundColor: isDragging ? 'rgba(10,132,255,0.05)' : 'rgba(14, 14, 14, 0.3)',
              borderColor: isDragging ? '#0A84FF' : '#2A2A2A',
              boxShadow: isDragging ? '0 0 30px rgba(10,132,255,0.3)' : 'none',
              backdropFilter: 'blur(10px)'
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadClick}
          >
            <Upload 
              className="mx-auto mb-2.5 sm:mb-3 md:mb-4 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
              style={{ color: isDragging ? '#0A84FF' : '#888' }}
            />
            <div className="text-white text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-1.5 md:mb-2">
              {isDragging ? 'Drop your video here' : '↑  Drop your video here'}
            </div>
            <div className="text-[#666] text-[10px] xs:text-xs sm:text-sm mb-4 sm:mb-5 md:mb-6">
              mp4  ·  mov  ·  webm  ·  up to 10GB
            </div>
            <button 
              disabled={isUploading}
              className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full bg-white text-black hover:bg-gray-100 transition-colors text-xs sm:text-sm font-semibold shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                handleUploadClick();
              }}
            >
              {isUploading ? `Uploading ${progress}%` : 'Browse Files'}
            </button>
          </div>

          {/* OR Divider - Responsive */}
          <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6 px-2">
            <div className="flex-1 h-px" style={{ backgroundColor: '#2A2A2A' }}></div>
            <span className="text-[#555] text-[10px] xs:text-xs sm:text-sm whitespace-nowrap font-medium">or paste a link</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#2A2A2A' }}></div>
          </div>

          {/* URL Input - Fully Responsive */}
          <div 
            className="w-full mx-auto flex items-center gap-2 px-3 sm:px-3.5 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl border mb-5 sm:mb-6 md:mb-8"
            style={{
              backgroundColor: 'rgba(14, 14, 14, 0.5)',
              borderColor: '#2A2A2A',
              backdropFilter: 'blur(10px)'
            }}
          >
            <span className="text-[#666] text-sm sm:text-base">🔗</span>
            <input
              ref={urlInputRef}
              type="text"
              placeholder="Paste YouTube, Drive, or Dropbox link..."
              className="flex-1 bg-transparent text-white text-[11px] xs:text-xs sm:text-sm outline-none placeholder:text-[#555]"
            />
            <button
              onClick={handleUrlSubmit}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 flex-shrink-0"
              style={{ backgroundColor: '#0A84FF' }}
            >
              <span className="text-white text-sm sm:text-base font-bold">→</span>
            </button>
          </div>

          {/* Creator Mode Selector - Fully Responsive */}
          <div className="mb-5 sm:mb-6 md:mb-8 lg:mb-10 relative z-10">
            
            
          </div>

          {/* Help Section with Docs and Upgrade - Fully Responsive */}
          <div className="mt-5 sm:mt-6 md:mt-8 lg:mt-12 flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-2 sm:gap-2.5 md:gap-3 relative z-10">
            <button
              onClick={() => onNavigate?.('dashboard')}
              className="px-3.5 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg text-[10px] xs:text-xs sm:text-sm font-medium transition-all hover:bg-[#1A1A1A] hover:text-white order-3 xs:order-1"
              style={{
                color: '#888',
                fontFamily: 'DM Sans, sans-serif'
              }}
            >
              ← Back to Dashboard
            </button>
            <div className="hidden xs:block h-3 sm:h-4 w-px order-2" style={{ backgroundColor: '#2A2A2A' }} />
            <button
              onClick={() => {
                onNavigate?.('help');
              }}
              className="px-3.5 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg text-[10px] xs:text-xs sm:text-sm font-semibold transition-all hover:text-white order-2 xs:order-3"
              style={{
                color: '#0A84FF',
                fontFamily: 'DM Sans, sans-serif'
              }}
            >
              View Docs
            </button>
            <button
              onClick={() => {
                onNavigate?.('upgrade');
              }}
              className="px-3.5 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg text-[10px] xs:text-xs sm:text-sm font-bold transition-all hover:shadow-[0_0_20px_rgba(10,132,255,0.5)] order-1 xs:order-4"
              style={{
                backgroundColor: '#0A84FF',
                color: 'white',
                fontFamily: 'Syne, sans-serif'
              }}
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      </div>

      {/* Social Proof Bar - Bottom - Fully Responsive */}
      <div 
        className="h-10 sm:h-11 md:h-12 lg:h-14 flex items-center justify-center border-t px-3 sm:px-4 flex-shrink-0 relative z-10"
        style={{ borderColor: '#1E1E1E' }}
      >
        <p className="text-[#444] text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs text-center leading-tight">
          <span className="hidden lg:inline">12,000+ creators  ·  2.1M videos analyzed  ·  Avg. virality lift +34%  ·  ⭐ 4.9/5 on Product Hunt</span>
          <span className="hidden sm:inline lg:hidden">12K+ creators  ·  2.1M videos  ·  +34% virality  ·  ⭐ 4.9/5</span>
          <span className="sm:hidden">12K+ creators  ·  2.1M videos</span>
        </p>
      </div>
    </div>
  );
}