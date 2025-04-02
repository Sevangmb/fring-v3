
import { supabase } from '@/lib/supabase';
import { VetementType } from '@/services/meteo/tenue';

export interface Ensemble {
  id: number;
  nom: string;
  description?: string;
  saison?: string;
  occasion?: string;
  user_id: string;
  created_at: string;
  vetements: {
    id: number;
    vetement: any;
    position_ordre?: number;
  }[];
}

export interface EnsembleCreateParams {
  nom: string;
  description?: string;
  saison?: string;
  occasion?: string;
  vetements: {
    id: number;
    type: VetementType;
  }[];
}

export interface EnsembleUpdateParams {
  id: number;
  nom: string;
  description?: string;
  saison?: string;
  occasion?: string;
  vetements: {
    id: number;
    type: VetementType;
  }[];
}

export const fetchEnsembles = async (): Promise<Ensemble[]> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const { data, error } = await supabase
      .from('tenues')
      .select(`
        *,
        vetements:tenues_vetements(
          id,
          vetement:vetement_id(*),
          position_ordre
        )
      `)
      .eq('user_id', sessionData.session?.user?.id);
    
    if (error) throw error;
    
    return data as unknown as Ensemble[];
  } catch (error) {
    console.error('Error fetching ensembles:', error);
    return [];
  }
};

export const fetchEnsembleById = async (id: number): Promise<Ensemble | null> => {
  try {
    const { data, error } = await supabase
      .from('tenues')
      .select(`
        *,
        vetements:tenues_vetements(
          id,
          vetement:vetement_id(*),
          position_ordre
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data as unknown as Ensemble;
  } catch (error) {
    console.error(`Error fetching ensemble ${id}:`, error);
    return null;
  }
};

export const createEnsemble = async (params: EnsembleCreateParams): Promise<number | null> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    
    // Insérer l'ensemble
    const { data, error } = await supabase
      .from('tenues')
      .insert({
        nom: params.nom,
        description: params.description,
        saison: params.saison,
        occasion: params.occasion,
        user_id: sessionData.session?.user?.id,
      })
      .select()
      .single();
    
    if (error) throw error;

    const ensembleId = data.id;
    
    // Insérer les associations avec les vêtements
    for (let i = 0; i < params.vetements.length; i++) {
      const { error: vetementError } = await supabase
        .from('tenues_vetements')
        .insert({
          tenue_id: ensembleId,
          vetement_id: params.vetements[i].id,
          position_ordre: i
        });
      
      if (vetementError) throw vetementError;
    }
    
    return ensembleId;
  } catch (error) {
    console.error('Error creating ensemble:', error);
    return null;
  }
};

export const updateEnsemble = async (params: EnsembleUpdateParams): Promise<boolean> => {
  try {
    // Mettre à jour les informations de l'ensemble
    const { error } = await supabase
      .from('tenues')
      .update({
        nom: params.nom,
        description: params.description,
        saison: params.saison,
        occasion: params.occasion,
      })
      .eq('id', params.id);
    
    if (error) throw error;
    
    // Supprimer les associations existantes
    const { error: deleteError } = await supabase
      .from('tenues_vetements')
      .delete()
      .eq('tenue_id', params.id);
    
    if (deleteError) throw deleteError;
    
    // Insérer les nouvelles associations
    for (let i = 0; i < params.vetements.length; i++) {
      const { error: vetementError } = await supabase
        .from('tenues_vetements')
        .insert({
          tenue_id: params.id,
          vetement_id: params.vetements[i].id,
          position_ordre: i
        });
      
      if (vetementError) throw vetementError;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating ensemble:', error);
    return false;
  }
};
