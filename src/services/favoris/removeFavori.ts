
import { supabase } from '@/lib/supabase';

/**
 * Retire un élément des favoris
 */
export const removeFavori = async (
  type: 'utilisateur' | 'vetement' | 'ensemble',
  elementId: string | number
): Promise<boolean> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      throw new Error("Utilisateur non connecté");
    }

    // Convertir elementId en string s'il est de type number
    const elementIdStr = elementId.toString();

    const { error } = await supabase
      .from('favoris')
      .delete()
      .eq('user_id', userId)
      .eq('type_favori', type)
      .eq('element_id', elementIdStr);

    if (error) {
      console.error("Erreur lors de la suppression du favori:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression du favori:", error);
    return false;
  }
};
