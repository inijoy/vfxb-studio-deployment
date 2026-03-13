import { Key, Code, Zap, Copy, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface APIPageProps {
  onNavigate?: (section: string) => void;
}

export function APIPage({ onNavigate }: APIPageProps) {
  const [showKey, setShowKey] = useState(false);
  
  const apiKeys = [
    { name: 'Production Key', key: 'vfxb_prod_a1b2c3d4e5f6g7h8i9j0', created: '2 weeks ago', lastUsed: '2 mins ago', requests: '1.2K' },
    { name: 'Development Key', key: 'vfxb_dev_x9y8z7w6v5u4t3s2r1q0', created: '1 month ago', lastUsed: '3 days ago', requests: '342' },
  ];

  const webhooks = [
    { name: 'Video Processing Complete', url: 'https://myapp.com/webhooks/video-complete', status: 'active', events: 42 },
    { name: 'Export Ready', url: 'https://myapp.com/webhooks/export', status: 'active', events: 18 },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8" style={{ backgroundColor: '#070707' }}>
      {/* Header */}
      <div className="mb-6">
        <h1 
          className="text-2xl font-bold mb-1"
          style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
        >
          API & Integrations
        </h1>
        <p className="text-sm" style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>
          Connect VFXB to your tools and workflows
        </p>
      </div>

      {/* Upgrade Notice */}
      <div
        className="p-5 rounded-xl border mb-8 flex items-start gap-4"
        style={{
          backgroundColor: 'rgba(10, 132, 255, 0.05)',
          borderColor: 'rgba(10, 132, 255, 0.2)'
        }}
      >
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(10, 132, 255, 0.15)' }}
        >
          <Zap size={20} style={{ color: '#0A84FF' }} />
        </div>
        <div className="flex-1">
          <h3 
            className="text-sm font-bold mb-1"
            style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
          >
            API Access is an Agency Feature
          </h3>
          <p 
            className="text-xs mb-3"
            style={{ color: '#AAA', fontFamily: 'DM Sans, sans-serif' }}
          >
            Upgrade to Agency plan to access the VFXB API and build custom integrations.
          </p>
          <button
            className="px-4 py-2 rounded-lg text-xs font-semibold"
            style={{
              backgroundColor: '#0A84FF',
              color: 'white',
              fontFamily: 'Syne, sans-serif'
            }}
          >
            Upgrade to Agency
          </button>
        </div>
      </div>

      {/* API Keys */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 
            className="text-base font-bold"
            style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
          >
            API Keys
          </h2>
          <button
            disabled
            className="px-4 py-2 rounded-lg text-sm font-semibold opacity-50"
            style={{
              backgroundColor: '#1A1A1A',
              color: '#666',
              fontFamily: 'Syne, sans-serif'
            }}
          >
            + Create New Key
          </button>
        </div>
        <div className="space-y-3">
          {apiKeys.map((key, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: '#0E0E0E',
                borderColor: '#1A1A1A'
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div 
                    className="text-sm font-semibold mb-1"
                    style={{ color: 'white', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {key.name}
                  </div>
                  <div 
                    className="text-xs mb-2"
                    style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    Created {key.created} • Last used {key.lastUsed}
                  </div>
                </div>
                <button
                  className="text-xs hover:text-[#FF3B30]"
                  style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}
                >
                  Revoke
                </button>
              </div>

              <div 
                className="flex items-center gap-2 p-3 rounded border"
                style={{
                  backgroundColor: '#0A0A0A',
                  borderColor: '#1A1A1A'
                }}
              >
                <Key size={14} style={{ color: '#666' }} />
                <code 
                  className="flex-1 text-xs"
                  style={{ 
                    color: '#888',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}
                >
                  {showKey ? key.key : '••••••••••••••••••••••••••••••••'}
                </code>
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="p-1 hover:bg-[#1A1A1A] rounded"
                >
                  {showKey ? <EyeOff size={14} style={{ color: '#666' }} /> : <Eye size={14} style={{ color: '#666' }} />}
                </button>
                <button className="p-1 hover:bg-[#1A1A1A] rounded">
                  <Copy size={14} style={{ color: '#666' }} />
                </button>
              </div>

              <div className="mt-3 flex items-center gap-4">
                <div 
                  className="text-xs"
                  style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}
                >
                  <span style={{ color: '#0A84FF', fontWeight: 600 }}>{key.requests}</span> requests this month
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Webhooks */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 
            className="text-base font-bold"
            style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
          >
            Webhooks
          </h2>
          <button
            disabled
            className="px-4 py-2 rounded-lg text-sm font-semibold opacity-50"
            style={{
              backgroundColor: '#1A1A1A',
              color: '#666',
              fontFamily: 'Syne, sans-serif'
            }}
          >
            + Add Webhook
          </button>
        </div>
        <div className="space-y-3">
          {webhooks.map((webhook, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border flex items-center justify-between"
              style={{
                backgroundColor: '#0E0E0E',
                borderColor: '#1A1A1A'
              }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span 
                    className="text-sm font-semibold"
                    style={{ color: 'white', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {webhook.name}
                  </span>
                  <span 
                    className="px-2 py-0.5 rounded-full text-[10px]"
                    style={{
                      backgroundColor: 'rgba(48, 209, 88, 0.15)',
                      color: '#30D158',
                      fontFamily: 'DM Sans, sans-serif'
                    }}
                  >
                    {webhook.status}
                  </span>
                </div>
                <code 
                  className="text-xs block mb-1"
                  style={{ 
                    color: '#666',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}
                >
                  {webhook.url}
                </code>
                <div 
                  className="text-[10px]"
                  style={{ color: '#444', fontFamily: 'DM Sans, sans-serif' }}
                >
                  {webhook.events} events delivered
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1.5 rounded text-xs"
                  style={{
                    backgroundColor: '#1A1A1A',
                    color: '#AAA',
                    fontFamily: 'DM Sans, sans-serif'
                  }}
                >
                  Edit
                </button>
                <button
                  className="text-xs hover:text-[#FF3B30]"
                  style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documentation */}
      <div>
        <h2 
          className="text-base font-bold mb-4"
          style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
        >
          Quick Start
        </h2>
        <div
          className="p-5 rounded-xl border"
          style={{
            backgroundColor: '#0E0E0E',
            borderColor: '#1A1A1A'
          }}
        >
          <div className="flex items-start gap-3 mb-4">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#1A1A1A' }}
            >
              <Code size={18} style={{ color: '#0A84FF' }} />
            </div>
            <div>
              <h3 
                className="text-sm font-bold mb-1"
                style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
              >
                API Documentation
              </h3>
              <p 
                className="text-xs mb-3"
                style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}
              >
                Learn how to integrate VFXB into your workflow with our comprehensive API docs.
              </p>
            </div>
          </div>
          <button
            className="px-4 py-2 rounded-lg text-xs font-medium"
            style={{
              backgroundColor: '#1A1A1A',
              color: '#0A84FF',
              fontFamily: 'DM Sans, sans-serif'
            }}
          >
            View Documentation →
          </button>
        </div>
      </div>
    </div>
  );
}