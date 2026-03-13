import { Home, Film, Sparkles, BarChart3, Clock, Users, Plug, Gem, Settings, HelpCircle } from 'lucide-react';

interface LeftNavSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function LeftNavSidebar({ activeSection, onSectionChange }: LeftNavSidebarProps) {
  const workspaceItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'my-videos', label: 'My Videos', icon: Film },
    { id: 'studio', label: 'Studio', icon: Sparkles },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'edit-history', label: 'Edit History', icon: Clock },
    { id: 'collaboration', label: 'Collaboration', icon: Users },
    { id: 'api', label: 'API & Integrations', icon: Plug }
  ];

  const accountItems = [
    { id: 'upgrade', label: 'Upgrade Plan', icon: Gem },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Docs', icon: HelpCircle }
  ];

  return (
    <div 
      className="w-[220px] h-full border-r flex flex-col p-3"
      style={{
        backgroundColor: '#0A0A0A',
        borderColor: '#1A1A1A'
      }}
    >
      {/* Logo */}
      <div className="px-2 pt-5 pb-6">
        <div 
          className="text-lg font-bold"
          style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
        >
          VFXB
        </div>
      </div>

      {/* Workspace Section */}
      <div className="mb-6">
        <div 
          className="px-2 py-1.5 mb-1.5 text-[9px] uppercase tracking-widest"
          style={{ color: '#333', fontFamily: 'DM Sans, sans-serif' }}
        >
          WORKSPACE
        </div>
        <div className="space-y-0.5">
          {workspaceItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs transition-all relative ${
                  isActive ? 'text-white' : 'text-[#555] hover:bg-[#111] hover:text-white'
                }`}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {isActive && (
                  <div 
                    className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r"
                    style={{ backgroundColor: '#0A84FF' }}
                  />
                )}
                <div 
                  className={`flex items-center justify-center w-5 h-5 rounded ${
                    isActive ? 'bg-[rgba(10,132,255,0.1)]' : ''
                  }`}
                >
                  <Icon size={14} />
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Account Section */}
      <div className="mb-4">
        <div 
          className="px-2 py-1.5 mb-1.5 text-[9px] uppercase tracking-widest"
          style={{ color: '#333', fontFamily: 'DM Sans, sans-serif' }}
        >
          ACCOUNT
        </div>
        <div className="space-y-0.5">
          {accountItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs transition-all ${
                  isActive ? 'text-white' : 'text-[#555] hover:bg-[#111] hover:text-white'
                }`}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                <div className="flex items-center justify-center w-5 h-5">
                  <Icon size={14} />
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* User Card */}
      <div 
        className="mt-auto p-2.5 rounded-lg border flex items-center gap-2"
        style={{
          backgroundColor: '#111',
          borderColor: '#1A1A1A'
        }}
      >
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
          style={{ backgroundColor: '#0A84FF' }}
        >
          C
        </div>
        <div className="flex-1 min-w-0">
          <div 
            className="text-xs font-semibold truncate"
            style={{ color: 'white', fontFamily: 'DM Sans, sans-serif' }}
          >
            Creator Name
          </div>
          <div 
            className="text-[10px]"
            style={{ color: '#444', fontFamily: 'DM Sans, sans-serif' }}
          >
            Free Plan
          </div>
        </div>
        <button
          className="px-2 py-1 rounded-full text-[10px] font-medium transition-all"
          style={{
            backgroundColor: 'rgba(10, 132, 255, 0.15)',
            color: '#0A84FF',
            fontFamily: 'DM Sans, sans-serif'
          }}
        >
          ⬆
        </button>
      </div>
    </div>
  );
}
