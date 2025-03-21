
import { supabase } from '@/lib/supabase';
import { Vetement } from './types';

/**
 * Adds a new vetement to the database, handling categorie_id properly
 */
export const addVetement = async (vetement: Omit<Vetement, 'id' | 'created_at'>): Promise<Vetement> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      throw new Error('Vous devez être connecté pour ajouter un vêtement');
    }

    console.log('Ajout d\'un vêtement avec les données:', vetement);
    
    // Vérifier quelles colonnes existent réellement dans la table
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'vetements')
      .eq('table_schema', 'public');
      
    if (columnsError) {
      console.error('Erreur lors de la récupération des colonnes:', columnsError);
    }
    
    // Créer un ensemble de noms de colonnes pour une recherche rapide
    const columnSet = new Set(columns?.map(col => col.column_name) || [
      'id', 'nom', 'categorie_id', 'couleur', 'taille', 'description', 
      'marque', 'image_url', 'user_id', 'created_at', 'temperature', 'weather_type'
    ]);
    
    console.log('Colonnes disponibles pour ajout:', Array.from(columnSet));
    
    // Ne garder que les propriétés qui existent dans la table
    const cleanedData: any = { 
      user_id: userId,
      categorie_id: vetement.categorie_id
    };
    
    // Ajouter les autres propriétés qui existent dans la table
    Object.entries(vetement).forEach(([key, value]) => {
      // Ne pas inclure les propriétés undefined ou qui n'existent pas dans la table
      if (value !== undefined && columnSet.has(key) && key !== 'categorie_id') {
        cleanedData[key] = value;
      } else if (value !== undefined && !columnSet.has(key)) {
        // Cas spécial pour weatherType -> weather_type
        if (key === 'weatherType' && columnSet.has('weather_type')) {
          cleanedData['weather_type'] = value;
        } else {
          console.log(`La colonne '${key}' n'existe pas dans la table vetements et sera ignorée`);
        }
      }
    });
    
    console.log('Données pour ajout après nettoyage:', cleanedData);

    const { data, error } = await supabase
      .from('vetements')
      .insert([cleanedData])
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de l\'ajout d\'un vêtement:', error);
      throw error;
    }
    
    return data as Vetement;
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'un vêtement:', error);
    throw error;
  }
};
