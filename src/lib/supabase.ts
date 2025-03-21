
import { createClient } from '@supabase/supabase-js'

// Configuration des variables Supabase
const supabaseUrl = 'https://scogbjfwcpdwzkeejgsx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjb2diamZ3Y3Bkd3prZWVqZ3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NDQ3NDUsImV4cCI6MjA1ODEyMDc0NX0.vTGxoFGFUrUW0eO5_vbTZgPhSTWKXPL5vrwY4bZt_YU'

// Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Log pour confirmer l'initialisation
console.log('Client Supabase initialisé avec succès')
