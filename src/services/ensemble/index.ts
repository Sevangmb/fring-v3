
// Export ensemble types
export type { 
  Ensemble, 
  EnsembleCreateParams, 
  EnsembleUpdateParams
} from './types';

// Export ensemble services
export { 
  createEnsemble, 
  updateEnsemble 
} from './ensembleService';

// Re-export ensembleService functions
export { fetchEnsembleById, fetchEnsembles } from './ensembleService';

// Export fetch ensembles from friends
export { fetchEnsemblesAmis } from './fetchEnsemblesAmis';

// Re-export fetchUserEnsembles 
export { fetchUserEnsembles } from './fetchUserEnsembles';

// Export stats service
export { getEnsembleStats } from './ensembleStatsService';

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
