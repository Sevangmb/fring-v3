
import { supabase } from '@/lib/supabase';

/**
 * Ajoute un élément aux favoris
 */
export const addFavori = async (
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
      .insert({
        user_id: userId,
        type_favori: type,
        element_id: elementIdStr
      });

    if (error) {
      // Si l'erreur est due à une violation de contrainte unique, ce n'est pas une erreur
      if (error.code === '23505') {
        console.log("Ce favori existe déjà");
        return true;
      }
      console.error("Erreur lors de l'ajout du favori:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de l'ajout du favori:", error);
    return false;
  }
};
