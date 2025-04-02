
import { supabase } from '@/lib/supabase';
import { VoteType } from './types';

/**
 * Submit a vote for an ensemble or defi
 * @param entityId ID of the defi or ensemble
 * @param targetId ID of the ensemble or other entity being voted on
 * @param voteType Type of vote (up or down)
 * @param entityType Type of entity ('ensemble' or 'defi')
 * @returns Success status
 */
export const submitVote = async (
  entityId: number,
  targetId: number, 
  voteType: VoteType,
  entityType: 'ensemble' | 'defi' = 'ensemble'
): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user?.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Determine which table to use based on entity type
    const tableName = entityType === 'ensemble' ? 'ensemble_votes' : 'defi_votes';
    const entityIdColumn = entityType === 'ensemble' ? 'defi_id' : 'entity_id';
    const targetIdColumn = entityType === 'ensemble' ? 'ensemble_id' : 'target_id';
    
    // Check if user has already voted for this entity
    const { data: existingVote, error: checkError } = await supabase
      .from(tableName)
      .select('*')
      .eq(entityIdColumn, entityId)
      .eq(targetIdColumn, targetId)
      .eq('user_id', userId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
    
    if (existingVote) {
      // Update existing vote
      const { error: updateError } = await supabase
        .from(tableName)
        .update({ vote_type: voteType })
        .eq('id', existingVote.id);
      
      if (updateError) throw updateError;
    } else {
      // Create new vote
      const voteData: any = {
        user_id: userId,
        vote_type: voteType
      };
      
      // Set the correct field names based on entity type
      voteData[entityIdColumn] = entityId;
      voteData[targetIdColumn] = targetId;
      
      const { error: insertError } = await supabase
        .from(tableName)
        .insert(voteData);
      
      if (insertError) throw insertError;
    }
    
    return true;
  } catch (error) {
    console.error('Error submitting vote:', error);
    return false;
  }
};
