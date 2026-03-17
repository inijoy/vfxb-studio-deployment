const AUTH_STORE_KEY = 'vfxb-auth'

type PersistedAuthShape = {
  state?: {
    token?: string | null
  }
}

export function getStoredAuthToken(): string | null {
  try {
    const raw = localStorage.getItem(AUTH_STORE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistedAuthShape
    return parsed?.state?.token ?? null
  } catch {
    return null
  }
}

export function clearStoredAuth(): void {
  localStorage.removeItem(AUTH_STORE_KEY)
}
