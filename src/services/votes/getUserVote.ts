
import { supabase } from "@/lib/supabase";
import { VoteType, EntityType, VoteOptions } from "./types";
import { isValidEntityId, isOnline } from "./utils/voteUtils";

/**
 * Obtenir le vote de l'utilisateur pour une entité
 */
export const getUserVote = async (
  entityType: EntityType,
  entityId: number | undefined,
  options?: VoteOptions
): Promise<VoteType> => {
  try {
    // Verify that entityId is provided
    if (!isValidEntityId(entityId)) {
      console.warn("ID de l'entité manquant lors de la récupération du vote");
      return null;
    }
    
    if (!isOnline()) {
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
