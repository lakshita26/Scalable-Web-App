import { writable } from "svelte/store"

interface User {
  id: number
  email: string
  username: string
  full_name: string | null
  created_at: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
}

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
  })

  return {
    subscribe,
    setUser: (user: User, token: string) => {
      localStorage.setItem("access_token", token)
      set({ user, token, isAuthenticated: true, loading: false })
    },
    clearAuth: () => {
      localStorage.removeItem("access_token")
      set({ user: null, token: null, isAuthenticated: false, loading: false })
    },
    setLoading: (loading: boolean) => update((state) => ({ ...state, loading })),
    initializeFromStorage: () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("access_token")
        if (token) {
          update((state) => ({
            ...state,
            token,
            isAuthenticated: true,
          }))
        }
      }
    },
  }
}

export const authStore = createAuthStore()
