
import { supabase } from '@/lib/supabase';
import { VoteType, EntityType } from './types';

/**
 * Soumettre un vote pour un élément (ensemble, défi, etc.)
 * @param elementType Type d'élément ('ensemble', 'defi', 'tenue')
 * @param elementId ID de l'élément
 * @param vote Type de vote (up/down/null)
 * @param ensembleId ID de l'ensemble (uniquement pour les votes dans un défi)
 * @returns Succès ou échec de l'opération
 */
export const submitVote = async (
  elementType: EntityType, 
  elementId: number, 
  vote: VoteType, 
  ensembleId?: number
): Promise<boolean> => {
  try {
    console.log(`Soumission du vote: type=${elementType}, id=${elementId}, vote=${vote}, ensembleId=${ensembleId}`);
    
    // Vérifier que l'utilisateur est connecté
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) {
      throw new Error('Vous devez être connecté pour voter');
    }
    
    // Si le type est "tenue", utiliser "ensemble" pour la table
    const effectiveType = elementType === "tenue" ? "ensemble" : elementType;
    
    // Si c'est un vote pour un ensemble dans un défi, rediriger vers le service spécialisé
    if (effectiveType === 'defi' && ensembleId !== undefined) {
      const { submitVote: submitDefiVote } = await import('@/services/defi/votes/submitVote');
      return await submitDefiVote(elementId, ensembleId, vote);
    }
    
    // Déterminer la table et les données pour le vote standard
    const tableName = `${effectiveType}_votes`;
    const data: Record<string, any> = {
      user_id: userId
    };
    
    // Ajout du vote en fonction de la structure de la table
    if (tableName === 'ensemble_votes') {
      data.vote = vote; // La table ensemble_votes utilise 'vote' et non 'vote_type'
    } else {
      data.vote_type = vote;
    }
    
    // Ajouter l'ID approprié selon le type d'élément
    if (effectiveType === 'ensemble') {
      data.ensemble_id = elementId;
    } else if (effectiveType === 'defi') {
      data.defi_id = elementId;
    }
    
    // Vérifier si l'utilisateur a déjà voté
    let query = supabase.from(tableName).select('id');
    
    if (effectiveType === 'ensemble') {
      query = query.eq('ensemble_id', elementId);
    } else if (effectiveType === 'defi') {
      query = query.eq('defi_id', elementId);
    }
    
    const { data: existingVote, error: queryError } = await query
      .eq('user_id', userId)
      .maybeSingle();
    
    if (queryError) {
      console.error('Erreur lors de la vérification du vote:', queryError);
      return false;
    }
    
    // Si vote est null, supprimer le vote
    if (vote === null && existingVote) {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', existingVote.id);
        
      if (error) {
        console.error('Erreur lors de la suppression du vote:', error);
        return false;
      }
      
      return true;
    }
    
    // Pas de vote et vote null = ne rien faire
    if (!existingVote && vote === null) {
      return true;
    }
    
    if (existingVote) {
      // Si le vote est identique, ne rien faire
      // Mettre à jour le vote existant
      let updateData = {};
      
      if (tableName === 'ensemble_votes') {
        updateData = { vote };
      } else {
        updateData = { vote_type: vote };
      }
      
      const { error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', existingVote.id);
      
      if (error) {
        console.error('Erreur lors de la mise à jour du vote:', error);
        return false;
      }
    } else if (vote) {
      // Créer un nouveau vote
      const { error } = await supabase
        .from(tableName)
        .insert([data]);
      
      if (error) {
        console.error('Erreur lors de l\'ajout du vote:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la soumission du vote:', error);
    return false;
  }
};
