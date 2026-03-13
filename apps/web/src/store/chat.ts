import { create } from 'zustand'
import type { ChatMessage, EditPlan } from '../lib/api'

interface ChatState {
  messages: ChatMessage[]
  isStreaming: boolean
  activeAgent: 'vfxb' | 'gpt4o' | 'claude' | 'gemini' | 'suno'
  pendingEdit: EditPlan | null
  pendingEditId: string | null
  activeVideoId: string | null
  streamBuffer: string

  // Actions
  setActiveVideoId: (id: string | null) => void
  addMessage: (msg: ChatMessage) => void
  setMessages: (msgs: ChatMessage[]) => void
  appendStreamToken: (token: string) => void
  commitStreamMessage: (role: 'user' | 'assistant', agent?: string) => void
  clearStreamBuffer: () => void
  setIsStreaming: (v: boolean) => void
  setActiveAgent: (agent: ChatState['activeAgent']) => void
  setPendingEdit: (plan: EditPlan | null, editId?: string | null) => void
  clearPendingEdit: () => void
  clearMessages: () => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isStreaming: false,
  activeAgent: 'gemini',
  pendingEdit: null,
  pendingEditId: null,
  activeVideoId: null,
  streamBuffer: '',

  setActiveVideoId: (id: string | null) => set({ activeVideoId: id }),

  addMessage: (msg: ChatMessage) =>
    set((state: ChatState) => ({ messages: [...state.messages, msg] })),

  setMessages: (msgs: ChatMessage[]) => set({ messages: msgs }),

  appendStreamToken: (token: string) =>
    set((state: ChatState) => ({ streamBuffer: state.streamBuffer + token })),

  commitStreamMessage: (role: 'user' | 'assistant', agent?: string) => {
    const { streamBuffer, activeAgent } = get()
    if (!streamBuffer.trim()) return
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      video_id: get().activeVideoId ?? '',
      role,
      content: streamBuffer,
      agent: agent ?? activeAgent,
      edit_id: null,
      metadata: null,
      created_at: new Date().toISOString(),
    }
    set((state: ChatState) => ({
      messages: [...state.messages, msg],
      streamBuffer: '',
    }))
  },

  clearStreamBuffer: () => set({ streamBuffer: '' }),

  setIsStreaming: (v: boolean) => set({ isStreaming: v }),

  setActiveAgent: (agent: ChatState['activeAgent']) => set({ activeAgent: agent }),

  setPendingEdit: (plan: EditPlan | null, editId: string | null = null) =>
    set({ pendingEdit: plan, pendingEditId: editId }),

  clearPendingEdit: () => set({ pendingEdit: null, pendingEditId: null }),

  clearMessages: () => set({ messages: [], streamBuffer: '' }),
}))
