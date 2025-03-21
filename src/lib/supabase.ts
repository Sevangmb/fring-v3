
import { createClient } from '@supabase/supabase-js'

// Configuration des variables Supabase
const supabaseUrl = 'https://scogbjfwcpdwzkeejgsx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjb2diamZ3Y3Bkd3prZWVqZ3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NDQ3NDUsImV4cCI6MjA1ODEyMDc0NX0.vTGxoFGFUrUW0eO5_vbTZgPhSTWKXPL5vrwY4bZt_YU'

// Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Log pour confirmer l'initialisation
console.log('Client Supabase initialisé avec succès')

// Fonction pour vérifier la connexion à Supabase
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('_test_connection_').select('*').limit(1);
    
    if (error) {
      // Une erreur 42P01 signifie que la table n'existe pas, ce qui est attendu
      if (error.code === '42P01') {
        console.log('Connexion à Supabase établie avec succès');
        return true;
      } else {
        throw error;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Erreur de connexion à Supabase:', error);
    return false;
  }
};
