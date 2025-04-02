
export * from './types';
export * from './fetchEnsembles';
// export * from './fetchEnsemblesAmis'; // Commenté car non existant pour l'instant
export * from './fetchEnsembleById';
export * from './createEnsemble';
export * from './votes';

// Ajout des exports manquants
export const deleteEnsemble = async (ensembleId: number): Promise<boolean> => {
  try {
    const { supabase } = await import('@/lib/supabase');
    const { error } = await supabase
      .from('tenues')
      .delete()
      .eq('id', ensembleId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'ensemble:", error);
    return false;
  }
};

// Alias pour fetchEnsembles pour compatibilité
export const fetchUserEnsembles = async () => {
  const { fetchEnsembles } = await import('./fetchEnsembles');
  return fetchEnsembles();
};

// Fonction pour mettre à jour un ensemble
export const updateEnsemble = async (ensemble: any): Promise<boolean> => {
  try {
    const { supabase } = await import('@/lib/supabase');
    
    // Mise à jour des informations de base de l'ensemble
    const { error: ensembleError } = await supabase
      .from('tenues')
      .update({
        nom: ensemble.nom,
        description: ensemble.description,
        occasion: ensemble.occasion,
        saison: ensemble.saison
      })
      .eq('id', ensemble.id);
    
    if (ensembleError) throw ensembleError;
    
    // Suppression des vêtements existants de l'ensemble
    const { error: deleteError } = await supabase
      .from('tenues_vetements')
      .delete()
      .eq('tenue_id', ensemble.id);
    
    if (deleteError) throw deleteError;
    
    // Ajout des nouveaux vêtements
    const vetementPromises = ensemble.vetements.map(async (item: any, index: number) => {
      const { error: vetementError } = await supabase
        .from('tenues_vetements')
        .insert({
          tenue_id: ensemble.id,
          vetement_id: item.id,
          position_ordre: index
        });
      
      if (vetementError) throw vetementError;
    });
    
    await Promise.all(vetementPromises);
    
    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'ensemble:", error);
    return false;
  }
};
