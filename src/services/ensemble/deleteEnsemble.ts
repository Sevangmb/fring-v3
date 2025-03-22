
import { supabase } from '@/lib/supabase';

/**
 * Supprime un ensemble et ses associations avec les vêtements
 */
export const deleteEnsemble = async (ensembleId: number): Promise<void> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      throw new Error("Utilisateur non connecté");
    }

    // Vérifier que l'ensemble appartient à l'utilisateur
    const { data: ensemble, error: ensembleError } = await supabase
      .from('tenues')
      .select('id')
      .eq('id', ensembleId)
      .eq('user_id', userId)
      .single();

    if (ensembleError || !ensemble) {
      console.error("Erreur lors de la vérification de l'ensemble:", ensembleError);
      throw new Error("Vous n'êtes pas autorisé à supprimer cet ensemble");
    }

    // Supprimer d'abord les associations tenues_vetements
    const { error: deleteAssociationsError } = await supabase
      .from('tenues_vetements')
      .delete()
      .eq('tenue_id', ensembleId);

    if (deleteAssociationsError) {
      console.error("Erreur lors de la suppression des associations de vêtements:", deleteAssociationsError);
      throw deleteAssociationsError;
    }

    // Supprimer l'ensemble
    const { error: deleteEnsembleError } = await supabase
      .from('tenues')
      .delete()
      .eq('id', ensembleId);

    if (deleteEnsembleError) {
      console.error("Erreur lors de la suppression de l'ensemble:", deleteEnsembleError);
      throw deleteEnsembleError;
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de l'ensemble:", error);
    throw error;
  }
};
