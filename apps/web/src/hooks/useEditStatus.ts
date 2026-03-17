import { useEffect, useRef, useCallback } from 'react'
import { getStoredAuthToken } from '../lib/authStorage'
import { useUIStore } from '../store/ui'
import { useVideoStore } from '../store/video'

interface EditStatusEvent {
  status: 'queued' | 'started' | 'progress' | 'in_progress' | 'done' | 'error' | 'failed'
  progress?: number
  message?: string
  output_url?: string
  new_score?: number
  error?: string
}

interface UseEditStatusOptions {
  jobId: string | null
  videoId?: string
  onDone?: (outputUrl: string, newScore: number) => void
  onError?: (message: string) => void
}

export function useEditStatus({ jobId, videoId, onDone, onError }: UseEditStatusOptions) {
  const wsRef = useRef<WebSocket | null>(null)
  const { setEditProgress } = useUIStore()
  const { loadVideo } = useVideoStore()

  const connect = useCallback(async () => {
    if (!jobId) return

    const token = getStoredAuthToken()
    if (!token) return

    const wsBase = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000')
      .replace(/^http/, 'ws')
    const ws = new WebSocket(`${wsBase}/ws/edit-status/${jobId}`)
    wsRef.current = ws

    ws.onopen = () => {
      ws.send(JSON.stringify({ token }))
    }

    ws.onmessage = (event) => {
      try {
        const data: EditStatusEvent = JSON.parse(event.data)

        switch (data.status) {
          case 'queued':
            setEditProgress(0, 'Edit queued…')
            break
          case 'started':
            setEditProgress(5, 'Starting edit…')
            break
          case 'progress':
          case 'in_progress':
            setEditProgress(data.progress ?? 50, data.message ?? 'Processing…')
            break
          case 'done':
            setEditProgress(100, 'Edit complete!')
            if (videoId) loadVideo(videoId)
            onDone?.(data.output_url ?? '', data.new_score ?? 0)
            ws.close()
            break
          case 'error':
          case 'failed':
            setEditProgress(0, '')
            onError?.(data.error ?? 'Edit failed')
            ws.close()
            break
        }
      } catch {
        // Ignore malformed messages
      }
    }

    ws.onerror = () => {
      onError?.('Connection error')
    }

    ws.onclose = () => {
      wsRef.current = null
    }
  }, [jobId, videoId, onDone, onError, setEditProgress, loadVideo])

  useEffect(() => {
    connect()
    return () => {
      wsRef.current?.close()
      wsRef.current = null
    }
  }, [connect])
}
