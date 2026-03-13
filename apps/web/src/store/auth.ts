import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { api, type UserProfile } from '../lib/api'

interface AuthState {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean

  // Actions
  setSession: (session: Session | null) => void
  setProfile: (profile: UserProfile | null) => void
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithGitHub: () => Promise<void>
  signOut: () => Promise<void>
  loadProfile: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      profile: null,
      isLoading: true,
      isAuthenticated: false,

      setSession: (session) => {
        set({
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session,
          isLoading: false,
        })
      },

      setProfile: (profile) => set({ profile }),

      signInWithEmail: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      },

      signUpWithEmail: async (email, password, fullName) => {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        })
        if (error) throw error
      },

      signInWithGoogle: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: `${window.location.origin}/` },
        })
        if (error) throw error
      },

      signInWithGitHub: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'github',
          options: { redirectTo: `${window.location.origin}/` },
        })
        if (error) throw error
      },

      signOut: async () => {
        await supabase.auth.signOut()
        set({ user: null, session: null, profile: null, isAuthenticated: false })
      },

      loadProfile: async () => {
        try {
          // Ensure user record exists in our DB (upsert on first sign-in)
          await api.post('/api/users/ensure')
          const profile = await api.get<UserProfile>('/api/users/me')
          set({ profile })
        } catch (err) {
          console.error('Failed to load user profile:', err)
        }
      },
    }),
    {
      name: 'vfxb-auth',
      partialize: (state) => ({
        // Only persist non-sensitive UI state across page reloads
        profile: state.profile,
      }),
    }
  )
)

// ── Supabase auth listener — call this once in main.tsx ───────────────────────
export function initAuthListener() {
  const { setSession, loadProfile } = useAuthStore.getState()

  supabase.auth.getSession().then(({ data }) => {
    setSession(data.session)
    if (data.session) loadProfile()
  })

  supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session)
    if (session) {
      loadProfile()
    }
  })
}
