import { Check, Zap, Crown, Rocket, CreditCard, Lock } from 'lucide-react';
import { useState } from 'react';

interface UpgradePageProps {
  onNavigate?: (section: string) => void;
}

export function UpgradePage({ onNavigate }: UpgradePageProps) {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Free',
      price: '$0',
      yearlyPrice: '$0',
      period: 'forever',
      icon: '✦',
      current: true,
      features: [
        '5 videos per month',
        'Basic AI editing',
        '720p export',
        'Virality score',
        'Community support'
      ],
      limitations: [
        'No platform optimization',
        'No batch processing',
        'No API access'
      ]
    },
    {
      name: 'Pro',
      price: '$29',
      yearlyPrice: '$290',
      period: 'per month',
      icon: '⚡',
      popular: true,
      features: [
        'Unlimited videos',
        'Advanced AI director',
        '4K export',
        'Multi-platform optimization',
        'A/B testing',
        'Priority support',
        'Custom Creator DNA',
        'Audience simulation'
      ],
      cta: 'Upgrade to Pro'
    },
    {
      name: 'Agency',
      price: '$99',
      yearlyPrice: '$990',
      period: 'per month',
      icon: '👑',
      features: [
        'Everything in Pro',
        'Team collaboration (5 seats)',
        'White-label exports',
        'API access',
        'Custom workflows',
        'Dedicated account manager',
        'SLA guarantee',
        'Advanced analytics'
      ],
      cta: 'Contact Sales'
    }
  ];

  const handleUpgrade = (planName: string) => {
    setSelectedPlan(planName);
    setShowPayment(true);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8" style={{ backgroundColor: '#070707' }}>
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ backgroundColor: 'rgba(10, 132, 255, 0.1)' }}>
          <Crown size={32} style={{ color: '#0A84FF' }} />
        </div>
        <h1 
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
        >
          Upgrade Your Plan
        </h1>
        <p className="text-base" style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}>
          Unlock the full power of AI video editing
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className="rounded-2xl border p-6 relative"
            style={{
              backgroundColor: plan.popular ? '#0E0E0E' : '#0A0A0A',
              borderColor: plan.popular ? '#0A84FF' : '#1A1A1A',
              boxShadow: plan.popular ? '0 0 40px rgba(10, 132, 255, 0.2)' : 'none'
            }}
          >
            {plan.popular && (
              <div 
                className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: '#0A84FF',
                  color: 'white'
                }}
              >
                MOST POPULAR
              </div>
            )}

            {plan.current && (
              <div 
                className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: '#30D158',
                  color: 'white'
                }}
              >
                CURRENT PLAN
              </div>
            )}

            {/* Plan Icon */}
            <div className="text-4xl mb-3">{plan.icon}</div>

            {/* Plan Name */}
            <h3 
              className="text-xl font-bold mb-1"
              style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
            >
              {plan.name}
            </h3>

            {/* Price */}
            <div className="mb-6">
              <span 
                className="text-4xl font-bold"
                style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
              >
                {plan.price}
              </span>
              <span 
                className="text-sm ml-2"
                style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}
              >
                {plan.period}
              </span>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              {plan.features.map((feature, fIdx) => (
                <div key={fIdx} className="flex items-start gap-2">
                  <Check size={16} style={{ color: '#30D158', marginTop: '2px', flexShrink: 0 }} />
                  <span 
                    className="text-sm"
                    style={{ color: '#AAA', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {feature}
                  </span>
                </div>
              ))}
              {plan.limitations && plan.limitations.map((limitation, lIdx) => (
                <div key={`lim-${lIdx}`} className="flex items-start gap-2">
                  <div className="w-4 h-4 flex items-center justify-center" style={{ marginTop: '2px' }}>
                    <div className="w-2 h-0.5" style={{ backgroundColor: '#333' }}></div>
                  </div>
                  <span 
                    className="text-sm"
                    style={{ color: '#444', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {limitation}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            {plan.cta && (
              <button
                className="w-full py-3 rounded-lg font-semibold text-sm transition-all"
                style={{
                  backgroundColor: plan.popular ? '#0A84FF' : '#1A1A1A',
                  color: plan.popular ? 'white' : '#AAA',
                  fontFamily: 'Syne, sans-serif'
                }}
                onClick={() => handleUpgrade(plan.name)}
              >
                {plan.cta}
              </button>
            )}

            {plan.current && (
              <div 
                className="w-full py-3 rounded-lg font-semibold text-sm text-center"
                style={{
                  backgroundColor: '#1A1A1A',
                  color: '#666',
                  fontFamily: 'Syne, sans-serif'
                }}
              >
                Current Plan
              </div>
            )}
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 
          className="text-xl font-bold mb-6 text-center"
          style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
        >
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. No questions asked.' },
            { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and bank transfers for Agency plans.' },
            { q: 'Do you offer refunds?', a: 'We offer a 14-day money-back guarantee for all paid plans.' },
            { q: 'Can I switch plans later?', a: 'Absolutely! You can upgrade or downgrade your plan at any time.' }
          ].map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-lg border"
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
                style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}
              >
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
          onClick={() => setShowPayment(false)}
        >
          <div 
            className="rounded-2xl border max-w-lg w-full p-8"
            style={{
              backgroundColor: '#0E0E0E',
              borderColor: '#1A1A1A'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="text-center mb-6">
              <h2 
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
              >
                Complete Your Upgrade
              </h2>
              <p 
                className="text-sm"
                style={{ color: '#666', fontFamily: 'DM Sans, sans-serif' }}
              >
                Upgrading to {selectedPlan} Plan
              </p>
            </div>

            {/* Plan Summary */}
            <div 
              className="p-4 rounded-lg border mb-6"
              style={{
                backgroundColor: '#070707',
                borderColor: '#1A1A1A'
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span 
                  className="text-sm"
                  style={{ color: '#AAA', fontFamily: 'DM Sans, sans-serif' }}
                >
                  {selectedPlan} Plan (Monthly)
                </span>
                <span 
                  className="text-lg font-bold"
                  style={{ fontFamily: 'Syne, sans-serif', color: 'white' }}
                >
                  {selectedPlan === 'Pro' ? '$29' : '$99'}/mo
                </span>
              </div>
              <div 
                className="text-xs"
                style={{ color: '#444', fontFamily: 'DM Sans, sans-serif' }}
              >
                Billed monthly • Cancel anytime
              </div>
            </div>

            {/* Payment Form */}
            <div className="space-y-4 mb-6">
              {/* Card Number */}
              <div>
                <label 
                  className="text-xs block mb-2"
                  style={{ color: '#AAA', fontFamily: 'DM Sans, sans-serif' }}
                >
                  Card Number
                </label>
                <div 
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border"
                  style={{
                    backgroundColor: '#070707',
                    borderColor: '#1A1A1A'
                  }}
                >
                  <CreditCard size={16} style={{ color: '#666' }} />
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="flex-1 bg-transparent text-white text-sm outline-none"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  />
                </div>
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label 
                    className="text-xs block mb-2"
                    style={{ color: '#AAA', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 rounded-lg border bg-transparent text-white text-sm outline-none"
                    style={{
                      backgroundColor: '#070707',
                      borderColor: '#1A1A1A',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}
                  />
                </div>
                <div>
                  <label 
                    className="text-xs block mb-2"
                    style={{ color: '#AAA', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 rounded-lg border bg-transparent text-white text-sm outline-none"
                    style={{
                      backgroundColor: '#070707',
                      borderColor: '#1A1A1A',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}
                  />
                </div>
              </div>

              {/* Name on Card */}
              <div>
                <label 
                  className="text-xs block mb-2"
                  style={{ color: '#AAA', fontFamily: 'DM Sans, sans-serif' }}
                >
                  Name on Card
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg border bg-transparent text-white text-sm outline-none"
                  style={{
                    backgroundColor: '#070707',
                    borderColor: '#1A1A1A',
                    fontFamily: 'DM Sans, sans-serif'
                  }}
                />
              </div>
            </div>

            {/* Security Notice */}
            <div 
              className="flex items-center gap-2 p-3 rounded-lg mb-6"
              style={{
                backgroundColor: 'rgba(10, 132, 255, 0.1)',
                borderColor: '#1A1A1A'
              }}
            >
              <Lock size={14} style={{ color: '#0A84FF' }} />
              <span 
                className="text-xs"
                style={{ color: '#0A84FF', fontFamily: 'DM Sans, sans-serif' }}
              >
                Your payment information is encrypted and secure
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                className="flex-1 py-3 rounded-lg font-semibold text-sm border transition-all"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: '#1A1A1A',
                  color: '#AAA',
                  fontFamily: 'Syne, sans-serif'
                }}
                onClick={() => setShowPayment(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 rounded-lg font-semibold text-sm transition-all hover:shadow-[0_0_20px_rgba(10,132,255,0.3)]"
                style={{
                  backgroundColor: '#0A84FF',
                  color: 'white',
                  fontFamily: 'Syne, sans-serif'
                }}
                onClick={() => {
                  setShowPayment(false);
                  // Handle payment processing here
                }}
              >
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}