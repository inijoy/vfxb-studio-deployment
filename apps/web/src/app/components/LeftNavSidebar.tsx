import { Home, Film, Sparkles, BarChart3, Clock, Users, Plug, Gem, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/auth';

interface LeftNavSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function LeftNavSidebar({ activeSection, onSectionChange }: LeftNavSidebarProps) {
  // Grab user and logout functionality from auth store
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut || s.logout);

  const workspaceItems =[
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'my-videos', label: 'My Videos', icon: Film },
    { id: 'studio', label: 'Studio', icon: Sparkles },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'edit-history', label: 'Edit History', icon: Clock },
    { id: 'collaboration', label: 'Collaboration', icon: Users },
    { id: 'api', label: 'API & Integrations', icon: Plug }
  ];

  const accountItems =[
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

      {/* User Card / Log Out Button */}
      <button 
        onClick={async () => {
          if (signOut) {
            await signOut(); // Clear the user data
          }
          window.location.reload(); // <--- THIS KICKS THEM BACK TO THE LOGIN SCREEN!
        }}
        className="mt-auto p-2.5 rounded-lg border flex items-center gap-2 w-full text-left transition-colors group cursor-pointer"
        style={{
          backgroundColor: '#111',
          borderColor: '#1A1A1A'
        }}
        title="Log out"
      >
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 group-hover:bg-red-500 transition-colors"
          style={{ backgroundColor: '#0A84FF' }}
        >
          <span className="group-hover:hidden">
            {user?.name ? user.name.charAt(0).toUpperCase() : ''}
          </span>
          <LogOut size={14} className="hidden group-hover:block" />
        </div>
        <div className="flex-1 min-w-0">
          <div 
            className="text-xs font-semibold truncate group-hover:text-red-400 transition-colors"
            style={{ color: 'white', fontFamily: 'DM Sans, sans-serif' }}
          >
            {/* FIXED: No more "Creator Name" glitch! */}
            {user?.name || 'Logging out...'}
          </div>
          <div 
            className="text-[10px] group-hover:text-red-500 transition-colors"
            style={{ color: '#444', fontFamily: 'DM Sans, sans-serif' }}
          >
            <span className="group-hover:hidden">Free Plan</span>
            <span className="hidden group-hover:block">Log Out</span>
          </div>
        </div>
      </button>
    </div>
  );
}