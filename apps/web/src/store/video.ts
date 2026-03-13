import { create } from 'zustand'
import { api, type VideoDetail, type VideoListItem } from '../lib/api'

interface VideoState {
  currentVideo: VideoDetail | null
  videos: VideoListItem[]
  uploadProgress: number
  uploadVideoId: string | null
  isUploading: boolean
  isProcessing: boolean
  isLoadingList: boolean
  isLoadingDetail: boolean
  error: string | null

  // Actions
  setCurrentVideo: (video: VideoDetail | null) => void
  setUploadProgress: (progress: number) => void
  setUploadVideoId: (id: string | null) => void
  setIsUploading: (v: boolean) => void
  setIsProcessing: (v: boolean) => void
  loadVideos: () => Promise<void>
  loadVideo: (id: string) => Promise<VideoDetail | null>
  deleteVideo: (id: string) => Promise<void>
  pollVideoStatus: (id: string, onComplete?: (video: VideoDetail) => void) => () => void
}

export const useVideoStore = create<VideoState>((set) => ({
  currentVideo: null,
  videos: [],
  uploadProgress: 0,
  uploadVideoId: null,
  isUploading: false,
  isProcessing: false,
  isLoadingList: false,
  isLoadingDetail: false,
  error: null,

  setCurrentVideo: (video: VideoDetail | null) => set({ currentVideo: video }),
  setUploadProgress: (progress: number) => set({ uploadProgress: progress }),
  setUploadVideoId: (id: string | null) => set({ uploadVideoId: id }),
  setIsUploading: (v: boolean) => set({ isUploading: v }),
  setIsProcessing: (v: boolean) => set({ isProcessing: v }),

  loadVideos: async () => {
    set({ isLoadingList: true, error: null })
    try {
      const videos = await api.get<VideoListItem[]>('/api/videos')
      set({ videos, isLoadingList: false })
    } catch (err: unknown) {
      set({ error: (err as Error).message, isLoadingList: false })
    }
  },

  loadVideo: async (id: string) => {
    set({ isLoadingDetail: true, error: null })
    try {
      const video = await api.get<VideoDetail>(`/api/videos/${id}`)
      set({ currentVideo: video, isLoadingDetail: false })
      return video
    } catch (err: unknown) {
      set({ error: (err as Error).message, isLoadingDetail: false })
      return null
    }
  },

  deleteVideo: async (id: string) => {
    await api.delete(`/api/videos/${id}`)
    set((state: VideoState) => ({
      videos: state.videos.filter((v: VideoListItem) => v.id !== id),
      currentVideo: state.currentVideo?.id === id ? null : state.currentVideo,
    }))
  },

  pollVideoStatus: (id: string, onComplete?: (video: VideoDetail) => void) => {
    let stopped = false

    const poll = async () => {
      while (!stopped) {
        try {
          const video = await api.get<VideoDetail>(`/api/videos/${id}`)
          set((state: VideoState) => ({
            currentVideo: state.currentVideo?.id === id ? video : state.currentVideo,
            videos: state.videos.map((v: VideoListItem) => (v.id === id ? video : v)),
          }))

          const terminalStatuses = ['analyzed', 'done', 'error']
          if (terminalStatuses.includes(video.status)) {
            set({ isProcessing: false })
            onComplete?.(video)
            return
          }
        } catch {
          // Ignore transient errors during polling
        }
        await new Promise((r) => setTimeout(r, 3000))
      }
    }

    poll()
    return () => { stopped = true }
  },
}))
