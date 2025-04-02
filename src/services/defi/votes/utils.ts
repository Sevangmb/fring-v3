
import { supabase } from '@/lib/supabase';

/**
 * Récupère l'ID de l'utilisateur actuel
 */
export const getCurrentUser = async (): Promise<string | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id || null;
};
