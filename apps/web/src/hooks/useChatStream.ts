import { useCallback, useRef } from 'react'
import { api } from '../lib/api'
import { getStoredAuthToken } from '../lib/authStorage'
import { useChatStore } from '../store/chat'
import { useVideoStore } from '../store/video'

const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

interface SendMessageOptions {
  videoId: string
  message: string
}

interface UseChatStreamReturn {
  sendMessage: (opts: SendMessageOptions) => Promise<void>
  confirmEdit: (editId: string) => Promise<{ job_id: string }>
  loadHistory: (videoId: string) => Promise<void>
  stopStream: () => void
  isStreaming: boolean
}

export function useChatStream(): UseChatStreamReturn {
  const abortRef = useRef<AbortController | null>(null)
  const {
    isStreaming,
    setIsStreaming,
    addMessage,
    setMessages,
    appendStreamToken,
    commitStreamMessage,
    clearStreamBuffer,
    setPendingEdit,
    activeAgent,
  } = useChatStore()
  const { loadVideo } = useVideoStore()

  const stopStream = useCallback(() => {
    abortRef.current?.abort()
    setIsStreaming(false)
  }, [setIsStreaming])

  const sendMessage = useCallback(
    async ({ videoId, message }: SendMessageOptions) => {
      if (isStreaming) return

      // Optimistically add user message
      addMessage({
        id: crypto.randomUUID(),
        video_id: videoId,
        role: 'user',
        content: message,
        agent: 'user',
        edit_id: null,
        metadata: null,
        created_at: new Date().toISOString(),
      })

      abortRef.current = new AbortController()
      setIsStreaming(true)
      clearStreamBuffer()

      try {
        const token = getStoredAuthToken()
        if (!token) {
          throw new Error('No auth token available')
        }

        // SSE streaming — POST then read the event stream
        const response = await fetch(`${API_BASE}/api/chat/message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ video_id: videoId, message, agent: activeAgent }),
          signal: abortRef.current.signal,
        })

        if (!response.ok) {
          throw new Error(`Chat API error: ${response.status}`)
        }

        const reader = response.body!.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.trim() || !line.startsWith('data: ')) continue
            const raw = line.slice(6)
            if (raw === '[DONE]') continue

            try {
              const event = JSON.parse(raw)

              if (event.type === 'text') {
                appendStreamToken(event.content)
              } else if (event.type === 'edit_plan') {
                setPendingEdit(event.plan, event.edit_id)
              } else if (event.type === 'done') {
                commitStreamMessage('assistant', activeAgent)
                setIsStreaming(false)
                // Refresh video data in case score changed
                loadVideo(videoId)
              } else if (event.type === 'error') {
                throw new Error(event.message)
              }
            } catch {
              // Ignore malformed SSE lines
            }
          }
        }
      } catch (err: unknown) {
        setIsStreaming(false)
        commitStreamMessage('assistant', activeAgent)

        if ((err as Error).name !== 'AbortError') {
          addMessage({
            id: crypto.randomUUID(),
            video_id: videoId,
            role: 'assistant',
            content: 'Sorry, something went wrong. Please try again.',
            agent: activeAgent,
            edit_id: null,
            metadata: null,
            created_at: new Date().toISOString(),
          })
        }
      }
    },
    [
      isStreaming,
      activeAgent,
      addMessage,
      setIsStreaming,
      clearStreamBuffer,
      appendStreamToken,
      commitStreamMessage,
      setPendingEdit,
      loadVideo,
    ],
  )

  const confirmEdit = useCallback(async (editId: string) => {
    const result = await api.post<{ job_id: string }>('/api/chat/confirm-edit', {
      edit_id: editId,
    })
    return result
  }, [])

  const loadHistory = useCallback(
    async (videoId: string) => {
      const history = await api.get<
        Array<{
          id: string
          role: string
          content: string
          agent: string
          created_at: string
          video_id?: string
          edit_id?: string | null
          metadata?: Record<string, unknown> | null
        }>
      >(`/api/chat/history/${videoId}`)
      setMessages(
        history.map((m) => ({
          ...m,
          video_id: m.video_id ?? videoId,
          role: m.role as 'user' | 'assistant',
          edit_id: m.edit_id ?? null,
          metadata: m.metadata ?? null,
        })),
      )
    },
    [setMessages],
  )

  return { sendMessage, confirmEdit, loadHistory, stopStream, isStreaming }
}
