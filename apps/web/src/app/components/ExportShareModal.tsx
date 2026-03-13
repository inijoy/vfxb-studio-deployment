import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { 
  Download, 
  Share2, 
  Youtube, 
  Facebook,
  CheckCircle2,
  Loader2,
  Lock,
  Globe,
  Users,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

interface ExportShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoDetails: {
    resolution: string;
    format: string;
    quality: string;
    estimatedSize: string;
  };
}

type Platform = 'tiktok' | 'youtube' | 'facebook' | null;

export function ExportShareModal({ isOpen, onClose, videoDetails }: ExportShareModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareComplete, setShareComplete] = useState(false);
  
  // Form states for each platform
  const [tiktokCaption, setTiktokCaption] = useState('');
  const [tiktokPrivacy, setTiktokPrivacy] = useState<'public' | 'friends' | 'private'>('public');
  const [tiktokAllowComments, setTiktokAllowComments] = useState(true);
  const [tiktokAllowDuet, setTiktokAllowDuet] = useState(true);
  const [tiktokAllowStitch, setTiktokAllowStitch] = useState(true);
  
  const [youtubeTitle, setYoutubeTitle] = useState('');
  const [youtubeDescription, setYoutubeDescription] = useState('');
  const [youtubePrivacy, setYoutubePrivacy] = useState<'public' | 'unlisted' | 'private'>('public');
  const [youtubeTags, setYoutubeTags] = useState('');
  const [youtubeCategory, setYoutubeCategory] = useState('Entertainment');
  
  const [facebookCaption, setFacebookCaption] = useState('');
  const [facebookPrivacy, setFacebookPrivacy] = useState<'public' | 'friends' | 'private'>('public');
  const [facebookLocation, setFacebookLocation] = useState('');

  const handleDownload = () => {
    toast.success(`Downloading video (${videoDetails.resolution} ${videoDetails.format} - ${videoDetails.estimatedSize})`);
    // Mock download logic
    setTimeout(() => {
      toast.success('Video downloaded successfully!');
    }, 1500);
  };

  const handleShare = async () => {
    if (!selectedPlatform) return;
    
    setIsSharing(true);
    
    // Simulate sharing process
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setIsSharing(false);
    setShareComplete(true);
    
    const platformName = selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1);
    toast.success(`Video shared to ${platformName} successfully!`);
    
    // Reset after showing success
    setTimeout(() => {
      setShareComplete(false);
      setSelectedPlatform(null);
    }, 2000);
  };

  const handlePlatformSelect = (platform: Platform) => {
    setSelectedPlatform(platform);
    setShareComplete(false);
  };

  const resetAndClose = () => {
    setSelectedPlatform(null);
    setShareComplete(false);
    setIsSharing(false);
    onClose();
  };

  const getTikTokIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="bg-[#0E0E0E] border-[#2A2A2A] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Export & Share Video</DialogTitle>
          <DialogDescription className="text-[#666666]">
            Download your video or share directly to social media platforms
          </DialogDescription>
        </DialogHeader>

        {/* Video Details */}
        <div className="bg-[#141414] rounded-lg p-4 border border-[#2A2A2A] space-y-2">
          <h3 className="text-white text-sm font-medium mb-3">Video Details</h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex justify-between">
              <span className="text-[#666666]">Resolution:</span>
              <span className="text-white font-medium">{videoDetails.resolution}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666666]">Format:</span>
              <span className="text-white font-medium">{videoDetails.format}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666666]">Quality:</span>
              <span className="text-white font-medium">{videoDetails.quality}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666666]">File Size:</span>
              <span className="text-white font-medium">{videoDetails.estimatedSize}</span>
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div className="space-y-3">
          <h3 className="text-white text-sm font-medium flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Video
          </h3>
          <Button
            onClick={handleDownload}
            className="w-full bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white border border-[#3A3A3A] justify-start"
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Download to Device
          </Button>
        </div>

        {/* Share Section */}
        <div className="space-y-3">
          <h3 className="text-white text-sm font-medium flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share to Social Media
          </h3>
          
          {/* Platform Selection */}
          {!selectedPlatform && (
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handlePlatformSelect('tiktok')}
                className="bg-[#141414] hover:bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4 flex flex-col items-center gap-3 transition-all hover:border-[#0A84FF]"
              >
                <div className="text-white">
                  {getTikTokIcon()}
                </div>
                <span className="text-white text-sm">TikTok</span>
              </button>
              
              <button
                onClick={() => handlePlatformSelect('youtube')}
                className="bg-[#141414] hover:bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4 flex flex-col items-center gap-3 transition-all hover:border-[#0A84FF]"
              >
                <Youtube className="w-6 h-6 text-white" />
                <span className="text-white text-sm">YouTube</span>
              </button>
              
              <button
                onClick={() => handlePlatformSelect('facebook')}
                className="bg-[#141414] hover:bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4 flex flex-col items-center gap-3 transition-all hover:border-[#0A84FF]"
              >
                <Facebook className="w-6 h-6 text-white" />
                <span className="text-white text-sm">Facebook</span>
              </button>
            </div>
          )}

          {/* TikTok Form */}
          {selectedPlatform === 'tiktok' && !shareComplete && (
            <div className="bg-[#141414] rounded-lg p-4 border border-[#2A2A2A] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-white text-sm font-medium flex items-center gap-2">
                  {getTikTokIcon()}
                  Share to TikTok
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPlatform(null)}
                  className="text-[#666666] hover:text-white"
                >
                  Cancel
                </Button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-[#8A8A8A] text-xs">Caption</Label>
                  <Textarea
                    value={tiktokCaption}
                    onChange={(e) => setTiktokCaption(e.target.value)}
                    placeholder="Add a caption... #hashtags"
                    className="bg-[#0E0E0E] border-[#3A3A3A] text-white placeholder:text-[#5A5A5A] mt-1 min-h-[80px]"
                    maxLength={150}
                  />
                  <p className="text-[#5A5A5A] text-xs mt-1">{tiktokCaption.length}/150</p>
                </div>

                <div>
                  <Label className="text-[#8A8A8A] text-xs mb-2 block">Privacy</Label>
                  <div className="flex gap-2">
                    {[
                      { value: 'public', icon: Globe, label: 'Public' },
                      { value: 'friends', icon: Users, label: 'Friends' },
                      { value: 'private', icon: Lock, label: 'Private' }
                    ].map(({ value, icon: Icon, label }) => (
                      <button
                        key={value}
                        onClick={() => setTiktokPrivacy(value as any)}
                        className={`flex-1 py-2 px-3 rounded-lg border text-xs transition-all ${
                          tiktokPrivacy === value
                            ? 'bg-[#0A84FF] border-[#0A84FF] text-white'
                            : 'border-[#3A3A3A] text-[#8A8A8A] hover:border-[#5A5A5A]'
                        }`}
                      >
                        <Icon className="w-3 h-3 mx-auto mb-1" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-[#8A8A8A] text-xs">Allow Comments</Label>
                    <Switch
                      checked={tiktokAllowComments}
                      onCheckedChange={setTiktokAllowComments}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-[#8A8A8A] text-xs">Allow Duet</Label>
                    <Switch
                      checked={tiktokAllowDuet}
                      onCheckedChange={setTiktokAllowDuet}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-[#8A8A8A] text-xs">Allow Stitch</Label>
                    <Switch
                      checked={tiktokAllowStitch}
                      onCheckedChange={setTiktokAllowStitch}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* YouTube Form */}
          {selectedPlatform === 'youtube' && !shareComplete && (
            <div className="bg-[#141414] rounded-lg p-4 border border-[#2A2A2A] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-white text-sm font-medium flex items-center gap-2">
                  <Youtube className="w-5 h-5" />
                  Upload to YouTube
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPlatform(null)}
                  className="text-[#666666] hover:text-white"
                >
                  Cancel
                </Button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-[#8A8A8A] text-xs">Title</Label>
                  <Input
                    value={youtubeTitle}
                    onChange={(e) => setYoutubeTitle(e.target.value)}
                    placeholder="Enter video title"
                    className="bg-[#0E0E0E] border-[#3A3A3A] text-white placeholder:text-[#5A5A5A] mt-1"
                    maxLength={100}
                  />
                  <p className="text-[#5A5A5A] text-xs mt-1">{youtubeTitle.length}/100</p>
                </div>

                <div>
                  <Label className="text-[#8A8A8A] text-xs">Description</Label>
                  <Textarea
                    value={youtubeDescription}
                    onChange={(e) => setYoutubeDescription(e.target.value)}
                    placeholder="Tell viewers about your video"
                    className="bg-[#0E0E0E] border-[#3A3A3A] text-white placeholder:text-[#5A5A5A] mt-1 min-h-[100px]"
                    maxLength={5000}
                  />
                  <p className="text-[#5A5A5A] text-xs mt-1">{youtubeDescription.length}/5000</p>
                </div>

                <div>
                  <Label className="text-[#8A8A8A] text-xs">Tags (comma-separated)</Label>
                  <Input
                    value={youtubeTags}
                    onChange={(e) => setYoutubeTags(e.target.value)}
                    placeholder="tag1, tag2, tag3"
                    className="bg-[#0E0E0E] border-[#3A3A3A] text-white placeholder:text-[#5A5A5A] mt-1"
                  />
                </div>

                <div>
                  <Label className="text-[#8A8A8A] text-xs mb-2 block">Privacy</Label>
                  <div className="flex gap-2">
                    {[
                      { value: 'public', icon: Globe, label: 'Public' },
                      { value: 'unlisted', icon: Users, label: 'Unlisted' },
                      { value: 'private', icon: Lock, label: 'Private' }
                    ].map(({ value, icon: Icon, label }) => (
                      <button
                        key={value}
                        onClick={() => setYoutubePrivacy(value as any)}
                        className={`flex-1 py-2 px-3 rounded-lg border text-xs transition-all ${
                          youtubePrivacy === value
                            ? 'bg-[#0A84FF] border-[#0A84FF] text-white'
                            : 'border-[#3A3A3A] text-[#8A8A8A] hover:border-[#5A5A5A]'
                        }`}
                      >
                        <Icon className="w-3 h-3 mx-auto mb-1" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-[#8A8A8A] text-xs">Category</Label>
                  <select
                    value={youtubeCategory}
                    onChange={(e) => setYoutubeCategory(e.target.value)}
                    className="w-full mt-1 bg-[#0E0E0E] border border-[#3A3A3A] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                  >
                    <option>Entertainment</option>
                    <option>Education</option>
                    <option>Gaming</option>
                    <option>Music</option>
                    <option>Science & Technology</option>
                    <option>Sports</option>
                    <option>Travel & Events</option>
                    <option>People & Blogs</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Facebook Form */}
          {selectedPlatform === 'facebook' && !shareComplete && (
            <div className="bg-[#141414] rounded-lg p-4 border border-[#2A2A2A] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-white text-sm font-medium flex items-center gap-2">
                  <Facebook className="w-5 h-5" />
                  Share to Facebook
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPlatform(null)}
                  className="text-[#666666] hover:text-white"
                >
                  Cancel
                </Button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-[#8A8A8A] text-xs">Caption</Label>
                  <Textarea
                    value={facebookCaption}
                    onChange={(e) => setFacebookCaption(e.target.value)}
                    placeholder="Write something about your video..."
                    className="bg-[#0E0E0E] border-[#3A3A3A] text-white placeholder:text-[#5A5A5A] mt-1 min-h-[80px]"
                  />
                </div>

                <div>
                  <Label className="text-[#8A8A8A] text-xs">Location (optional)</Label>
                  <Input
                    value={facebookLocation}
                    onChange={(e) => setFacebookLocation(e.target.value)}
                    placeholder="Add location"
                    className="bg-[#0E0E0E] border-[#3A3A3A] text-white placeholder:text-[#5A5A5A] mt-1"
                  />
                </div>

                <div>
                  <Label className="text-[#8A8A8A] text-xs mb-2 block">Privacy</Label>
                  <div className="flex gap-2">
                    {[
                      { value: 'public', icon: Globe, label: 'Public' },
                      { value: 'friends', icon: Users, label: 'Friends' },
                      { value: 'private', icon: Lock, label: 'Only Me' }
                    ].map(({ value, icon: Icon, label }) => (
                      <button
                        key={value}
                        onClick={() => setFacebookPrivacy(value as any)}
                        className={`flex-1 py-2 px-3 rounded-lg border text-xs transition-all ${
                          facebookPrivacy === value
                            ? 'bg-[#0A84FF] border-[#0A84FF] text-white'
                            : 'border-[#3A3A3A] text-[#8A8A8A] hover:border-[#5A5A5A]'
                        }`}
                      >
                        <Icon className="w-3 h-3 mx-auto mb-1" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Share Success */}
          {shareComplete && (
            <div className="bg-[#141414] rounded-lg p-6 border border-[#30D158] text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#30D158] mx-auto" />
              <h4 className="text-white font-medium">Successfully Shared!</h4>
              <p className="text-[#666666] text-sm">
                Your video has been shared to {selectedPlatform}
              </p>
            </div>
          )}

          {/* Share Button */}
          {selectedPlatform && !shareComplete && (
            <Button
              onClick={handleShare}
              disabled={isSharing}
              className="w-full bg-[#0A84FF] hover:bg-[#0A84FF]/90 text-white"
            >
              {isSharing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sharing...
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share to {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}
                </>
              )}
            </Button>
          )}

          {/* Info Note */}
          <div className="bg-[#1A1A1A] rounded-lg p-3 border border-[#2A2A2A]">
            <p className="text-[#666666] text-xs leading-relaxed">
              <strong className="text-[#8A8A8A]">Note:</strong> To share directly to social media, you'll need to connect your accounts in Settings. 
              This demo shows the interface for platform-specific sharing options.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}