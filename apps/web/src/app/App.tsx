import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { AuthScreen } from './components/AuthScreen';
import { VFXBUploadScreen } from './components/VFXBUploadScreen';
import { MainInterface } from './components/MainInterface';
import { TimelineView } from './components/TimelineView';
import { StoryboardView } from './components/StoryboardView';
import { ViewSwitcher } from './components/ViewSwitcher';
import { LeftNavSidebar } from './components/LeftNavSidebar';
import { Dashboard } from './components/Dashboard';
import { MyVideosPage } from './components/pages/MyVideosPage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { EditHistoryPage } from './components/pages/EditHistoryPage';
import { CollaborationPage } from './components/pages/CollaborationPage';
import { APIPage } from './components/pages/APIPage';
import { UpgradePage } from './components/pages/UpgradePage';
import { SettingsPage } from './components/pages/SettingsPage';
import { HelpPage } from './components/pages/HelpPage';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/auth';

type View = 'chat' | 'studio' | 'storyboard';

export default function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [showAuthScreen, setShowAuthScreen] = useState(false);
  const [pendingUpload, setPendingUpload] = useState<'long-form' | 'short-form' | 'agency' | null>(null);
  const [hasUploadedVideo, setHasUploadedVideo] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'long-form' | 'short-form' | 'agency'>('long-form');
  const [activeView, setActiveView] = useState<View>('chat');
  const [activeIcon, setActiveIcon] = useState('media');
  const [activeSection, setActiveSection] = useState('upload');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Listen for custom navigation events from Upload screen
  useEffect(() => {
    const handleNavigateDashboard = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setActiveSection(customEvent.detail);
        setShowMobileSidebar(false); // Close mobile sidebar on navigation
      }
    };

    window.addEventListener('navigate-dashboard', handleNavigateDashboard);
    return () => {
      window.removeEventListener('navigate-dashboard', handleNavigateDashboard);
    };
  }, []);

  const handleAuthenticate = () => {
    setShowAuthScreen(false);
  };

  useEffect(() => {
    if (!isAuthenticated || !pendingUpload) return;

    setSelectedMode(pendingUpload);
    setHasUploadedVideo(true);
    setActiveSection('studio');
    setPendingUpload(null);
    setShowAuthScreen(false);
  }, [isAuthenticated, pendingUpload]);

  const handleVideoUpload = (mode: 'long-form' | 'short-form' | 'agency') => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Store the upload mode and show auth screen
      setPendingUpload(mode);
      setShowAuthScreen(true);
    } else {
      // User is authenticated, proceed with upload
      setSelectedMode(mode);
      setHasUploadedVideo(true);
      setActiveSection('studio');
    }
  };

  const handleNavigate = (section: string) => {
    // Check if user needs authentication for certain sections
    if (!isAuthenticated && section !== 'upload') {
      setShowAuthScreen(true);
      return;
    }
    
    setActiveSection(section);
    setShowMobileSidebar(false); // Close mobile sidebar on navigation
  };

  // Show auth screen when user needs to authenticate
  if (showAuthScreen) {
    return <AuthScreen onAuthenticate={handleAuthenticate} />;
  }

  return (
    <div className="w-full min-h-screen bg-[#070707]">
      {activeSection === 'upload' ? (
        <VFXBUploadScreen onUpload={handleVideoUpload} onNavigate={handleNavigate} />
      ) : (
        <div className="w-full h-screen overflow-hidden">
          {/* Conditional Layout: Show sidebar for dashboard sections, top bar for studio views */}
          {activeSection === 'studio' ? (
            <>
              {/* Top Bar with Dashboard button - Only show for chat and storyboard views, not studio */}
              {activeView !== 'studio' && (
                <div 
                  className="absolute top-0 left-0 right-0 h-12 sm:h-14 flex items-center justify-between px-4 border-b border-[#1E1E1E] z-50" 
                  style={{ backgroundColor: 'rgba(7, 7, 7, 0.95)' }}
                >
                  {/* Left: Back to Dashboard */}
                  <button
                    onClick={() => setActiveSection('dashboard')}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all hover:bg-[#1A1A1A]"
                    style={{ 
                      color: '#666',
                      fontFamily: 'DM Sans, sans-serif'
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    <span className="hidden sm:inline">Dashboard</span>
                  </button>

                  {/* Center: View Switcher */}
                  <div className="absolute left-1/2 -translate-x-1/2">
                    <ViewSwitcher activeView={activeView} onViewChange={setActiveView} />
                  </div>

                  {/* Right: Empty space for balance */}
                  <div className="w-20"></div>
                </div>
              )}

              {/* Studio View Compact Header - Only for studio view */}
              {activeView === 'studio' && (
                <div 
                  className="absolute top-0 left-0 right-0 h-10 flex items-center justify-between px-4 border-b border-[#1E1E1E] z-50" 
                  style={{ backgroundColor: 'rgba(7, 7, 7, 0.98)' }}
                >
                  {/* Left: Back to Dashboard */}
                  <button
                    onClick={() => setActiveSection('dashboard')}
                    className="flex items-center gap-2 px-2 py-1 rounded-lg text-xs transition-all hover:bg-[#1A1A1A]"
                    style={{ 
                      color: '#666',
                      fontFamily: 'DM Sans, sans-serif'
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    <span className="hidden sm:inline text-[11px]">Dashboard</span>
                  </button>

                  {/* Center: View Switcher (Compact) */}
                  <div className="flex items-center gap-1 bg-[#0E0E0E] rounded-lg p-0.5 border border-[#1A1A1A]">
                    <button
                      onClick={() => setActiveView('chat')}
                      className="px-2 py-1 rounded text-[10px] transition-all"
                      style={{
                        backgroundColor: activeView === 'chat' ? '#0A84FF' : 'transparent',
                        color: activeView === 'chat' ? 'white' : '#666',
                        fontFamily: 'DM Sans, sans-serif'
                      }}
                    >
                      Chat
                    </button>
                    <button
                      onClick={() => setActiveView('studio')}
                      className="px-2 py-1 rounded text-[10px] transition-all"
                      style={{
                        backgroundColor: activeView === 'studio' ? '#0A84FF' : 'transparent',
                        color: activeView === 'studio' ? 'white' : '#666',
                        fontFamily: 'DM Sans, sans-serif'
                      }}
                    >
                      Studio
                    </button>
                    <button
                      onClick={() => setActiveView('storyboard')}
                      className="px-2 py-1 rounded text-[10px] transition-all"
                      style={{
                        backgroundColor: activeView === 'storyboard' ? '#0A84FF' : 'transparent',
                        color: activeView === 'storyboard' ? 'white' : '#666',
                        fontFamily: 'DM Sans, sans-serif'
                      }}
                    >
                      Storyboard
                    </button>
                  </div>

                  {/* Right: Empty space */}
                  <div className="w-20"></div>
                </div>
              )}

              {/* Main Content - with dynamic top padding based on view */}
              <div className={activeView === 'studio' ? 'absolute top-10 left-0 right-0 bottom-0 flex flex-col' : 'pt-12 sm:pt-14 h-full'}>
                {activeView === 'chat' && <MainInterface mode={selectedMode} />}
                {activeView === 'studio' && <TimelineView activeIcon={activeIcon} onIconClick={setActiveIcon} />}
                {activeView === 'storyboard' && <StoryboardView isEmpty={false} />}
              </div>
            </>
          ) : (
            <>
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-lg flex items-center justify-center transition-all"
                style={{
                  backgroundColor: '#111',
                  borderColor: '#3A3A3A',
                  color: 'white'
                }}
              >
                {showMobileSidebar ? <X size={20} /> : <Menu size={20} />}
              </button>

              {/* Dashboard Layout with Left Sidebar */}
              <div className="flex h-full">
                {/* Desktop Sidebar */}
                <div className="hidden lg:block">
                  <LeftNavSidebar 
                    activeSection={activeSection} 
                    onSectionChange={(section) => {
                      setActiveSection(section);
                      // If user clicks Studio in sidebar, switch to studio view
                      if (section === 'studio') {
                        setActiveView('studio');
                      }
                    }} 
                  />
                </div>

                {/* Mobile Sidebar Drawer */}
                {showMobileSidebar && (
                  <>
                    <div 
                      className="lg:hidden fixed inset-0 bg-black/50 z-40"
                      onClick={() => setShowMobileSidebar(false)}
                    />
                    <div className="lg:hidden fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out">
                      <LeftNavSidebar 
                        activeSection={activeSection} 
                        onSectionChange={(section) => {
                          setActiveSection(section);
                          setShowMobileSidebar(false);
                          // If user clicks Studio in sidebar, switch to studio view
                          if (section === 'studio') {
                            setActiveView('studio');
                          }
                        }} 
                      />
                    </div>
                  </>
                )}
                
                {/* Main Content Area */}
                {activeSection === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
                {activeSection === 'my-videos' && <MyVideosPage onNavigate={handleNavigate} />}
                {activeSection === 'analytics' && <AnalyticsPage onNavigate={handleNavigate} />}
                {activeSection === 'edit-history' && <EditHistoryPage onNavigate={handleNavigate} />}
                {activeSection === 'collaboration' && <CollaborationPage onNavigate={handleNavigate} />}
                {activeSection === 'api' && <APIPage onNavigate={handleNavigate} />}
                {activeSection === 'upgrade' && <UpgradePage onNavigate={handleNavigate} />}
                {activeSection === 'settings' && <SettingsPage onNavigate={handleNavigate} />}
                {activeSection === 'help' && <HelpPage onNavigate={handleNavigate} />}
              </div>
            </>
          )}
        </div>
      )}
      
      {/* Toast Notifications */}
      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}