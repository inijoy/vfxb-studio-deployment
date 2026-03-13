import { X, Bell, Globe, Palette, Zap, Mic, Shield, HardDrive } from 'lucide-react';
import { useState } from 'react';

interface SettingsPanelProps {
  onClose: () => void;
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [voiceCommands, setVoiceCommands] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedTheme, setSelectedTheme] = useState('Dark');

  const settingSections = [
    {
      title: 'General',
      icon: Globe,
      settings: [
        { 
          label: 'Language', 
          type: 'select', 
          value: selectedLanguage,
          options: ['English', 'Spanish', 'French', 'German', 'Japanese'],
          onChange: setSelectedLanguage
        },
        { 
          label: 'Theme', 
          type: 'select', 
          value: selectedTheme,
          options: ['Dark', 'Light', 'Auto'],
          onChange: setSelectedTheme
        }
      ]
    },
    {
      title: 'AI Features',
      icon: Zap,
      settings: [
        { 
          label: 'Voice Commands', 
          type: 'toggle', 
          value: voiceCommands,
          onChange: setVoiceCommands,
          description: 'Enable voice control for hands-free editing'
        },
        { 
          label: 'Auto-suggestions', 
          type: 'toggle', 
          value: true,
          onChange: () => {},
          description: 'Get real-time AI recommendations'
        }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        { 
          label: 'Enable Notifications', 
          type: 'toggle', 
          value: enableNotifications,
          onChange: setEnableNotifications
        },
        { 
          label: 'Export Complete', 
          type: 'toggle', 
          value: true,
          onChange: () => {}
        }
      ]
    },
    {
      title: 'Storage',
      icon: HardDrive,
      settings: [
        { 
          label: 'Auto-save', 
          type: 'toggle', 
          value: autoSave,
          onChange: setAutoSave,
          description: 'Automatically save your work every 2 minutes'
        }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>

      {/* Settings Panel */}
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border"
        style={{
          backgroundColor: '#0A0A0A',
          borderColor: '#1E1E1E',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="h-16 px-6 flex items-center justify-between border-b"
          style={{ 
            borderColor: '#1A1A1A',
            background: 'linear-gradient(180deg, #0C0C0C 0%, #0A0A0A 100%)'
          }}
        >
          <div>
            <h2 
              className="text-white text-lg font-bold"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Settings
            </h2>
            <p className="text-[#666] text-xs">Customize your VFXB experience</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center hover:bg-[#141414] rounded-lg transition-colors"
          >
            <X size={18} className="text-[#666] hover:text-white transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-64px)] p-6">
          <div className="space-y-6">
            {settingSections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                {/* Section Header */}
                <div className="flex items-center gap-2 mb-4">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #0A84FF 0%, #00D4FF 100%)',
                      boxShadow: '0 0 16px rgba(10,132,255,0.3)'
                    }}
                  >
                    <section.icon size={16} className="text-white" />
                  </div>
                  <h3 
                    className="text-white font-semibold"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    {section.title}
                  </h3>
                </div>

                {/* Settings */}
                <div className="space-y-3 ml-10">
                  {section.settings.map((setting, settingIdx) => (
                    <div 
                      key={settingIdx}
                      className="p-4 rounded-xl border"
                      style={{
                        background: 'linear-gradient(135deg, #0E0E0E 0%, #121212 100%)',
                        borderColor: '#1E1E1E'
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-white text-sm font-medium">
                          {setting.label}
                        </label>

                        {/* Toggle Switch */}
                        {setting.type === 'toggle' && (
                          <button
                            onClick={() => setting.onChange(!setting.value)}
                            className="relative w-12 h-6 rounded-full transition-all"
                            style={{
                              backgroundColor: setting.value ? '#0A84FF' : '#2A2A2A'
                            }}
                          >
                            <div
                              className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform"
                              style={{
                                transform: setting.value ? 'translateX(24px)' : 'translateX(0)'
                              }}
                            ></div>
                          </button>
                        )}

                        {/* Select Dropdown */}
                        {setting.type === 'select' && (
                          <select
                            value={setting.value}
                            onChange={(e) => setting.onChange(e.target.value)}
                            className="px-3 py-1.5 rounded-lg border bg-[#0A0A0A] text-white text-sm outline-none transition-all"
                            style={{
                              borderColor: '#2A2A2A'
                            }}
                          >
                            {setting.options?.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      {/* Description */}
                      {setting.description && (
                        <p className="text-[#666] text-xs mt-1">
                          {setting.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Privacy Section */}
            <div className="pt-4 border-t" style={{ borderColor: '#1A1A1A' }}>
              <div className="flex items-center gap-2 mb-4">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #30D158 0%, #00D4FF 100%)',
                    boxShadow: '0 0 16px rgba(48,209,88,0.3)'
                  }}
                >
                  <Shield size={16} className="text-white" />
                </div>
                <h3 
                  className="text-white font-semibold"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  Privacy & Security
                </h3>
              </div>

              <div className="ml-10 space-y-3">
                <button 
                  className="w-full text-left p-4 rounded-xl border transition-all hover:border-[#0A84FF]"
                  style={{
                    background: 'linear-gradient(135deg, #0E0E0E 0%, #121212 100%)',
                    borderColor: '#1E1E1E'
                  }}
                >
                  <div className="text-white text-sm font-medium mb-1">Data Usage</div>
                  <div className="text-[#666] text-xs">Manage how your data is used</div>
                </button>

                <button 
                  className="w-full text-left p-4 rounded-xl border transition-all hover:border-[#0A84FF]"
                  style={{
                    background: 'linear-gradient(135deg, #0E0E0E 0%, #121212 100%)',
                    borderColor: '#1E1E1E'
                  }}
                >
                  <div className="text-white text-sm font-medium mb-1">Export Data</div>
                  <div className="text-[#666] text-xs">Download all your projects and settings</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div 
          className="h-16 px-6 flex items-center justify-between border-t"
          style={{ 
            borderColor: '#1A1A1A',
            backgroundColor: '#0A0A0A'
          }}
        >
          <div className="text-[#666] text-xs">
            VFXB v1.0.0
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(10,132,255,0.3)'
            }}
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}
