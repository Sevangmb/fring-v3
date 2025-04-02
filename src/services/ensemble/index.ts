
// Export all ensemble service functions
export * from './types';
export * from './ensembleService';
export * from './ensembleStatsService';
export * from './fetchEnsemblesAmis';

// Delete ensemble function
export const deleteEnsemble = async (ensembleId: number): Promise<boolean> => {
  try {
    const { supabase } = await import('@/lib/supabase');
    // Delete the ensemble record
    const { error } = await supabase
      .from('tenues')
      .delete()
      .eq('id', ensembleId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting ensemble:', error);
    return false;
  }
};

// Re-export fetchEnsembles as fetchUserEnsembles for backward compatibility
import { fetchEnsembles } from './ensembleService';
export { fetchEnsembles as fetchUserEnsembles };
