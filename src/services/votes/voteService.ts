
import { supabase } from "@/lib/supabase";
import { VoteType, EntityType, VoteOptions, VotesCount } from "./types";
import { fetchWithRetry } from "../network/retryUtils";

/**
 * Soumettre un vote pour une entité
 */
export const submitVote = async (
  entityType: EntityType,
  entityId: number,
  vote: VoteType,
  options?: VoteOptions,
  extraFields?: Record<string, any>
): Promise<boolean> => {
  try {
    if (!navigator.onLine) {
      console.warn('Pas de connexion Internet');
      return false;
    }
    
    // Options par défaut
    const {
      tableName = `${entityType}_votes`,
      userIdField = "user_id",
      entityIdField = `${entityType}_id`,
      voteField = "vote"
    } = options || {};
    
    // Obtenir la session utilisateur actuelle
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Erreur de session:", sessionError);
      return false;
    }
    
    const userId = session?.user?.id;
    
    if (!userId) {
      console.error("Utilisateur non connecté");
      return false;
    }

    // Vérifier si l'utilisateur a déjà voté
    const { data: existingVote, error: existingVoteError } = await supabase
      .from(tableName)
      .select("id")
      .eq(entityIdField, entityId)
      .eq(userIdField, userId)
      .maybeSingle();
    
    if (existingVoteError) {
      console.error("Erreur lors de la vérification du vote existant:", existingVoteError);
      return false;
    }

    // Préparer les données du vote
    const voteData = {
      [entityIdField]: entityId,
      [userIdField]: userId,
      [voteField]: vote,
      ...extraFields
    };

    if (existingVote) {
      // Mettre à jour le vote existant
      const { error: updateError } = await supabase
        .from(tableName)
        .update({ [voteField]: vote })
        .eq("id", existingVote.id);
      
      if (updateError) {
        console.error("Erreur lors de la mise à jour du vote:", updateError);
        return false;
      }
    } else {
      // Créer un nouveau vote
      const { error: insertError } = await supabase
        .from(tableName)
        .insert(voteData);
      
      if (insertError) {
        console.error("Erreur lors de l'insertion du vote:", insertError);
        return false;
      }
    }
    
    return true;
  } catch (err: any) {
    console.error("Erreur lors de la soumission du vote:", err);
    return false;
  }
};

/**
 * Obtenir le vote de l'utilisateur pour une entité
 */
export const getUserVote = async (
  entityType: EntityType,
  entityId: number,
  options?: VoteOptions
): Promise<VoteType> => {
  try {
    if (!navigator.onLine) {
      console.warn('Pas de connexion Internet, impossible de récupérer le vote');
      return null;
    }
    
    // Options par défaut
    const {
      tableName = `${entityType}_votes`,
      userIdField = "user_id",
      entityIdField = `${entityType}_id`,
      voteField = "vote"
    } = options || {};
    
    // Obtenir la session utilisateur actuelle
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Erreur de session:", sessionError);
      return null;
    }
    
    const userId = session?.user?.id;
    
    if (!userId) return null;
    
    // Obtenir le vote de l'utilisateur
    const { data, error } = await supabase
      .from(tableName)
      .select(voteField)
      .eq(entityIdField, entityId)
      .eq(userIdField, userId)
      .maybeSingle();
    
    if (error) {
      console.error('Erreur lors de la récupération du vote:', error);
      return null;
    }
    
    return data ? data[voteField] : null;
  } catch (err) {
    console.error('Erreur lors de la récupération du vote:', err);
    return null;
  }
};

/**
 * Obtenir tous les votes pour une entité
 */
export const getVotesCount = async (
  entityType: EntityType,
  entityId: number,
  options?: VoteOptions
): Promise<VotesCount> => {
  try {
    if (!navigator.onLine) {
      console.warn('Pas de connexion Internet, impossible de récupérer les votes');
      return { up: 0, down: 0 };
    }
    
    // Options par défaut
    const {
      tableName = `${entityType}_votes`,
      entityIdField = `${entityType}_id`,
      voteField = "vote"
    } = options || {};
    
    // Obtenir les votes avec retry
    const response = await fetchWithRetry(async () => {
      const { data, error } = await supabase
        .from(tableName)
        .select(`${voteField}`)
        .eq(entityIdField, entityId);
      
      if (error) throw error;
      return data || [];
    }, 2);
    
    // Compter les votes
    const votes = response || [];
    const upVotes = votes.filter(item => item[voteField] === 'up').length;
    const downVotes = votes.filter(item => item[voteField] === 'down').length;
    
    return { up: upVotes, down: downVotes };
  } catch (err) {
    console.error('Erreur lors de la récupération des votes:', err);
    return { up: 0, down: 0 };
  }
};

/**
 * Calculer le score (votes positifs - votes négatifs)
 */
export const calculateScore = (votes: VotesCount): number => {
  return votes.up - votes.down;
};
