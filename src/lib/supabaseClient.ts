import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

// Create a placeholder client that will work with mock data
// When ready to connect, ensure VITE_SUPABASE_URL and VITE_SUPABASE_KEY are set
export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export const isSupabaseConnected = (): boolean => {
  return supabase !== null
}
