import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api, type UserProfile } from '../lib/api'

const AUTH_API_URL = (import.meta.env.VITE_AUTH_API_URL ?? 'http://localhost:5000').replace(/\/$/, '')

type AppUser = {
  id: string
  email: string
  name?: string
  profilePicture?: string | null
}

interface AuthState {
  user: AppUser | null
  token: string | null
  profile: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean

  // Actions
  setAuth: (auth: { user: AppUser; token: string } | null) => void
  setProfile: (profile: UserProfile | null) => void
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, fullName?: string, secretWord?: string) => Promise<void>
  signInWithGoogle: (token: string) => Promise<void>;
  signInWithGitHub: (code: string) => Promise<void>;
  signOut: () => Promise<void>
  loadProfile: () => Promise<void>
}

async function requestAuth(path: string, body: Record<string, unknown>) {
  const res = await fetch(`${AUTH_API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = (await res.json().catch(() => ({}))) as {
    message?: string
    token?: string
    result?: {
      _id?: string
      id?: string
      email?: string
      name?: string
      profilePicture?: string | null
    }
  }

  if (!res.ok) {
    throw new Error(data.message ?? `Authentication failed (${res.status})`)
  }

  if (!data.token || !data.result) {
    throw new Error('Invalid auth server response')
  }

  const user: AppUser = {
    id: data.result._id ?? data.result.id ?? '',
    email: data.result.email ?? '',
    name: data.result.name,
    profilePicture: data.result.profilePicture ?? null,
  }

  if (!user.id || !user.email) {
    throw new Error('Auth user payload is missing required fields')
  }

  return { user, token: data.token }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      profile: null,
      isLoading: true,
      isAuthenticated: false,

      setAuth: (auth) => {
        set({
          user: auth?.user ?? null,
          token: auth?.token ?? null,
          isAuthenticated: Boolean(auth?.token),
          isLoading: false,
        })
      },

      setProfile: (profile) => set({ profile }),

      signInWithEmail: async (email, password) => {
        const auth = await requestAuth('/api/signin', { email, password })
        get().setAuth(auth)
      },

      signUpWithEmail: async (email, password, fullName, secretWord) => {
      const auth = await requestAuth('/api/signup', {
      name: fullName,
      email,
      password,
      secretWord, // <--- Add the secretWord to the payload sent to backend
    })
    get().setAuth(auth)
    },

      signInWithGoogle: async (token) => {
        const auth = await requestAuth('/api/auth/google', { token })
        get().setAuth(auth)
      },

      signInWithGitHub: async (code) => {
        const auth = await requestAuth('/api/auth/github', { code })
        get().setAuth(auth)
      },

      signOut: async () => {
        set({ user: null, token: null, profile: null, isAuthenticated: false, isLoading: false })
      },

      loadProfile: async () => {
        if (!get().token) return
        try {
          // FastAPI side user profile for studio features
          await api.post('/api/users/ensure')
          const profile = await api.get<UserProfile>('/api/users/me')
          set({ profile })
        } catch {
          // Fallback to auth-server identity when API profile is unavailable
          const authUser = get().user
          if (!authUser) return
          set({
            profile: {
              id: authUser.id,
              email: authUser.email,
              full_name: authUser.name ?? null,
              avatar_url: authUser.profilePicture ?? null,
              plan: 'free',
              creator_mode: 'longform',
              videos_used: 0,
              videos_limit: 3,
              created_at: new Date().toISOString(),
            },
          })
        }
      },
    }),
    {
      name: 'vfxb-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        profile: state.profile,
      }),
    }
  )
)

export function initAuthListener() {
  const { token, setAuth, loadProfile, user } = useAuthStore.getState()
  if (!token || !user) {
    setAuth(null)
    return
  }
  setAuth({ user, token })
  loadProfile()
}
