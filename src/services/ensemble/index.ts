
// Export ensemble types
export type { 
  Ensemble, 
  EnsembleCreateParams, 
  EnsembleUpdateParams,
  EnsembleCreateData,
  EnsembleUpdateData 
} from './types';

// Export ensemble services
export { 
  fetchEnsembles, 
  fetchEnsembleById, 
  createEnsemble, 
  updateEnsemble 
} from './ensembleService';

// Export stats service
export { getEnsembleStats } from './ensembleStatsService';

// Export friends ensembles service
export { fetchEnsemblesAmis } from './fetchEnsemblesAmis';

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

// Re-export fetchUserEnsembles for backward compatibility
export { fetchEnsembles as fetchUserEnsembles };
