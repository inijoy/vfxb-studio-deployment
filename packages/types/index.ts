export type PlanTier = 'free' | 'pro' | 'enterprise'

export type VideoStatus =
  | 'uploading'
  | 'processing'
  | 'transcribing'
  | 'analyzing'
  | 'scoring'
  | 'analyzed'
  | 'editing'
  | 'done'
  | 'error'

export interface UserProfile {
  id: string
  email: string
  full_name?: string | null
  avatar_url?: string | null
  plan: PlanTier
  creator_mode: 'longform' | 'shortform' | 'agency'
  videos_used: number
  videos_limit: number
  created_at: string
}

export interface VideoListItem {
  id: string
  title: string
  status: VideoStatus
  virality_score: number | null
  preview_url?: string | null
  created_at: string
}

export interface VideoDetail extends VideoListItem {
  transcript?: string | null
  analysis?: Record<string, unknown> | null
  score_breakdown?: Record<string, unknown> | null
  processed_url?: string | null
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  agent?: string
  created_at: string
}

export interface EditInstruction {
  type: string
  description: string
  params: Record<string, unknown>
  estimated_score_improvement?: number
}

export interface EditPlan {
  understood_intent: string
  edits: EditInstruction[]
  response_message: string
  needs_confirmation: boolean
  is_question: boolean
}
