
export * from './ensembleService';
export * from './ensembleStatsService';

// Add alias for fetchEnsembles as fetchUserEnsembles for backward compatibility
import { fetchEnsembles } from './ensembleService';
export const fetchUserEnsembles = fetchEnsembles;

// Delete ensemble function
export const deleteEnsemble = async (ensembleId: number): Promise<boolean> => {
  try {
    const { supabase } = await import('@/lib/supabase');
    
    // Delete the ensemble record
    const { error } = await supabase
      .from('ensembles')
      .delete()
      .eq('id', ensembleId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting ensemble:', error);
    return false;
  }
};

// Update ensemble function
export const updateEnsemble = async (ensembleId: number, data: any): Promise<boolean> => {
  try {
    const { supabase } = await import('@/lib/supabase');
    
    // Update the ensemble record
    const { error } = await supabase
      .from('ensembles')
      .update(data)
      .eq('id', ensembleId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating ensemble:', error);
    return false;
  }
};
