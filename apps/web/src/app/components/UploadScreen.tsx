import { Upload, Link2, Film, Zap, Building2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import vfxbLogo from "../../assets/87baff59339294d92e591456a1fc7b6ab9585915.png";

interface UploadScreenProps {
  onUpload: (mode: 'long-form' | 'short-form' | 'agency') => void;
}

export function UploadScreen({ onUpload }: UploadScreenProps) {
  const [selectedMode, setSelectedMode] = useState<'long-form' | 'short-form' | 'agency'>('long-form');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo'];
    
    if (!validVideoTypes.includes(file.type)) {
      toast.error('Please upload a valid video file (mp4, mov, webm)');
      return;
    }

    if (file.size > 10 * 1024 * 1024 * 1024) { // 10GB
      toast.error('File size must be less than 10GB');
      return;
    }

    toast.success(`"${file.name}" uploaded successfully!`);
    
    // Simulate upload
    setTimeout(() => {
      onUpload(selectedMode);
    }, 500);
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

  return (
    <div className="w-full h-full flex items-center justify-center" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm,video/x-msvideo"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />
      
      <div className="text-center max-w-2xl px-4 sm:px-6 md:px-8">
        {/* Logo */}
        <div className="mb-4 sm:mb-6 flex justify-center">
          <div className="flex items-center justify-center">
            <img 
              src={vfxbLogo} 
              alt="VFXB Logo" 
              className="h-12 sm:h-14 md:h-16 w-auto"
              style={{
                filter: 'brightness(0) invert(1)',
                opacity: 0.95
              }}
            />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 px-4" style={{ fontFamily: 'Syne, sans-serif' }}>
          Drop your video. Tell me what you want.
        </h1>
        
        {/* Subtext */}
        <p className="text-[#666] text-xs sm:text-sm mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-md mx-auto px-4">
          VFXB analyzes your footage and edits it through conversation. No timelines. No menus.
        </p>

        {/* Upload Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Upload Video */}
          <button
            onClick={handleUploadClick}
            className={`group p-6 sm:p-8 rounded-xl border-2 border-dashed transition-all ${
              isDragging 
                ? 'border-[#0A84FF] shadow-[0_0_30px_rgba(10,132,255,0.4)] bg-[#0A84FF]/10' 
                : 'border-[#2a2a2a] hover:border-[#0A84FF] hover:shadow-[0_0_30px_rgba(10,132,255,0.2)]'
            }`}
            style={{ backgroundColor: isDragging ? 'rgba(10,132,255,0.05)' : '#0e0e0e' }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload size={28} className={`transition-colors mx-auto mb-3 sm:mb-3 ${
              isDragging ? 'text-[#0A84FF]' : 'text-[#666] group-hover:text-[#0A84FF]'
            }`} />
            <div className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
              {isDragging ? 'Drop video here' : 'Upload Video'}
            </div>
            <div className="text-[#666] text-xs">
              mp4, mov, webm<br />
              up to 10GB
            </div>
          </button>

          {/* Import Link */}
          <button
            className="group p-6 sm:p-8 rounded-xl border-2 border-dashed border-[#2a2a2a] hover:border-[#0A84FF] hover:shadow-[0_0_30px_rgba(10,132,255,0.2)] transition-all"
            style={{ backgroundColor: '#0e0e0e' }}
          >
            <Link2 size={28} className="text-[#666] group-hover:text-[#0A84FF] transition-colors mx-auto mb-3 sm:mb-3" />
            <div className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Import Link</div>
            <div className="text-[#666] text-xs">
              YouTube, Vimeo<br />
              TikTok, Instagram
            </div>
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <span className="text-[#666] text-xs sm:text-sm">Select mode:</span>
          
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <button
              onClick={() => setSelectedMode('long-form')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium transition-all ${
                selectedMode === 'long-form'
                  ? 'bg-[#0A84FF] text-white shadow-[0_0_20px_rgba(10,132,255,0.4)]'
                  : 'bg-[#1a1a1a] text-[#666] hover:text-white hover:bg-[#2a2a2a]'
              }`}
            >
              <Film size={14} className="sm:w-4 sm:h-4" />
              Long-form
            </button>

            <button
              onClick={() => setSelectedMode('short-form')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium transition-all ${
                selectedMode === 'short-form'
                  ? 'bg-[#0A84FF] text-white shadow-[0_0_20px_rgba(10,132,255,0.4)]'
                  : 'bg-[#1a1a1a] text-[#666] hover:text-white hover:bg-[#2a2a2a]'
              }`}
            >
              <Zap size={14} className="sm:w-4 sm:h-4" />
              Short-form
            </button>

            <button
              onClick={() => setSelectedMode('agency')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium transition-all ${
                selectedMode === 'agency'
                  ? 'bg-[#0A84FF] text-white shadow-[0_0_20px_rgba(10,132,255,0.4)]'
                  : 'bg-[#1a1a1a] text-[#666] hover:text-white hover:bg-[#2a2a2a]'
              }`}
            >
              <Building2 size={14} className="sm:w-4 sm:h-4" />
              Agency
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}