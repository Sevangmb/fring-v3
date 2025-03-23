
import { supabase } from "@/lib/supabase";
import { VoteType, EntityType, VoteOptions } from "./types";
import { isValidEntityId, isOnline } from "./utils/voteUtils";

/**
 * Soumettre un vote pour une entité
 */
export const submitVote = async (
  entityType: EntityType,
  entityId: number | undefined,
  vote: VoteType,
  options?: VoteOptions,
  extraFields?: Record<string, any>
): Promise<boolean> => {
  try {
    // Verify that entityId is provided and valid
    if (!isValidEntityId(entityId)) {
      console.error(`Erreur: ID de l'entité manquant ou invalide: ${entityId}`);
      return false;
    }
    
    if (!isOnline()) {
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

    // Log les données avant insertion pour débogage
    console.log("Données de vote:", {
      tableName,
      entityIdField,
      entityId,
      userIdField,
      userId,
      voteField,
      vote,
      extraFields
    });

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
