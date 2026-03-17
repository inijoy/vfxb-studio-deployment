/**
 * Typed API client — thin wrapper around fetch that:
 * 1. Prepends VITE_API_URL
 * 2. Attaches the app JWT token from auth storage
 * 3. Throws on non-2xx responses with structured error info
 */
import { getStoredAuthToken } from './authStorage'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const token = getStoredAuthToken()
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const authHeader = await getAuthHeader()

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...options.headers,
    },
  })

  if (!res.ok) {
    let errorData: { error?: string; code?: string } = {}
    try {
      errorData = await res.json()
    } catch {
      // ignore parse errors
    }
    throw new ApiError(
      res.status,
      errorData.code ?? 'UNKNOWN',
      errorData.error ?? `HTTP ${res.status}`
    )
  }

  // 204 No Content
  if (res.status === 204) return undefined as T

  return res.json() as Promise<T>
}

export const api = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),

  /**
   * Returns an EventSource preconfigured with the auth token as a query param.
   * The backend reads `?token=` for SSE endpoints because Headers aren't
   * supported by the native EventSource API.
   */
  async sse(path: string): Promise<EventSource> {
    const token = getStoredAuthToken() ?? ''
    const url = `${API_URL}${path}${path.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`
    return new EventSource(url)
  },
}

// ── Typed endpoint helpers ────────────────────────────────────────────────────

export interface PresignedUploadResponse {
  upload_url: string
  video_id: string
  r2_key: string
}

export interface VideoListItem {
  id: string
  title: string
  status: string
  virality_score: number | null
  thumbnail_url: string | null
  duration: number | null
  platform: string
  created_at: string
  updated_at: string
}

export interface VideoDetail extends VideoListItem {
  original_url: string | null
  processed_url: string | null
  score_breakdown: Record<string, unknown> | null
  analysis: Record<string, unknown> | null
  transcript: string | null
  file_size: number | null
  resolution: string | null
  fps: number | null
}

export interface ChatMessage {
  id: string
  video_id: string
  role: 'user' | 'assistant'
  content: string
  agent: string
  edit_id: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface EditPlan {
  understood_intent: string
  edits: Array<{
    type: string
    params: Record<string, unknown>
    description: string
    estimated_score_improvement: number
  }>
  response_message: string
  needs_confirmation: boolean
  is_question: boolean
}

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  plan: 'free' | 'pro' | 'enterprise'
  creator_mode: string
  videos_used: number
  videos_limit: number
  created_at: string
}
