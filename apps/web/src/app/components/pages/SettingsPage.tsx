import { User, Bell, Shield, Palette, Video, Zap } from 'lucide-react';

interface SettingsPageProps {
  onNavigate?: (section: string) => void;
}

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const sections = [
    {
      icon: User,
      title: 'Profile',
      description: 'Manage your account information',
      settings: [
        { label: 'Display Name', value: 'Creator Name', type: 'input' },
        { label: 'Email', value: 'creator@example.com', type: 'input' },
        { label: 'Profile Picture', value: 'Change', type: 'button' }
      ]
    },
    {
      icon: Video,
      title: 'Default Video Settings',
      description: 'Set your preferred defaults for new videos',
      settings: [
        { label: 'Export Quality', value: '1080p', type: 'select', options: ['720p', '1080p', '4K'] },
        { label: 'Default Platform', value: 'YouTube', type: 'select', options: ['YouTube', 'TikTok', 'Instagram'] },
        { label: 'Auto-save', value: true, type: 'toggle' }
      ]
    },
    {
      icon: Zap,
      title: 'AI Director Preferences',
      description: 'Customize how the AI assists you',
      settings: [
        { label: 'Creativity Level', value: 'Balanced', type: 'select', options: ['Conservative', 'Balanced', 'Experimental'] },
        { label: 'Auto-apply suggestions', value: false, type: 'toggle' },
        { label: 'Show AI explanations', value: true, type: 'toggle' }
      ]
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Manage your notification preferences',
      settings: [
        { label: 'Email notifications', value: true, type: 'toggle' },
        { label: 'Video processing complete', value: true, type: 'toggle' },
        { label: 'Weekly performance report', value: false, type: 'toggle' }
      ]
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Control your privacy settings',
      settings: [
        { label: 'Two-factor authentication', value: false, type: 'toggle' },
        { label: 'Make profile public', value: false, type: 'toggle' },
        { label: 'Change Password', value: 'Update', type: 'button' }
      ]
    },
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Customize your workspace',
      settings: [
        { label: 'Theme', value: 'Dark', type: 'select', options: ['Dark', 'Light', 'Auto'] },
        { label: 'Accent Color', value: 'Blue', type: 'select', options: ['Blue', 'Purple', 'Green'] }
      ]
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8" style={{ backgroundColor: '#070707' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 
          className="text-2xl font-bold mb-1"
          style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
        >
          Settings
        </h1>
        <p className="text-sm" style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>
          Manage your account and preferences
        </p>
      </div>

      {/* Settings Sections */}
      <div className="max-w-4xl space-y-6">
        {sections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <div
              key={idx}
              className="rounded-xl border p-6"
              style={{
                backgroundColor: '#0E0E0E',
                borderColor: '#1A1A1A'
              }}
            >
              {/* Section Header */}
              <div className="flex items-start gap-3 mb-5">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#1A1A1A' }}
                >
                  <Icon size={18} style={{ color: '#0A84FF' }} />
                </div>
                <div>
                  <h3 
                    className="text-base font-bold mb-1"
                    style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
                  >
                    {section.title}
                  </h3>
                  <p 
                    className="text-xs"
                    style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {section.description}
                  </p>
                </div>
              </div>

              {/* Settings Items */}
              <div className="space-y-4">
                {section.settings.map((setting, sIdx) => (
                  <div key={sIdx} className="flex items-center justify-between">
                    <div>
                      <div 
                        className="text-sm font-medium mb-0.5"
                        style={{ color: 'white', fontFamily: 'DM Sans, sans-serif' }}
                      >
                        {setting.label}
                      </div>
                    </div>

                    {/* Input Type */}
                    {setting.type === 'input' && (
                      <input
                        type="text"
                        defaultValue={setting.value}
                        className="px-3 py-2 rounded-lg border text-sm outline-none focus:border-[#0A84FF]"
                        style={{
                          backgroundColor: '#0A0A0A',
                          borderColor: '#1A1A1A',
                          color: 'white',
                          fontFamily: 'DM Sans, sans-serif',
                          width: '300px'
                        }}
                      />
                    )}

                    {setting.type === 'select' && (
                      <select
                        defaultValue={setting.value}
                        className="px-3 py-2 rounded-lg border text-sm outline-none focus:border-[#0A84FF]"
                        style={{
                          backgroundColor: '#0A0A0A',
                          borderColor: '#1A1A1A',
                          color: 'white',
                          fontFamily: 'DM Sans, sans-serif',
                          width: '200px'
                        }}
                      >
                        {setting.options?.map((option, oIdx) => (
                          <option key={oIdx} value={option}>{option}</option>
                        ))}
                      </select>
                    )}

                    {setting.type === 'toggle' && (
                      <button
                        className="relative w-12 h-6 rounded-full transition-all"
                        style={{
                          backgroundColor: setting.value ? '#0A84FF' : '#1A1A1A'
                        }}
                      >
                        <div
                          className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                          style={{
                            left: setting.value ? '26px' : '2px'
                          }}
                        />
                      </button>
                    )}

                    {setting.type === 'button' && (
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                          backgroundColor: '#1A1A1A',
                          color: '#0A84FF',
                          fontFamily: 'DM Sans, sans-serif'
                        }}
                      >
                        {setting.value}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Danger Zone */}
      <div className="max-w-4xl mt-8">
        <div
          className="rounded-xl border p-6"
          style={{
            backgroundColor: '#0E0E0E',
            borderColor: '#FF3B30'
          }}
        >
          <h3 
            className="text-base font-bold mb-3"
            style={{ fontFamily: 'Syne, sans-serif', color: '#FF3B30' }}
          >
            Danger Zone
          </h3>
          <p 
            className="text-sm mb-4"
            style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}
          >
            These actions are irreversible. Please be careful.
          </p>
          <div className="space-y-3">
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium border transition-all"
              style={{
                borderColor: '#FF3B30',
                color: '#FF3B30',
                fontFamily: 'DM Sans, sans-serif',
                backgroundColor: 'transparent'
              }}
            >
              Delete All Videos
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium border transition-all ml-3"
              style={{
                borderColor: '#FF3B30',
                color: '#FF3B30',
                fontFamily: 'DM Sans, sans-serif',
                backgroundColor: 'transparent'
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}