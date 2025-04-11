
import { supabase } from '@/lib/supabase';
import { VoteType, EntityType } from './types';

/**
 * Récupère le vote d'un utilisateur pour une entité
 * @param entityType Type de l'entité ('ensemble' ou 'tenue')
 * @param entityId ID de l'entité
 * @returns Type de vote ou null si l'utilisateur n'a pas voté
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
    
    console.log(`Récupération du vote pour ${entityType} ${entityId} par l'utilisateur ${userId}`);
    
    // Récupérer le vote de l'utilisateur
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
