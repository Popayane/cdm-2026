import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// When Supabase credentials are not provided, the app runs in "demo mode":
// authentication and persistence are emulated with localStorage so the whole
// product is fully usable out of the box. Provide the env vars to switch to a
// real Supabase backend automatically.
export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey)
  : null
