import { create } from 'zustand'

type FeaturePanel =
  | 'ai'
  | 'assets'
  | 'effects'
  | 'text'
  | 'music'
  | 'transitions'
  | 'shapes'
  | 'color'
  | 'media'
  | null

interface UIState {
  activeFeaturePanel: FeaturePanel
  isToolsDrawerOpen: boolean
  comparisonMode: boolean
  beforeUrl: string | null
  afterUrl: string | null
  isExportModalOpen: boolean
  isSettingsModalOpen: boolean
  activeView: 'upload' | 'studio' | 'dashboard'
  editProgressPercent: number
  editProgressMessage: string

  // Actions
  openPanel: (panel: FeaturePanel) => void
  closePanel: () => void
  togglePanel: (panel: FeaturePanel) => void
  setToolsDrawerOpen: (v: boolean) => void
  setComparisonMode: (v: boolean, beforeUrl?: string, afterUrl?: string) => void
  openExportModal: () => void
  closeExportModal: () => void
  openSettingsModal: () => void
  closeSettingsModal: () => void
  setActiveView: (view: UIState['activeView']) => void
  setEditProgress: (percent: number, message?: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  activeFeaturePanel: 'ai',
  isToolsDrawerOpen: false,
  comparisonMode: false,
  beforeUrl: null,
  afterUrl: null,
  isExportModalOpen: false,
  isSettingsModalOpen: false,
  activeView: 'upload',
  editProgressPercent: 0,
  editProgressMessage: '',

  openPanel: (panel: FeaturePanel) => set({ activeFeaturePanel: panel }),
  closePanel: () => set({ activeFeaturePanel: null }),
  togglePanel: (panel: FeaturePanel) =>
    set((state: UIState) => ({
      activeFeaturePanel: state.activeFeaturePanel === panel ? null : panel,
    })),

  setToolsDrawerOpen: (v: boolean) => set({ isToolsDrawerOpen: v }),

  setComparisonMode: (v: boolean, beforeUrl?: string, afterUrl?: string) =>
    set({
      comparisonMode: v,
      ...(beforeUrl !== undefined && { beforeUrl }),
      ...(afterUrl !== undefined && { afterUrl }),
    }),

  openExportModal: () => set({ isExportModalOpen: true }),
  closeExportModal: () => set({ isExportModalOpen: false }),
  openSettingsModal: () => set({ isSettingsModalOpen: true }),
  closeSettingsModal: () => set({ isSettingsModalOpen: false }),

  setActiveView: (view: UIState['activeView']) => set({ activeView: view }),

  setEditProgress: (percent: number, message = '') =>
    set({ editProgressPercent: percent, editProgressMessage: message }),
}))
