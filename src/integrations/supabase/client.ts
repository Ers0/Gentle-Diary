import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Only create the client if we have valid credentials
let supabase
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error)
    supabase = null
  }
} else {
  console.warn('Supabase credentials not found. Cloud features will be disabled.')
  supabase = null
}

export { supabase }