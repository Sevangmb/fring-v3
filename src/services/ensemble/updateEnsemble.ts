
import { supabase } from '@/lib/supabase';
import { EnsembleUpdateParams } from './types';

/**
 * Met à jour un ensemble existant
 */
export const updateEnsemble = async (data: EnsembleUpdateParams): Promise<void> => {
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
      .eq('id', data.id)
      .eq('user_id', userId)
      .single();

    if (ensembleError || !ensemble) {
      console.error("Erreur lors de la vérification de l'ensemble:", ensembleError);
      throw new Error("Vous n'êtes pas autorisé à modifier cet ensemble");
    }

    // Mettre à jour les informations de base de l'ensemble
    const updateData: any = {};
    if (data.nom) updateData.nom = data.nom;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.occasion !== undefined) updateData.occasion = data.occasion;
    if (data.saison !== undefined) updateData.saison = data.saison;

    const { error: updateError } = await supabase
      .from('tenues')
      .update(updateData)
      .eq('id', data.id);

    if (updateError) {
      console.error("Erreur lors de la mise à jour de l'ensemble:", updateError);
      throw updateError;
    }

    // Si des vêtements sont fournis, mettre à jour les associations
    if (data.vetements && data.vetements.length > 0) {
      // Supprimer d'abord les associations existantes
      const { error: deleteAssociationsError } = await supabase
        .from('tenues_vetements')
        .delete()
        .eq('tenue_id', data.id);

      if (deleteAssociationsError) {
        console.error("Erreur lors de la suppression des associations de vêtements:", deleteAssociationsError);
        throw deleteAssociationsError;
      }

      // Ajouter les nouvelles associations
      const vetementEntries = data.vetements.map((vetement, index) => ({
        tenue_id: data.id,
        vetement_id: vetement.id,
        position_ordre: index
      }));

      const { error: vetementError } = await supabase
        .from('tenues_vetements')
        .insert(vetementEntries);

      if (vetementError) {
        console.error("Erreur lors de l'association des vêtements:", vetementError);
        throw vetementError;
      }
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'ensemble:", error);
    throw error;
  }
};
