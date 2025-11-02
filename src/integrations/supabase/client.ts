import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Key present' : 'Key missing')

// Only create the client if we have valid credentials
let supabase
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.log('Supabase client initialized successfully')
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error)
    supabase = null
  }
} else {
  console.warn('Supabase credentials not found. Cloud features will be disabled.')
  console.info('To enable cloud features, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.')
  supabase = null
}

export { supabase }