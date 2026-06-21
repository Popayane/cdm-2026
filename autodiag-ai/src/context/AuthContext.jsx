import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const AuthContext = createContext(null)
const DEMO_KEY = 'autodiag.demoUser'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data }) => {
        setUser(data.session?.user ?? null)
        setLoading(false)
      })
      const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
        setUser(session?.user ?? null)
      })
      return () => sub.subscription.unsubscribe()
    }
    // Mode démo
    try {
      const saved = JSON.parse(localStorage.getItem(DEMO_KEY))
      if (saved) setUser(saved)
    } catch {}
    setLoading(false)
  }, [])

  async function signInWithEmail(email, password) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return
    }
    demoLogin(email)
  }

  async function signUpWithEmail(email, password) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      return
    }
    demoLogin(email)
  }

  async function signInWithGoogle() {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      })
      if (error) throw error
      return
    }
    demoLogin('compte.google@gmail.com')
  }

  function demoLogin(email) {
    const u = {
      id: 'demo-' + btoa(email).slice(0, 8),
      email,
      user_metadata: { name: email.split('@')[0] },
      demo: true,
    }
    localStorage.setItem(DEMO_KEY, JSON.stringify(u))
    setUser(u)
  }

  async function signOut() {
    if (isSupabaseConfigured) await supabase.auth.signOut()
    localStorage.removeItem(DEMO_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemo: !isSupabaseConfigured,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
