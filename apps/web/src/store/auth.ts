import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Session, User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { api, type UserProfile } from '../lib/api'

const DEMO_AUTH_STORAGE_KEY = 'vfxb-demo-auth-user'
const DEMO_AUTH_PASSWORD = 'demo1234'

type DemoAuthUser = {
  id: string
  email: string
  full_name: string
}

function buildDemoUser(email: string): DemoAuthUser {
  return {
    id: `demo-${email.toLowerCase()}`,
    email,
    full_name: 'Demo Developer',
  }
}

function saveDemoUser(user: DemoAuthUser) {
  localStorage.setItem(DEMO_AUTH_STORAGE_KEY, JSON.stringify(user))
}

function getDemoUser(): DemoAuthUser | null {
  const raw = localStorage.getItem(DEMO_AUTH_STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as DemoAuthUser
    if (!parsed?.email) return null
    return parsed
  } catch {
    return null
  }
}

function clearDemoUser() {
  localStorage.removeItem(DEMO_AUTH_STORAGE_KEY)
}

function asDemoSession(user: DemoAuthUser): Session {
  const now = new Date().toISOString()
  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30
  return {
    access_token: 'demo-access-token',
    refresh_token: 'demo-refresh-token',
    token_type: 'bearer',
    user: {
      id: user.id,
      email: user.email,
      user_metadata: { full_name: user.full_name, demo: true },
      app_metadata: {},
      aud: 'authenticated',
      created_at: now,
    } as User,
    expires_at: expiresAt,
    expires_in: expiresAt - Math.floor(Date.now() / 1000),
  } as Session
}

function isFetchFailure(err: unknown): boolean {
  return err instanceof TypeError && /failed to fetch/i.test(err.message)
}

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
        if (!isSupabaseConfigured) {
          if (password !== DEMO_AUTH_PASSWORD) {
            throw new Error('Demo mode: use password demo1234')
          }
          const demoUser = buildDemoUser(email)
          saveDemoUser(demoUser)
          get().setSession(asDemoSession(demoUser))
          return
        }

        try {
          const { error } = await supabase.auth.signInWithPassword({ email, password })
          if (error) throw error
        } catch (err) {
          if (isFetchFailure(err)) {
            if (password !== DEMO_AUTH_PASSWORD) {
              throw new Error('Supabase unreachable. Demo mode password: demo1234')
            }
            const demoUser = buildDemoUser(email)
            saveDemoUser(demoUser)
            get().setSession(asDemoSession(demoUser))
            return
          }
          throw err
        }
      },

      signUpWithEmail: async (email, password, fullName) => {
        if (!isSupabaseConfigured) {
          if (password !== DEMO_AUTH_PASSWORD) {
            throw new Error('Demo mode: use password demo1234')
          }
          const demoUser = {
            ...buildDemoUser(email),
            full_name: fullName || 'Demo Developer',
          }
          saveDemoUser(demoUser)
          get().setSession(asDemoSession(demoUser))
          return
        }

        try {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: fullName },
            },
          })
          if (error) throw error
        } catch (err) {
          if (isFetchFailure(err)) {
            if (password !== DEMO_AUTH_PASSWORD) {
              throw new Error('Supabase unreachable. Demo mode password: demo1234')
            }
            const demoUser = {
              ...buildDemoUser(email),
              full_name: fullName || 'Demo Developer',
            }
            saveDemoUser(demoUser)
            get().setSession(asDemoSession(demoUser))
            return
          }
          throw err
        }
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
        clearDemoUser()
        if (isSupabaseConfigured) {
          await supabase.auth.signOut()
        }
        set({ user: null, session: null, profile: null, isAuthenticated: false })
      },

      loadProfile: async () => {
        const demoUser = getDemoUser()
        if (demoUser) {
          set({
            profile: {
              id: demoUser.id,
              email: demoUser.email,
              full_name: demoUser.full_name,
              avatar_url: null,
              plan: 'pro',
              creator_mode: 'longform',
              videos_used: 0,
              videos_limit: 999999,
              created_at: new Date().toISOString(),
            },
          })
          return
        }

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

  const demoUser = getDemoUser()
  if (demoUser) {
    setSession(asDemoSession(demoUser))
    loadProfile()
    return
  }

  if (!isSupabaseConfigured) {
    setSession(null)
    return
  }

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
