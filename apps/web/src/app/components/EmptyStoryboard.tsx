import { FileUp, Sparkles } from 'lucide-react';

interface EmptyStoryboardProps {
  onGenerate?: (script: string, sceneCount: number, style: string, format: string) => void;
}

export function EmptyStoryboard({ onGenerate }: EmptyStoryboardProps) {
  return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div className="max-w-xl text-center px-6" style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[#0A84FF]/20 border border-[#0A84FF]/30 flex items-center justify-center">
          <Sparkles size={32} className="text-[#0A84FF]" />
        </div>

        {/* Title */}
        <h2 className="text-white text-2xl font-bold mb-3">Create Your First Storyboard</h2>

        {/* Description */}
        <p className="text-[#8A8A8A] text-sm leading-relaxed mb-6">
          Storyboards help you plan your video scenes before editing. Organize shots, set durations, and visualize your entire video structure. Perfect for creating high-retention content.
        </p>

        {/* Main CTA */}
        <button
          onClick={() => onGenerate?.('Sample video project with engaging hook, compelling story, and strong call to action', 6, 'professional', '16:9')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A84FF] text-white text-sm font-medium rounded-lg hover:bg-[#0A84FF]/90 transition-colors shadow-[0_4px_16px_rgba(10,132,255,0.4)] mb-4"
        >
          <FileUp size={18} />
          <span>Generate from Script</span>
        </button>

        {/* How to use */}
        <div className="text-left bg-[#1E1E1E] rounded-lg p-4 border border-[#3A3A3A] mt-6">
          <h3 className="text-white text-sm font-semibold mb-3">How to use:</h3>
          <ul className="space-y-2 text-[#8A8A8A] text-xs">
            <li className="flex items-start gap-2">
              <span className="text-[#0A84FF] mt-0.5">1.</span>
              <span>Generate scenes from your script or create manually using the chat bar below</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0A84FF] mt-0.5">2.</span>
              <span>Click any scene to edit details, duration, and add notes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0A84FF] mt-0.5">3.</span>
              <span>Drag scenes to reorder, duplicate, or delete as needed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0A84FF] mt-0.5">4.</span>
              <span>Use the chat bar to ask AI for help: "add scene", "fix scene 2", or "generate 10 scenes"</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}