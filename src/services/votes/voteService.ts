
import { supabase } from '@/lib/supabase';
import { VoteType, EntityType } from './types';

/**
 * Soumettre un vote pour une entité (ensemble, tenue ou défi)
 */
export const submitVote = async (
  entityType: EntityType,
  entityId: number,
  vote: VoteType,
  relatedEntityId?: number
): Promise<boolean> => {
  try {
    // Vérifier que l'utilisateur est connecté
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    
    if (!userId) {
      throw new Error("Utilisateur non connecté");
    }
    
    let tableName: string;
    let idColumnName: string;
    let voteColumnName: string;
    let relatedIdColumnName: string | undefined;
    
    // Déterminer la table et les colonnes selon le type d'entité
    if (entityType === 'ensemble' || entityType === 'tenue') {
      tableName = 'ensemble_votes';
      idColumnName = 'ensemble_id';
      voteColumnName = 'vote';
      relatedIdColumnName = undefined;
    } else {
      tableName = 'defi_votes';
      idColumnName = 'defi_id';
      voteColumnName = 'vote_type';
      relatedIdColumnName = 'tenue_id';
    }
    
    // Vérifier si l'utilisateur a déjà voté pour cette entité
    const query = supabase
      .from(tableName)
      .select('id')
      .eq(idColumnName, entityId)
      .eq('user_id', userId);
    
    if (relatedIdColumnName && relatedEntityId) {
      query.eq(relatedIdColumnName, relatedEntityId);
    }
    
    const { data: existingVote, error: checkError } = await query.maybeSingle();
    
    if (checkError) {
      console.error('Erreur lors de la vérification du vote:', checkError);
      return false;
    }
    
    // Si vote est null, supprimer le vote existant
    if (vote === null && existingVote) {
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', existingVote.id);
      
      if (deleteError) {
        console.error('Erreur lors de la suppression du vote:', deleteError);
        return false;
      }
      
      return true;
    }
    
    // Si l'utilisateur a déjà voté, mettre à jour son vote
    if (existingVote) {
      const { error: updateError } = await supabase
        .from(tableName)
        .update({ [voteColumnName]: vote })
        .eq('id', existingVote.id);
      
      if (updateError) {
        console.error('Erreur lors de la mise à jour du vote:', updateError);
        return false;
      }
    } else if (vote) { // Sinon, insérer un nouveau vote
      const insertData: any = {
        [idColumnName]: entityId,
        'user_id': userId,
        [voteColumnName]: vote
      };
      
      if (relatedIdColumnName && relatedEntityId) {
        insertData[relatedIdColumnName] = relatedEntityId;
      }
      
      const { error: insertError } = await supabase
        .from(tableName)
        .insert(insertData);
      
      if (insertError) {
        console.error('Erreur lors de l\'ajout du vote:', insertError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Erreur lors du vote:', error);
    return false;
  }
};

/**
 * Récupérer le vote d'un utilisateur pour une entité
 */
export const getUserVote = async (
  entityType: EntityType,
  entityId: number
): Promise<VoteType> => {
  try {
    // Vérifier que l'utilisateur est connecté
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) {
      console.log('Utilisateur non connecté, impossible de récupérer le vote');
      return null;
    }
    
    let tableName: string;
    let columnName: string;
    let voteColumnName: string;
    
    if (entityType === 'ensemble' || entityType === 'tenue') {
      tableName = 'ensemble_votes';
      columnName = 'ensemble_id';
      voteColumnName = 'vote';
    } else {
      tableName = 'defi_votes';
      columnName = 'defi_id';
      voteColumnName = 'vote_type';
    }
    
    const { data, error } = await supabase
      .from(tableName)
      .select(voteColumnName)
      .eq(columnName, entityId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Erreur lors de la récupération du vote:', error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    return data[voteColumnName] as VoteType;
  } catch (error) {
    console.error('Erreur lors de la récupération du vote:', error);
    return null;
  }
};

/**
 * Récupérer le nombre de votes pour une entité
 */
export const getVotesCount = async (
  entityType: EntityType,
  entityId: number
): Promise<{ up: number; down: number }> => {
  try {
    let tableName: string;
    let columnName: string;
    let voteColumnName: string;
    
    // Déterminer la table et la colonne selon le type d'entité
    if (entityType === 'ensemble' || entityType === 'tenue') {
      tableName = 'ensemble_votes';
      columnName = 'ensemble_id';
      voteColumnName = 'vote';
    } else {
      tableName = 'defi_votes';
      columnName = 'defi_id';
      voteColumnName = 'vote_type';
    }
    
    // Récupérer tous les votes pour l'entité
    const { data, error } = await supabase
      .from(tableName)
      .select(voteColumnName)
      .eq(columnName, entityId);
    
    if (error) {
      console.error('Erreur lors de la récupération des votes:', error);
      return { up: 0, down: 0 };
    }
    
    if (!data) {
      return { up: 0, down: 0 };
    }
    
    // Compter les votes positifs et négatifs
    const upVotes = data.filter(vote => vote[voteColumnName] === 'up').length;
    const downVotes = data.filter(vote => vote[voteColumnName] === 'down').length;
    
    return {
      up: upVotes,
      down: downVotes
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des votes:', error);
    return { up: 0, down: 0 };
  }
};
