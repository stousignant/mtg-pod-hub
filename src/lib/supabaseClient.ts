import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a placeholder client that will work with mock data
// When ready to connect, ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export const isSupabaseConnected = (): boolean => {
  const connected = supabase !== null
  if (!connected) {
    console.warn(
      'Supabase not connected. Using mock data. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env'
    )
  } else {
    console.log('✅ Supabase connected:', supabaseUrl)
  }
  return connected
}
