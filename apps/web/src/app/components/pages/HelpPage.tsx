import { Book, MessageCircle, Video, FileText, ExternalLink } from 'lucide-react';

interface HelpPageProps {
  onNavigate?: (section: string) => void;
}

export function HelpPage({ onNavigate }: HelpPageProps) {
  const resources = [
    {
      icon: Book,
      title: 'Documentation',
      description: 'Complete guides and tutorials',
      link: 'View Docs',
      color: '#0A84FF'
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Learn VFXB with video walkthroughs',
      link: 'Watch Now',
      color: '#30D158'
    },
    {
      icon: MessageCircle,
      title: 'Community Forum',
      description: 'Get help from other creators',
      link: 'Join Forum',
      color: '#FFD60A'
    },
    {
      icon: FileText,
      title: 'Blog & Updates',
      description: 'Latest features and best practices',
      link: 'Read Blog',
      color: '#FF3B30'
    }
  ];

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        { q: 'How do I upload my first video?', a: 'Click the "New Video" button and drag & drop your file, or paste a link from YouTube, Drive, or Dropbox.' },
        { q: 'What video formats are supported?', a: 'We support mp4, mov, webm, and avi files up to 10GB.' },
      ]
    },
    {
      category: 'AI Features',
      questions: [
        { q: 'How does the Virality Score work?', a: 'Our AI analyzes 50+ factors including hook strength, pacing, retention patterns, and platform trends to predict video performance.' },
        { q: 'Can I customize AI suggestions?', a: 'Yes! In Settings > AI Director, you can adjust creativity level and preferences.' },
      ]
    },
    {
      category: 'Billing',
      questions: [
        { q: 'Can I cancel my subscription?', a: 'Yes, you can cancel anytime. Your access continues until the end of your billing period.' },
        { q: 'Do you offer refunds?', a: 'We offer a 14-day money-back guarantee for all paid plans.' },
      ]
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8" style={{ backgroundColor: '#070707' }}>
      {/* Header */}
      <div className="text-center mb-12">
        <h1 
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
        >
          How can we help you?
        </h1>
        <p className="text-base mb-6" style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>
          Find answers, guides, and support resources
        </p>

        {/* Search */}
        <div 
          className="max-w-xl mx-auto flex items-center gap-3 px-5 py-3 rounded-xl border"
          style={{
            backgroundColor: '#0E0E0E',
            borderColor: '#1A1A1A'
          }}
        >
          <input
            type="text"
            placeholder="Search for help..."
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-[#444]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          />
          <button
            className="px-4 py-2 rounded-lg text-xs font-semibold"
            style={{
              backgroundColor: '#0A84FF',
              color: 'white',
              fontFamily: 'Syne, sans-serif'
            }}
          >
            Search
          </button>
        </div>
      </div>

      {/* Quick Resources */}
      <div className="grid grid-cols-4 gap-4 mb-12">
        {resources.map((resource, idx) => {
          const Icon = resource.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-xl border cursor-pointer hover:border-[#0A84FF] transition-all"
              style={{
                backgroundColor: '#0E0E0E',
                borderColor: '#1A1A1A'
              }}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${resource.color}15` }}
              >
                <Icon size={24} style={{ color: resource.color }} />
              </div>
              <h3 
                className="text-sm font-bold mb-1"
                style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
              >
                {resource.title}
              </h3>
              <p 
                className="text-xs mb-3"
                style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}
              >
                {resource.description}
              </p>
              <div 
                className="text-xs font-medium flex items-center gap-1"
                style={{ color: resource.color, fontFamily: 'DM Sans, sans-serif' }}
              >
                {resource.link}
                <ExternalLink size={12} />
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQs */}
      <div className="max-w-4xl mx-auto">
        <h2 
          className="text-xl font-bold mb-6"
          style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
        >
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {faqs.map((category, idx) => (
            <div key={idx}>
              <h3 
                className="text-sm font-bold mb-3"
                style={{ fontFamily: 'Syne, sans-serif', color: '#0A84FF' }}
              >
                {category.category}
              </h3>
              <div className="space-y-3">
                {category.questions.map((faq, qIdx) => (
                  <div
                    key={qIdx}
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: '#0E0E0E',
                      borderColor: '#1A1A1A'
                    }}
                  >
                    <div 
                      className="text-sm font-semibold mb-2"
                      style={{ color: 'white', fontFamily: 'DM Sans, sans-serif' }}
                    >
                      {faq.q}
                    </div>
                    <div 
                      className="text-sm"
                      style={{ color: '#888', fontFamily: 'DM Sans, sans-serif' }}
                    >
                      {faq.a}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="max-w-4xl mx-auto mt-12">
        <div
          className="p-6 rounded-xl border text-center"
          style={{
            backgroundColor: '#0E0E0E',
            borderColor: '#1A1A1A'
          }}
        >
          <h3 
            className="text-lg font-bold mb-2"
            style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
          >
            Still need help?
          </h3>
          <p 
            className="text-sm mb-4"
            style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}
          >
            Our support team is here to help you 24/7
          </p>
          <div className="flex justify-center gap-3">
            <button
              className="px-5 py-2.5 rounded-lg font-semibold text-sm"
              style={{
                backgroundColor: '#0A84FF',
                color: 'white',
                fontFamily: 'Syne, sans-serif'
              }}
            >
              Contact Support
            </button>
            <button
              className="px-5 py-2.5 rounded-lg font-semibold text-sm border"
              style={{
                backgroundColor: 'transparent',
                borderColor: '#1A1A1A',
                color: '#AAA',
                fontFamily: 'Syne, sans-serif'
              }}
            >
              Schedule a Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}