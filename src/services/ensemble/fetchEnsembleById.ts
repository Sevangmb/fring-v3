
import { supabase } from '@/lib/supabase';
import { Ensemble } from './types';

/**
 * Récupère un ensemble par son ID
 */
export const fetchEnsembleById = async (ensembleId: number): Promise<Ensemble | null> => {
  try {
    console.log(`Récupération de l'ensemble avec ID: ${ensembleId}`);
    
    // Récupérer l'ensemble
    const { data: ensembleData, error: ensembleError } = await supabase
      .from('tenues')
      .select('*')
      .eq('id', ensembleId)
      .single();

    if (ensembleError) {
      console.error("Erreur lors de la récupération de l'ensemble:", ensembleError);
      throw ensembleError;
    }

    if (!ensembleData) {
      console.error("Aucun ensemble trouvé avec l'ID:", ensembleId);
      return null;
    }

    console.log("Ensemble trouvé:", ensembleData);

    // Récupérer les vêtements associés à cet ensemble
    const { data: vetementsData, error: vetementsError } = await supabase
      .from('tenues_vetements')
      .select(`
        id,
        tenue_id,
        vetement_id,
        position_ordre,
        vetement:vetements(
          id,
          nom,
          description,
          image_url,
          couleur,
          taille,
          categorie_id,
          marque,
          weather_type,
          temperature
        )
      `)
      .eq('tenue_id', ensembleId)
      .order('position_ordre', { ascending: true });

    if (vetementsError) {
      console.error("Erreur lors de la récupération des vêtements de l'ensemble:", vetementsError);
      throw vetementsError;
    }

    console.log(`Nombre de vêtements trouvés: ${vetementsData?.length || 0}`);
    
    // Vérifier si les données des vêtements sont correctes
    if (vetementsData) {
      vetementsData.forEach((item, index) => {
        if (!item.vetement) {
          console.warn(`Vêtement ${index} sans données de vêtement:`, item);
        } else {
          // Traiter item.vetement comme un objet unique et non comme un tableau
          // TypeScript ne comprend pas bien le format retourné par Supabase ici
          const vetementObj = item.vetement as any; // Cast temporaire pour résoudre l'erreur TypeScript
          const vetementNom = vetementObj.nom || 'Sans nom';
          const vetementImageUrl = vetementObj.image_url || 'Aucune';
          console.log(`Vêtement ${index}:`, vetementNom, `URL image: ${vetementImageUrl}`);
        }
      });
    }

    return {
      ...ensembleData,
      vetements: vetementsData || []
    };
  } catch (error) {
    console.error("Erreur lors de la récupération de l'ensemble:", error);
    return null;
  }
};
