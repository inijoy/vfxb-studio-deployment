import { useState } from 'react';
import { StoryboardTopBar } from './StoryboardTopBar';
import { StoryboardToolbar } from './StoryboardToolbar';
import { EmptyStoryboard } from './EmptyStoryboard';
import { SceneCard } from './SceneCard';
import { AISuggestionCard } from './AISuggestionCard';
import { StoryboardChatBar } from './StoryboardChatBar';
import { SceneSidePanel } from './SceneSidePanel';
import { GeneratorModal } from './GeneratorModal';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { toast } from 'sonner';
import { StatusBar } from './StatusBar';
import { MessageSquare, X } from 'lucide-react';

interface Scene {
  id: number;
  sceneNumber: number;
  duration: string;
  label: string;
  aiInsight?: string;
  thumbnail?: string;
  notes: string;
}

interface StoryboardViewProps {
  isEmpty?: boolean;
}

export function StoryboardView({ isEmpty = false }: StoryboardViewProps) {
  const [selectedScene, setSelectedScene] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [scenes, setScenes] = useState<Scene[]>(isEmpty ? [] : [
    {
      id: 1,
      sceneNumber: 1,
      duration: '0:03',
      label: 'Hook — Open on face',
      aiInsight: 'Strong opener detected',
      notes: ''
    },
    {
      id: 2,
      sceneNumber: 2,
      duration: '0:05',
      label: 'Problem statement',
      aiInsight: 'Add motion in first 0.5s',
      notes: ''
    },
    {
      id: 3,
      sceneNumber: 3,
      duration: '0:04',
      label: 'Solution intro',
      notes: ''
    },
    {
      id: 4,
      sceneNumber: 4,
      duration: '0:06',
      label: 'Product demo',
      aiInsight: 'Great pacing',
      notes: ''
    },
    {
      id: 5,
      sceneNumber: 5,
      duration: '0:04',
      label: 'Benefits overview',
      notes: ''
    },
    {
      id: 6,
      sceneNumber: 6,
      duration: '0:03',
      label: 'Call to action',
      aiInsight: 'CTA could be stronger',
      notes: ''
    },
  ]);

  const handleSceneSelect = (sceneId: number) => {
    setSelectedScene(selectedScene === sceneId ? null : sceneId);
  };

  const handleUpdateNotes = (notes: string) => {
    if (selectedScene) {
      setScenes(scenes.map(s => s.id === selectedScene ? { ...s, notes } : s));
    }
  };

  const handleLabelChange = (label: string) => {
    if (selectedScene) {
      setScenes(scenes.map(s => s.id === selectedScene ? { ...s, label } : s));
      toast.success('Scene label updated');
    }
  };

  const handleUpdateDuration = (duration: string) => {
    if (selectedScene) {
      setScenes(scenes.map(s => s.id === selectedScene ? { ...s, duration } : s));
      toast.success('Scene duration updated');
    }
  };

  const handleDeleteScene = (sceneId: number) => {
    setScenes(scenes.filter(s => s.id !== sceneId));
    if (selectedScene === sceneId) {
      setSelectedScene(null);
    }
    toast.success('Scene deleted');
  };

  const handleDuplicateScene = (sceneId: number) => {
    const sceneToDuplicate = scenes.find(s => s.id === sceneId);
    if (sceneToDuplicate) {
      const maxId = scenes.length > 0 ? Math.max(...scenes.map(s => s.id)) : 0;
      const newScene = {
        ...sceneToDuplicate,
        id: maxId + 1,
        sceneNumber: scenes.length + 1,
      };
      setScenes([...scenes, newScene]);
      toast.success('Scene duplicated');
    }
  };

  const handleAddScene = () => {
    const maxId = scenes.length > 0 ? Math.max(...scenes.map(s => s.id)) : 0;
    const newScene: Scene = {
      id: maxId + 1,
      sceneNumber: scenes.length + 1,
      duration: '0:05',
      label: 'New scene',
      notes: ''
    };
    setScenes([...scenes, newScene]);
    toast.success('Scene added');
  };

  const handleGenerate = (script: string, sceneCount: number, style: string, format: string) => {
    // Generate scenes based on script
    const generatedScenes: Scene[] = [];
    for (let i = 0; i < sceneCount; i++) {
      generatedScenes.push({
        id: i + 1,
        sceneNumber: i + 1,
        duration: '0:05',
        label: `Scene ${i + 1} from script`,
        aiInsight: i % 2 === 0 ? 'AI-generated scene' : undefined,
        notes: ''
      });
    }
    setScenes(generatedScenes);
    toast.success(`Generated ${sceneCount} scenes in ${style} style (${format})`);
  };

  const handleAISuggestion = () => {
    const insertIndex = 2; // After first 2 scenes
    const maxId = scenes.length > 0 ? Math.max(...scenes.map(s => s.id)) : 0;
    const newScene: Scene = {
      id: maxId + 1,
      sceneNumber: insertIndex + 1,
      duration: '0:03',
      label: 'B-roll cutaway',
      aiInsight: 'AI suggested scene',
      notes: 'Consider adding B-roll here for better retention'
    };
    
    const updatedScenes = [...scenes];
    updatedScenes.splice(insertIndex, 0, newScene);
    
    // Renumber scenes
    updatedScenes.forEach((scene, index) => {
      scene.sceneNumber = index + 1;
    });
    
    setScenes(updatedScenes);
    toast.success('AI suggestion applied');
  };

  const handleMoveScene = (fromIndex: number, toIndex: number) => {
    const updatedScenes = [...scenes];
    const [movedScene] = updatedScenes.splice(fromIndex, 1);
    updatedScenes.splice(toIndex, 0, movedScene);
    
    // Renumber scenes
    updatedScenes.forEach((scene, index) => {
      scene.sceneNumber = index + 1;
    });
    
    setScenes(updatedScenes);
    toast.success('Scene reordered');
  };

  const handleFixScene = (sceneId: number) => {
    // Apply AI fix to the scene
    const scene = scenes.find(s => s.id === sceneId);
    if (scene && scene.aiInsight) {
      setScenes(scenes.map(s => 
        s.id === sceneId 
          ? { ...s, aiInsight: undefined } 
          : s
      ));
      toast.success(`Applied AI fix: ${scene.aiInsight}`);
    } else {
      toast.success('Scene optimized!');
    }
  };

  const handleChatMessage = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Parse different types of commands
    if (lowerMessage.includes('add scene') || lowerMessage.includes('new scene')) {
      handleAddScene();
      return 'Added a new scene to your storyboard.';
    }
    
    if (lowerMessage.includes('generate') || lowerMessage.includes('create storyboard')) {
      setShowGenerator(true);
      return 'Opening the storyboard generator. Let me help you create scenes from your script.';
    }
    
    if (lowerMessage.includes('delete') && lowerMessage.match(/scene\s+(\d+)/)) {
      const sceneNum = parseInt(lowerMessage.match(/scene\s+(\d+)/)?.[1] || '0');
      const scene = scenes.find(s => s.sceneNumber === sceneNum);
      if (scene) {
        handleDeleteScene(scene.id);
        return `Deleted scene ${sceneNum}.`;
      }
      return `Couldn't find scene ${sceneNum}.`;
    }
    
    if (lowerMessage.includes('fix') && lowerMessage.match(/scene\s+(\d+)/)) {
      const sceneNum = parseInt(lowerMessage.match(/scene\s+(\d+)/)?.[1] || '0');
      const scene = scenes.find(s => s.sceneNumber === sceneNum);
      if (scene) {
        handleFixScene(scene.id);
        return `Applied AI optimization to scene ${sceneNum}.`;
      }
      return `Couldn't find scene ${sceneNum}.`;
    }
    
    if (lowerMessage.includes('how many scenes') || lowerMessage.includes('scene count')) {
      return `Your storyboard has ${scenes.length} scene${scenes.length !== 1 ? 's' : ''}.`;
    }
    
    if (lowerMessage.includes('total duration') || lowerMessage.includes('video length')) {
      const totalSeconds = scenes.reduce((acc, scene) => {
        const [min, sec] = scene.duration.split(':').map(Number);
        return acc + (min * 60) + sec;
      }, 0);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `Total video duration: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    if (lowerMessage.includes('help')) {
      return 'I can help you: add scenes, generate storyboards, fix scenes, delete scenes, or answer questions about your project. Try "add scene" or "generate storyboard".';
    }
    
    // Default AI response
    return `I can help you with that. Try commands like "add scene", "generate storyboard", "fix scene 2", or ask me questions about your storyboard.`;
  };

  const selectedSceneData = scenes.find(s => s.id === selectedScene);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex-1 flex flex-col h-full overflow-hidden" style={{ backgroundColor: '#070707' }}>
        {/* Top Bar */}
        <StoryboardTopBar 
          onAddScene={handleAddScene} 
          onGenerate={() => setShowGenerator(true)} 
        />

        {/* Mobile Chat Toggle Button - Only visible on small screens */}
        <button
          onClick={() => setShowMobileChat(!showMobileChat)}
          className="lg:hidden fixed bottom-20 right-4 z-40 w-12 h-12 bg-[#0A84FF] hover:bg-[#0A84FF]/90 rounded-full flex items-center justify-center text-white shadow-lg transition-all"
          style={{ boxShadow: '0 0 20px rgba(10,132,255,0.6)' }}
        >
          {showMobileChat ? <X size={20} /> : <MessageSquare size={20} />}
        </button>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pt-6" style={{ backgroundColor: '#070707' }}>
          {scenes.length === 0 ? (
            <EmptyStoryboard onGenerate={handleGenerate} />
          ) : (
            <div className="max-w-7xl mx-auto pb-6">
              {/* Scene Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {scenes.map((scene, index) => (
                  <SceneCard
                    key={scene.id}
                    sceneNumber={scene.sceneNumber}
                    duration={scene.duration}
                    label={scene.label}
                    aiInsight={scene.aiInsight}
                    thumbnail={scene.thumbnail}
                    index={index}
                    onSelect={() => setSelectedScene(scene.id)}
                    isSelected={selectedScene === scene.id}
                    onDelete={() => handleDeleteScene(scene.id)}
                    onDuplicate={() => handleDuplicateScene(scene.id)}
                    onMove={handleMoveScene}
                    onFix={() => handleFixScene(scene.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Chat Bar Overlay */}
        {showMobileChat && (
          <div className="lg:hidden fixed inset-0 z-50 flex items-end" onClick={() => setShowMobileChat(false)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            <div className="relative w-full p-4" onClick={(e) => e.stopPropagation()}>
              <StoryboardChatBar onGenerate={handleChatMessage} scenes={scenes} />
            </div>
          </div>
        )}

        {/* Desktop Bottom Chat Bar */}
        <div className="hidden lg:block flex-shrink-0">
          <StoryboardChatBar onGenerate={handleChatMessage} scenes={scenes} />
        </div>

        {/* Scene Side Panel */}
        {selectedScene && selectedSceneData && (
          <SceneSidePanel 
            sceneNumber={selectedSceneData.sceneNumber}
            label={selectedSceneData.label}
            duration={selectedSceneData.duration}
            thumbnail={selectedSceneData.thumbnail}
            notes={selectedSceneData.notes}
            aiFeedback={selectedSceneData.aiInsight}
            onClose={() => setSelectedScene(null)}
            onNotesChange={handleUpdateNotes}
            onLabelChange={handleLabelChange}
            onDurationChange={handleUpdateDuration}
            onDelete={() => handleDeleteScene(selectedScene)}
          />
        )}

        {/* Generator Modal */}
        {showGenerator && (
          <GeneratorModal 
            onClose={() => setShowGenerator(false)}
            onGenerate={handleGenerate}
          />
        )}

        {/* Status Bar */}
        <StatusBar 
          activeView="storyboard" 
          onViewChange={() => {}}
        />
      </div>
    </DndProvider>
  );
}