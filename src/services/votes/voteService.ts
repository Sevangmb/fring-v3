
import { supabase } from "@/lib/supabase";
import { VoteType, EntityType } from "./types";
import { fetchWithRetry } from "@/services/network/retryUtils";

/**
 * Soumettre un vote pour un type d'entité spécifique
 */
export const submitVote = async (
  entityType: EntityType,
  entityId: number,
  vote: VoteType
): Promise<boolean> => {
  console.log(`Soumission de vote: ${entityType}, ${entityId}, ${vote}`);
  try {
    // Obtenir la session utilisateur
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      throw new Error("Vous devez être connecté pour voter");
    }

    // Déterminer la table de votes en fonction du type d'entité
    const tableName = getVoteTableName(entityType);
    const entityField = getEntityField(entityType);

    // Vérifier si l'utilisateur a déjà voté
    const { data: existingVote, error: fetchError } = await fetchWithRetry(
      async () => await supabase
        .from(tableName)
        .select('id')
        .eq(entityField, entityId)
        .eq('user_id', session.user.id)
        .maybeSingle()
    );

    if (fetchError) {
      console.error("Erreur lors de la recherche d'un vote existant:", fetchError);
      throw fetchError;
    }

    if (existingVote) {
      // Mettre à jour le vote existant
      const { error: updateError } = await fetchWithRetry(
        async () => await supabase
          .from(tableName)
          .update({ vote: vote })
          .eq('id', existingVote.id)
      );

      if (updateError) {
        console.error("Erreur lors de la mise à jour du vote:", updateError);
        throw updateError;
      }
    } else {
      // Insérer un nouveau vote
      const { error: insertError } = await fetchWithRetry(
        async () => await supabase
          .from(tableName)
          .insert({
            [entityField]: entityId,
            user_id: session.user.id,
            vote: vote
          })
      );

      if (insertError) {
        console.error("Erreur lors de l'insertion du vote:", insertError);
        throw insertError;
      }
    }

    console.log(`Vote ${vote} enregistré avec succès pour ${entityType} ${entityId}`);
    return true;
  } catch (error) {
    console.error("Erreur lors du vote:", error);
    throw error;
  }
};

/**
 * Obtenir le vote d'un utilisateur pour une entité
 */
export const getUserVote = async (
  entityType: EntityType,
  entityId: number
): Promise<VoteType> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) return null;

    const tableName = getVoteTableName(entityType);
    const entityField = getEntityField(entityType);

    const { data, error } = await fetchWithRetry(
      async () => await supabase
        .from(tableName)
        .select('vote')
        .eq(entityField, entityId)
        .eq('user_id', session.user.id)
        .maybeSingle()
    );

    if (error) {
      console.error("Erreur lors de la récupération du vote:", error);
      throw error;
    }

    return data ? data.vote : null;
  } catch (error) {
    console.error("Erreur lors de la récupération du vote de l'utilisateur:", error);
    return null;
  }
};

/**
 * Obtenir le nombre de votes pour une entité
 */
export const getVotesCount = async (
  entityType: EntityType,
  entityId: number
): Promise<{ up: number; down: number }> => {
  try {
    const tableName = getVoteTableName(entityType);
    const entityField = getEntityField(entityType);

    // Obtenir le nombre de votes positifs
    const { data: upVotes, error: upError } = await fetchWithRetry(
      async () => await supabase
        .from(tableName)
        .select('id', { count: 'exact', head: true })
        .eq(entityField, entityId)
        .eq('vote', 'up')
    );

    // Obtenir le nombre de votes négatifs
    const { data: downVotes, error: downError } = await fetchWithRetry(
      async () => await supabase
        .from(tableName)
        .select('id', { count: 'exact', head: true })
        .eq(entityField, entityId)
        .eq('vote', 'down')
    );

    if (upError || downError) {
      console.error("Erreur lors du comptage des votes:", upError || downError);
      throw upError || downError;
    }

    return {
      up: upVotes?.length || 0,
      down: downVotes?.length || 0
    };
  } catch (error) {
    console.error("Erreur lors du comptage des votes:", error);
    return { up: 0, down: 0 };
  }
};

/**
 * Calculer le score (votes positifs - votes négatifs)
 */
export const calculateScore = (votes: { up: number; down: number }): number => {
  return votes.up - votes.down;
};

// Fonctions utilitaires pour obtenir les noms de tables et de champs
function getVoteTableName(entityType: EntityType): string {
  switch (entityType) {
    case 'vetement': return 'vetement_votes';
    case 'ensemble': return 'tenue_votes';
    case 'defi': return 'defi_votes';
    default: throw new Error(`Type d'entité non pris en charge: ${entityType}`);
  }
}

function getEntityField(entityType: EntityType): string {
  switch (entityType) {
    case 'vetement': return 'vetement_id';
    case 'ensemble': return 'tenue_id';
    case 'defi': return 'defi_id';
    default: throw new Error(`Type d'entité non pris en charge: ${entityType}`);
  }
}
