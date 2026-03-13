import { X } from 'lucide-react';

interface FeaturesPanelProps {
  onClose: () => void;
}

export function FeaturesPanel({ onClose }: FeaturesPanelProps) {
  const features = [
    {
      tag: 'CORE FEATURE',
      tagBg: 'rgba(10,132,255,0.12)',
      tagColor: '#0A84FF',
      iconBg: 'rgba(10,132,255,0.1)',
      iconBorder: 'rgba(10,132,255,0.2)',
      emoji: '🧠',
      title: 'NLP Longform Director',
      body: 'Zero competitors. You talk, it edits a 2hr video — understanding full context, not just single clips.',
      metric: '0 competitors',
      metricColor: '#30D158'
    },
    {
      tag: 'PROPRIETARY',
      tagBg: 'rgba(255,214,10,0.1)',
      tagColor: '#FFD60A',
      iconBg: 'rgba(255,214,10,0.08)',
      iconBorder: 'rgba(255,214,10,0.15)',
      emoji: '🔥',
      title: 'Virality Intelligence Engine',
      body: 'Proprietary score from 100M+ video dataset. A defensible moat no competitor can replicate fast.',
      metric: '100M+ videos analyzed',
      metricColor: '#FFD60A'
    },
    {
      tag: 'COMING SOON',
      tagBg: 'rgba(255,255,255,0.05)',
      tagColor: '#666',
      iconBg: 'rgba(255,255,255,0.04)',
      iconBorder: 'rgba(255,255,255,0.08)',
      emoji: '🤖',
      title: 'Autonomous Publishing Agent',
      body: 'Upload → Edit → Publish to all platforms. Zero clicks after you set your goal.',
      metric: '6 platforms · 0 clicks',
      metricColor: '#888'
    },
    {
      tag: 'BETA',
      tagBg: 'rgba(0,210,255,0.08)',
      tagColor: '#00D4FF',
      iconBg: 'rgba(0,210,255,0.06)',
      iconBorder: 'rgba(0,210,255,0.12)',
      emoji: '🧬',
      title: 'Creator DNA Memory',
      body: 'AI learns your style, voice, and pacing over time. Every edit feels authentically you.',
      metric: 'Learns after 3 videos',
      metricColor: '#00D4FF'
    },
    {
      tag: 'COMING SOON',
      tagBg: 'rgba(255,255,255,0.05)',
      tagColor: '#666',
      iconBg: 'rgba(255,255,255,0.04)',
      iconBorder: 'rgba(255,255,255,0.08)',
      emoji: '👥',
      title: 'Real-Time Collaboration',
      body: 'Teams edit the same video via chat simultaneously. AI resolves conflicts automatically.',
      metric: 'Unlimited collaborators',
      metricColor: '#888'
    },
    {
      tag: 'CORE FEATURE',
      tagBg: 'rgba(10,132,255,0.12)',
      tagColor: '#0A84FF',
      iconBg: 'rgba(10,132,255,0.1)',
      iconBorder: 'rgba(10,132,255,0.2)',
      emoji: '📱',
      title: 'Platform-Specific AI',
      body: 'One video → auto-optimized for YouTube, TikTok, Instagram, LinkedIn, X, and Shorts.',
      metric: '6 platforms, 1 click',
      metricColor: '#0A84FF'
    },
    {
      tag: 'PROPRIETARY',
      tagBg: 'rgba(255,214,10,0.1)',
      tagColor: '#FFD60A',
      iconBg: 'rgba(255,214,10,0.08)',
      iconBorder: 'rgba(255,214,10,0.15)',
      emoji: '📊',
      title: 'Audience Simulation',
      body: 'See your predicted retention curve BEFORE publishing. Know exactly when you\'ll lose viewers.',
      metric: 'Predict before publish',
      metricColor: '#FFD60A',
      showSparkline: true
    },
    {
      tag: 'ENTERPRISE',
      tagBg: 'rgba(48,209,88,0.08)',
      tagColor: '#30D158',
      iconBg: 'rgba(48,209,88,0.06)',
      iconBorder: 'rgba(48,209,88,0.12)',
      emoji: '🔌',
      title: 'Enterprise API',
      body: 'Studios and agencies plug VFXB directly into their workflow. White-label available.',
      metric: 'REST API · White-label',
      metricColor: '#30D158'
    }
  ];

  const comparisonRows = [
    { feature: 'Talk to Edit', vfxb: true, adobe: false, descript: false, capcut: false, runway: false },
    { feature: 'Longform NLP', vfxb: true, adobe: false, descript: false, capcut: false, runway: false },
    { feature: 'Virality Score', vfxb: true, adobe: false, descript: false, capcut: false, runway: false },
    { feature: 'Auto-Publish', vfxb: true, adobe: false, descript: false, capcut: true, runway: false },
    { feature: 'Creator Memory', vfxb: true, adobe: false, descript: false, capcut: false, runway: false },
    { feature: 'Audience Simulation', vfxb: true, adobe: false, descript: false, capcut: false, runway: false },
    { feature: 'Multi-platform', vfxb: true, adobe: false, descript: false, capcut: true, runway: false },
    { feature: 'Enterprise API', vfxb: true, adobe: true, descript: false, capcut: false, runway: true }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto animate-slideUp"
      style={{ 
        backgroundColor: '#070707',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.02\' /%3E%3C/svg%3E")'
      }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#0A84FF]/10 transition-all z-10"
        style={{ border: '1px solid #1E1E1E' }}
      >
        <X size={20} className="text-[#666] hover:text-white transition-colors" />
      </button>

      {/* Content */}
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Top Section */}
        <div className="text-center pt-[60px]">
          <div 
            className="text-[10px] font-semibold tracking-[3px] uppercase"
            style={{ 
              fontFamily: 'DM Sans, sans-serif',
              color: '#0A84FF',
              fontWeight: 600
            }}
          >
            WHY VFXB
          </div>
          
          <h1 
            className="text-[40px] font-bold mt-[10px]"
            style={{ 
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              color: 'white'
            }}
          >
            Nobody does what we do.
          </h1>

          <p 
            className="text-[15px] mt-2"
            style={{ 
              fontFamily: 'DM Sans, sans-serif',
              color: '#555'
            }}
          >
            8 features. Zero competitors.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-4 gap-4 mt-12">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 rounded-[14px] border transition-all duration-200 hover:-translate-y-0.5 group"
              style={{
                backgroundColor: '#0C0C0C',
                borderColor: '#1A1A1A'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0A84FF';
                e.currentTarget.style.boxShadow = '0 0 28px rgba(10,132,255,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#1A1A1A';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Tag */}
              <div
                className="inline-block text-[9px] px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: feature.tagBg,
                  color: feature.tagColor,
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600
                }}
              >
                {feature.tag}
              </div>

              {/* Icon */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mt-5 border"
                style={{
                  backgroundColor: feature.iconBg,
                  borderColor: feature.iconBorder
                }}
              >
                <span className="text-base">{feature.emoji}</span>
              </div>

              {/* Title */}
              <h3
                className="text-base mt-3.5"
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  color: 'white'
                }}
              >
                {feature.title}
              </h3>

              {/* Body */}
              <p
                className="text-xs mt-2 leading-relaxed"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  color: '#555',
                  lineHeight: 1.6
                }}
              >
                {feature.body}
              </p>

              {/* Sparkline for Audience Simulation */}
              {feature.showSparkline && (
                <div className="mt-4">
                  <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
                    <path
                      d="M 0 20 L 10 18 L 20 12 L 30 8 L 40 14 L 50 10 L 60 4"
                      stroke="#0A84FF"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}

              {/* Metric */}
              <div
                className="inline-block text-[10px] px-2 py-1 rounded mt-4 border"
                style={{
                  backgroundColor: '#111',
                  borderColor: '#1E1E1E',
                  color: feature.metricColor,
                  fontFamily: 'JetBrains Mono, monospace'
                }}
              >
                {feature.metric}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button
            className="text-base px-9 py-3.5 rounded-[10px] transition-all hover:scale-105"
            style={{
              backgroundColor: '#0A84FF',
              color: 'white',
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(10,132,255,0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 32px rgba(10,132,255,0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(10,132,255,0.2)';
            }}
          >
            Start for Free →
          </button>

          <p
            className="text-[11px] mt-3.5"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#333'
            }}
          >
            No credit card · Free 3 videos/month
          </p>
        </div>

        {/* Comparison Table */}
        <div className="mt-[60px] pb-[60px]">
          <h2
            className="text-lg text-center mb-6"
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              color: 'white'
            }}
          >
            How we compare
          </h2>

          <div
            className="max-w-[860px] mx-auto rounded-[14px] border overflow-hidden"
            style={{
              backgroundColor: '#0A0A0A',
              borderColor: '#1A1A1A'
            }}
          >
            {/* Header */}
            <div
              className="grid grid-cols-6 h-12"
              style={{ backgroundColor: '#0E0E0E' }}
            >
              <div className="flex items-center px-4">
                <span
                  className="text-xs"
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    color: '#888'
                  }}
                >
                  Feature
                </span>
              </div>
              <div
                className="flex items-center justify-center"
                style={{ backgroundColor: '#0A84FF' }}
              >
                <span
                  className="text-xs font-bold"
                  style={{
                    fontFamily: 'Syne, sans-serif',
                    color: 'white'
                  }}
                >
                  VFXB
                </span>
              </div>
              {['Adobe', 'Descript', 'CapCut', 'Runway'].map((name) => (
                <div key={name} className="flex items-center justify-center">
                  <span
                    className="text-xs"
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      color: '#888'
                    }}
                  >
                    {name}
                  </span>
                </div>
              ))}
            </div>

            {/* Rows */}
            {comparisonRows.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-6 h-10 border-t"
                style={{
                  borderColor: '#111',
                  backgroundColor: idx % 2 === 0 ? '#0C0C0C' : '#0A0A0A'
                }}
              >
                <div className="flex items-center px-4">
                  <span
                    className="text-xs"
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      color: '#888'
                    }}
                  >
                    {row.feature}
                  </span>
                </div>
                
                {/* VFXB Column */}
                <div
                  className="flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(10,132,255,0.05)' }}
                >
                  {row.vfxb ? (
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: '#30D158' }}
                    />
                  ) : (
                    <div
                      className="w-3.5 h-3.5 rounded-full border"
                      style={{
                        backgroundColor: '#1A1A1A',
                        borderColor: '#2A2A2A'
                      }}
                    />
                  )}
                </div>

                {/* Other Columns */}
                {[row.adobe, row.descript, row.capcut, row.runway].map((value, colIdx) => (
                  <div key={colIdx} className="flex items-center justify-center">
                    {value ? (
                      <div
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: '#30D158' }}
                      />
                    ) : (
                      <div
                        className="w-3.5 h-3.5 rounded-full border"
                        style={{
                          backgroundColor: '#1A1A1A',
                          borderColor: '#2A2A2A'
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <p
            className="text-[13px] text-center mt-3 italic"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#444'
            }}
          >
            VFXB is the only platform where a creator says 'edit and post this' — and walks away.
          </p>
        </div>
      </div>
    </div>
  );
}
