
import { supabase } from '@/lib/supabase';

/**
 * Vérifie si un élément est déjà dans les favoris de l'utilisateur
 */
export const isFavori = async (
  type: 'utilisateur' | 'vetement' | 'ensemble',
  elementId: string | number
): Promise<boolean> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      return false;
    }

    // Convertir elementId en string s'il est de type number
    const elementIdStr = elementId.toString();

    const { data, error, count } = await supabase
      .from('favoris')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('type_favori', type)
      .eq('element_id', elementIdStr);

    if (error) {
      console.error("Erreur lors de la vérification du favori:", error);
      throw error;
    }

    return (count ?? 0) > 0;
  } catch (error) {
    console.error("Erreur lors de la vérification du favori:", error);
    return false;
  }
};
