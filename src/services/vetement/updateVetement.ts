
import { supabase } from '@/lib/supabase';
import { Vetement } from './types';
import { getCategorieById } from '@/services/categorieService';

/**
 * Updates an existing vetement with the given ID
 */
export const updateVetement = async (id: number, vetement: Partial<Vetement>): Promise<Vetement> => {
  try {
    // Vérification des paramètres
    if (!id || isNaN(id)) {
      throw new Error('ID de vêtement invalide');
    }
    
    if (!vetement || Object.keys(vetement).length === 0) {
      throw new Error('Données de vêtement invalides');
    }

    console.log('===== DÉBUT MISE À JOUR VÊTEMENT =====');
    console.log('ID:', id);
    console.log('Données envoyées pour mise à jour:', JSON.stringify(vetement, null, 2));
    
    // Récupérer les données actuelles du vêtement pour ne mettre à jour que ce qui a changé
    const { data: existingData, error: fetchError } = await supabase
      .from('vetements')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError) {
      console.error('ERREUR lors de la récupération du vêtement:', fetchError);
      throw fetchError;
    }
    
    console.log('Données existantes:', JSON.stringify(existingData, null, 2));
    
    // Nettoyer les données avant la mise à jour
    const cleanedData: any = {};
    
    // Liste de colonnes connues dans la table vetements
    const columnNames = [
      'id', 'nom', 'categorie_id', 'couleur', 'taille', 'description', 
      'marque', 'image_url', 'user_id', 'created_at', 'temperature', 'weather_type'
    ];
    
    console.log('Colonnes disponibles:', columnNames);
    
    // Vérifier la valeur de categorie_id
    if (vetement.categorie_id !== undefined) {
      // Vérifier si la catégorie existe
      const categorie = await getCategorieById(Number(vetement.categorie_id));
      
      if (!categorie && vetement.categorie_id !== 0) {
        console.warn(`La catégorie avec l'ID ${vetement.categorie_id} n'existe pas.`);
      }
      
      if (vetement.categorie_id === 0 || !categorie) {
        // Si categorie_id est 0 ou n'existe pas, c'est une valeur invalide - utiliser une valeur existante ou une valeur par défaut valide
        // Récupérer une catégorie valide
        const { data: firstCategorie } = await supabase
          .from('categories')
          .select('id')
          .limit(1)
          .single();
          
        if (firstCategorie) {
          console.log(`Remplacement de categorie_id=${vetement.categorie_id} par une valeur existante: ${firstCategorie.id}`);
          cleanedData['categorie_id'] = Number(firstCategorie.id);
        } else {
          // Garder la valeur existante si elle existe
          if (existingData.categorie_id) {
            console.log(`Conservation de la catégorie existante: ${existingData.categorie_id}`);
            cleanedData['categorie_id'] = existingData.categorie_id;
          } else {
            console.error('Impossible de trouver une catégorie valide');
            throw new Error('Aucune catégorie valide trouvée pour ce vêtement');
          }
        }
      } else {
        cleanedData['categorie_id'] = vetement.categorie_id;
      }
    }
    
    // Ne garder que les propriétés qui existent dans la table
    Object.entries(vetement).forEach(([key, value]) => {
      // Ne pas inclure les propriétés undefined, categorie_id (déjà traitée) ou qui n'existent pas dans la table
      if (value !== undefined && key !== 'categorie_id' && columnNames.includes(key)) {
        cleanedData[key] = value;
      } else if (value !== undefined && !columnNames.includes(key)) {
        // Cas spécial pour weatherType -> weather_type
        if (key === 'weatherType' && columnNames.includes('weather_type')) {
          cleanedData['weather_type'] = value;
        } else {
          console.log(`La colonne '${key}' n'existe pas dans la table vetements et sera ignorée`);
        }
      }
    });
    
    console.log('Données nettoyées pour mise à jour:', JSON.stringify(cleanedData, null, 2));
    
    // Faire la mise à jour avec les nouvelles données
    const { data, error } = await supabase
      .from('vetements')
      .update(cleanedData)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) {
      console.error('ERREUR Supabase lors de la mise à jour:', error);
      throw error;
    }
    
    console.log('Réponse Supabase après mise à jour:', data);
    console.log('===== FIN MISE À JOUR VÊTEMENT =====');
    
    return data as Vetement;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du vêtement:', error);
    throw error;
  }
};
