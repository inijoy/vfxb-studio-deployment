interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: { label: string; onClick: () => void }[];
}

interface ChatThreadProps {
  messages: Message[];
}

export function ChatThread({ messages }: ChatThreadProps) {
  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[85%] rounded-xl p-3 ${
              message.role === 'user'
                ? 'bg-[#0A84FF] text-white'
                : 'bg-[#161616] text-[#ddd] border border-[#222]'
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            
            {/* Actions */}
            {message.actions && message.actions.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {message.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className="px-3 py-1.5 bg-[#0A84FF] text-white rounded-lg text-xs font-medium hover:bg-[#0A84FF]/90 transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
