
import { supabase } from '@/lib/supabase';
import { VoteType, EntityType } from './types';

/**
 * Soumet un vote pour un élément
 * @param elementType Type d'élément ('ensemble' ou 'defi')
 * @param elementId ID de l'élément
 * @param vote Type de vote ('up', 'down' ou null pour annuler)
 * @param ensembleId ID de l'ensemble (uniquement pour les votes dans un défi)
 * @returns true si le vote a été soumis avec succès
 */
export const submitVote = async (
  elementType: EntityType,
  elementId: number,
  vote: VoteType,
  ensembleId?: number
): Promise<boolean> => {
  try {
    // Vérifier que l'utilisateur est connecté
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) {
      throw new Error("Vous devez être connecté pour voter");
    }

    console.info(`Soumission du vote: type=${elementType}, id=${elementId}, vote=${vote}, ensembleId=${ensembleId || 0}`);
    
    // Cas spécial: vote pour un ensemble dans un défi
    if (elementType === 'defi' && ensembleId !== undefined) {
      console.info(`Vote défi_id=${elementId}, tenue_id=${ensembleId}, vote=${vote}, user_id=${userId}`);
      
      // Vérifier s'il existe déjà un vote
      const { data: existingVote, error: checkError } = await supabase
        .from('defi_votes')
        .select('id, vote_type')
        .eq('defi_id', elementId)
        .eq('tenue_id', ensembleId)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError) {
        console.error("Erreur lors de la vérification du vote:", checkError);
        throw checkError;
      }
      
      // Si le vote est nul (annulation) et qu'il existe un vote précédent
      if (vote === null && existingVote) {
        const { error: deleteError } = await supabase
          .from('defi_votes')
          .delete()
          .eq('id', existingVote.id);
        
        if (deleteError) {
          console.error("Erreur lors de la suppression du vote:", deleteError);
          throw deleteError;
        }
        
        console.info(`Vote pour défi #${elementId} supprimé`);
        return true;
      }
      
      // Si c'est un nouveau vote ou une modification
      if (vote) {
        if (existingVote) {
          // Mettre à jour le vote existant
          const { error: updateError } = await supabase
            .from('defi_votes')
            .update({ vote_type: vote })
            .eq('id', existingVote.id);
          
          if (updateError) {
            console.error("Erreur lors de la mise à jour du vote:", updateError);
            throw updateError;
          }
        } else {
          // Créer un nouveau vote
          const { error: insertError } = await supabase
            .from('defi_votes')
            .insert({
              defi_id: elementId,
              tenue_id: ensembleId,
              user_id: userId,
              vote_type: vote
            });
          
          if (insertError) {
            console.error("Erreur lors de l'ajout du vote:", insertError);
            throw insertError;
          }
        }
        
        console.info(`Vote ${vote} pour défi #${elementId} enregistré`);
        return true;
      }
      
      return false;
    }
    
    // Pour les votes standards sur un ensemble ou un défi
    const tableName = `${elementType}_votes`;
    const idColumnName = `${elementType}_id`;
    
    // Pour les votes d'ensemble, utiliser "vote" au lieu de "vote_type"
    const voteColumnName = tableName === 'ensemble_votes' ? 'vote' : 'vote_type';
    
    // Si le type est "tenue", on l'enregistre dans la table ensemble_votes
    if (elementType === 'tenue') {
      console.info(`Vote pour tenue #${elementId} traité comme ensemble`);
      
      const { data: existingVote, error: checkError } = await supabase
        .from('ensemble_votes')
        .select('id, vote')
        .eq('ensemble_id', elementId)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError) {
        console.error("Erreur lors de la vérification du vote:", checkError);
        throw checkError;
      }
      
      // Si le vote est nul (annulation) et qu'il existe un vote précédent
      if (vote === null && existingVote) {
        const { error: deleteError } = await supabase
          .from('ensemble_votes')
          .delete()
          .eq('id', existingVote.id);
        
        if (deleteError) {
          console.error("Erreur lors de la suppression du vote:", deleteError);
          throw deleteError;
        }
        
        return true;
      }
      
      // Si c'est un nouveau vote ou une modification
      if (vote) {
        if (existingVote) {
          // Mettre à jour le vote existant
          const { error: updateError } = await supabase
            .from('ensemble_votes')
            .update({ vote })
            .eq('id', existingVote.id);
          
          if (updateError) {
            console.error("Erreur lors de la mise à jour du vote:", updateError);
            throw updateError;
          }
        } else {
          // Créer un nouveau vote
          const { error: insertError } = await supabase
            .from('ensemble_votes')
            .insert({
              ensemble_id: elementId,
              user_id: userId,
              vote
            });
          
          if (insertError) {
            console.error("Erreur lors de l'ajout du vote:", insertError);
            throw insertError;
          }
        }
        
        return true;
      }
      
      return false;
    }
    
    // Pour les votes standards (ensemble ou défi)
    const { data: existingVote, error: checkError } = await supabase
      .from(tableName)
      .select(`id, ${voteColumnName}`)
      .eq(idColumnName, elementId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (checkError) {
      console.error("Erreur lors de la vérification du vote:", checkError);
      throw checkError;
    }
    
    // Si le vote est nul (annulation) et qu'il existe un vote précédent
    if (vote === null && existingVote) {
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', existingVote.id);
      
      if (deleteError) {
        console.error("Erreur lors de la suppression du vote:", deleteError);
        throw deleteError;
      }
      
      return true;
    }
    
    // Si c'est un nouveau vote ou une modification
    if (vote) {
      const voteData = { [voteColumnName]: vote };
      
      if (existingVote) {
        // Mettre à jour le vote existant
        const { error: updateError } = await supabase
          .from(tableName)
          .update(voteData)
          .eq('id', existingVote.id);
        
        if (updateError) {
          console.error("Erreur lors de la mise à jour du vote:", updateError);
          throw updateError;
        }
      } else {
        // Créer un nouveau vote
        const newVote = {
          [idColumnName]: elementId,
          user_id: userId,
          ...voteData
        };
        
        const { error: insertError } = await supabase
          .from(tableName)
          .insert(newVote);
        
        if (insertError) {
          console.error("Erreur lors de l'ajout du vote:", insertError);
          throw insertError;
        }
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Erreur lors de la soumission du vote:", error);
    throw error;
  }
};
