import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { ExportShareModal } from '../ExportShareModal';

export function PreviewTab() {
  const [resolution, setResolution] = useState('1080p');
  const [format, setFormat] = useState('MP4');
  const [quality, setQuality] = useState('High');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);

  const estimatedSizes: { [key: string]: { [key: string]: { [key: string]: string } } } = {
    '1080p': {
      MP4: { Low: '45 MB', Medium: '98 MB', High: '156 MB', Ultra: '248 MB' },
      MOV: { Low: '52 MB', Medium: '112 MB', High: '185 MB', Ultra: '295 MB' },
      GIF: { Low: '18 MB', Medium: '24 MB', High: '32 MB', Ultra: '42 MB' },
      WebM: { Low: '38 MB', Medium: '82 MB', High: '128 MB', Ultra: '198 MB' },
    },
    '720p': {
      MP4: { Low: '28 MB', Medium: '58 MB', High: '92 MB', Ultra: '142 MB' },
      MOV: { Low: '32 MB', Medium: '68 MB', High: '108 MB', Ultra: '168 MB' },
      GIF: { Low: '12 MB', Medium: '16 MB', High: '22 MB', Ultra: '28 MB' },
      WebM: { Low: '22 MB', Medium: '48 MB', High: '78 MB', Ultra: '118 MB' },
    },
    '4K': {
      MP4: { Low: '98 MB', Medium: '215 MB', High: '358 MB', Ultra: '542 MB' },
      MOV: { Low: '112 MB', Medium: '248 MB', High: '412 MB', Ultra: '628 MB' },
      GIF: { Low: '35 MB', Medium: '48 MB', High: '65 MB', Ultra: '88 MB' },
      WebM: { Low: '82 MB', Medium: '178 MB', High: '295 MB', Ultra: '445 MB' },
    },
  };

  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);

    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          toast.success('Export Complete ✓');
          // Open share modal after export completes
          setTimeout(() => {
            setShowShareModal(true);
          }, 500);
          return 100;
        }
        return prev + 100 / 30; // Complete in ~3 seconds
      });
    }, 100);
  };

  const estimatedSize = estimatedSizes[resolution]?.[format]?.[quality] || '—';

  return (
    <>
      <div className="space-y-4" style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* Preview */}
        <div className="aspect-video bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] rounded-lg border border-[#3A3A3A] flex items-center justify-center">
          <div className="text-[#5A5A5A] text-xs">Preview</div>
        </div>

        {/* Resolution */}
        <div>
          <label className="text-[#8A8A8A] text-xs mb-2 block">Resolution</label>
          <div className="grid grid-cols-3 gap-2">
            {['720p', '1080p', '4K'].map((res) => (
              <button
                key={res}
                onClick={() => setResolution(res)}
                className={`py-2 text-xs rounded-lg border transition-all ${
                  resolution === res
                    ? 'bg-[#0A84FF] border-[#0A84FF] text-white'
                    : 'border-[#3A3A3A] text-[#8A8A8A] hover:border-[#8A8A8A]'
                }`}
              >
                {res}
              </button>
            ))}
          </div>
        </div>

        {/* Format */}
        <div>
          <label className="text-[#8A8A8A] text-xs mb-2 block">Format</label>
          <div className="grid grid-cols-2 gap-2">
            {['MP4', 'MOV', 'GIF', 'WebM'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`py-2 text-xs rounded-lg border transition-all ${
                  format === fmt
                    ? 'bg-[#0A84FF] border-[#0A84FF] text-white'
                    : 'border-[#3A3A3A] text-[#8A8A8A] hover:border-[#8A8A8A]'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Quality */}
        <div>
          <label className="text-[#8A8A8A] text-xs mb-2 block">Quality</label>
          <div className="grid grid-cols-2 gap-2">
            {['Low', 'Medium', 'High', 'Ultra'].map((qual) => (
              <button
                key={qual}
                onClick={() => setQuality(qual)}
                className={`py-2 text-xs rounded-lg border transition-all ${
                  quality === qual
                    ? 'bg-[#0A84FF] border-[#0A84FF] text-white'
                    : 'border-[#3A3A3A] text-[#8A8A8A] hover:border-[#8A8A8A]'
                }`}
              >
                {qual}
              </button>
            ))}
          </div>
        </div>

        {/* Estimated Size */}
        <div className="bg-[#1E1E1E] rounded-lg p-3 border border-[#3A3A3A]">
          <div className="flex justify-between items-center">
            <span className="text-[#8A8A8A] text-xs">Estimated size</span>
            <span className="text-white text-sm font-medium">
              {estimatedSize}
            </span>
          </div>
        </div>

        {/* Export Button */}
        {isExporting ? (
          <div className="space-y-2">
            <div className="w-full bg-[#3A3A3A] rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-[#0A84FF] transition-all duration-100"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
            <p className="text-[#8A8A8A] text-xs text-center">Exporting... {Math.round(exportProgress)}%</p>
          </div>
        ) : (
          <button
            onClick={handleExport}
            className="w-full bg-[#0A84FF] text-white font-medium py-2.5 rounded-lg hover:bg-[#0A84FF]/90 transition-colors flex items-center justify-center gap-2"
          >
            Export Now
          </button>
        )}
      </div>

      {/* Export & Share Modal */}
      <ExportShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        videoDetails={{
          resolution,
          format,
          quality,
          estimatedSize,
        }}
      />
    </>
  );
}