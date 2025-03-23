
import { supabase } from "@/lib/supabase";
import { VoteType, EntityType } from "./types";
import { fetchWithRetry } from "@/services/network/retryUtils";

interface VoteOptions {
  tableName: string;
  entityIdField: string;
  entityId: number;
  userIdField: string;
  userId: string;
  voteField: string;
  vote: VoteType;
  extraFields?: Record<string, any>;
}

/**
 * Fonction générique pour soumettre un vote dans une table
 */
export const submitVote = async (
  elementType: EntityType,
  elementId: number,
  vote: VoteType
): Promise<boolean> => {
  try {
    // Récupérer la session utilisateur
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      throw new Error('Vous devez être connecté pour voter');
    }

    // Configurer les options de vote selon le type d'élément
    const voteOptions: VoteOptions = getVoteOptions(elementType, elementId, userId, vote);
    console.info("Données de vote:", voteOptions);

    // Vérifier si l'utilisateur a déjà voté
    const { data: existingVote, error: fetchError } = await fetchWithRetry(
      async () => {
        const query = supabase
          .from(voteOptions.tableName)
          .select('id')
          .eq(voteOptions.entityIdField, voteOptions.entityId)
          .eq(voteOptions.userIdField, voteOptions.userId);

        // Ajouter des conditions supplémentaires si nécessaire
        return await query.maybeSingle();
      }
    );

    if (fetchError) throw fetchError;

    if (existingVote) {
      // Mettre à jour le vote existant
      const { error: updateError } = await fetchWithRetry(
        async () => {
          const updateData = { [voteOptions.voteField]: voteOptions.vote };
          return await supabase
            .from(voteOptions.tableName)
            .update(updateData)
            .eq('id', existingVote.id);
        }
      );

      if (updateError) throw updateError;
    } else {
      // Créer un nouveau vote
      const insertData = {
        [voteOptions.entityIdField]: voteOptions.entityId,
        [voteOptions.userIdField]: voteOptions.userId,
        [voteOptions.voteField]: voteOptions.vote,
        ...voteOptions.extraFields
      };

      const { error: insertError } = await fetchWithRetry(
        async () => {
          return await supabase
            .from(voteOptions.tableName)
            .insert(insertData);
        }
      );

      if (insertError) {
        console.error("Erreur lors de l'insertion du vote:", insertError);
        throw insertError;
      }
    }

    return true;
  } catch (error) {
    console.error("Erreur lors du vote:", error);
    throw error;
  }
};

/**
 * Obtenir les options de vote en fonction du type d'élément
 */
function getVoteOptions(
  elementType: EntityType,
  elementId: number,
  userId: string,
  vote: VoteType
): VoteOptions {
  // Configuration par défaut de base
  let voteOptions: VoteOptions = {
    tableName: '',
    entityIdField: '',
    entityId: elementId,
    userIdField: 'user_id',
    userId: userId,
    voteField: 'vote',
    vote: vote,
    extraFields: {}
  };

  switch (elementType) {
    case 'vetement':
      voteOptions.tableName = 'vetement_votes';
      voteOptions.entityIdField = 'vetement_id';
      break;
    case 'ensemble':
      voteOptions.tableName = 'tenue_votes';
      voteOptions.entityIdField = 'tenue_id';
      break;
    case 'defi':
      voteOptions.tableName = 'defi_votes';
      voteOptions.entityIdField = 'defi_id';
      break;
    default:
      throw new Error(`Type d'élément non pris en charge: ${elementType}`);
  }

  return voteOptions;
}
