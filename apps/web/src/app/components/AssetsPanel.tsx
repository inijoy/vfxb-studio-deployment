import { MediaPanel } from './panels/MediaPanel';
import { TextPanel } from './panels/TextPanel';
import { ShapesPanel } from './panels/ShapesPanel';
import { TransitionsPanel } from './panels/TransitionsPanel';
import { MusicPanel } from './panels/MusicPanel';
import { EffectsPanel } from './panels/EffectsPanel';
import { ColorPanel } from './panels/ColorPanel';

interface AssetsPanelProps {
  activePanel: string;
}

export function AssetsPanel({ activePanel }: AssetsPanelProps) {
  const renderPanel = () => {
    switch (activePanel) {
      case 'media':
        return <MediaPanel />;
      case 'text':
        return <TextPanel />;
      case 'shapes':
        return <ShapesPanel />;
      case 'transitions':
        return <TransitionsPanel />;
      case 'music':
        return <MusicPanel />;
      case 'effects':
        return <EffectsPanel />;
      case 'color':
        return <ColorPanel />;
      default:
        return <MediaPanel />;
    }
  };

  return (
    <div className="w-full sm:w-48 md:w-[220px] bg-[#141414] flex flex-col h-full">
      {renderPanel()}
    </div>
  );
}