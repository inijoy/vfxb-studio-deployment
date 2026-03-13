interface InsightCardProps {
  type: 'critical' | 'warning' | 'success';
  icon: string;
  title: string;
  description: string;
  actions: { label: string; onClick: () => void }[];
}

export function InsightCard({ type, icon, title, description, actions }: InsightCardProps) {
  const getBorderColor = () => {
    switch (type) {
      case 'critical': return '#FF453A';
      case 'warning': return '#FFD60A';
      case 'success': return '#30D158';
    }
  };

  return (
    <div 
      className="rounded-xl p-4 border transition-all"
      style={{
        backgroundColor: '#141414',
        borderColor: '#222',
        borderLeftWidth: '3px',
        borderLeftColor: getBorderColor()
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-2 mb-2">
        <span className="text-lg leading-none">{icon}</span>
        <div className="flex-1">
          <div className="text-white font-medium text-sm mb-1">{title}</div>
          <p className="text-[#888] text-xs leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              index === 0
                ? 'bg-[#0A84FF] text-white hover:bg-[#0A84FF]/90 hover:shadow-[0_0_15px_rgba(10,132,255,0.3)]'
                : 'bg-[#1a1a1a] text-[#888] hover:text-white hover:bg-[#222] border border-[#2a2a2a]'
            }`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
