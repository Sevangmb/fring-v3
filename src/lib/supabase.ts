
import { createClient } from '@supabase/supabase-js'

// Default to empty strings if env variables are not defined
// This will allow the app to at least render rather than crashing
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Log a warning instead of an error
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Les variables d\'environnement Supabase ne sont pas définies. L\'authentification ne fonctionnera pas correctement.')
}

// Create a mock client if credentials are missing to prevent crashes
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)
