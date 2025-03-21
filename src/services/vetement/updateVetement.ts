
import { supabase } from '@/lib/supabase';
import { Vetement } from './types';

/**
 * Updates an existing vetement with the given ID, handling the relation with categories properly
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
      'id', 'nom', 'categorie', 'categorie_id', 'couleur', 'taille', 'description', 
      'marque', 'image_url', 'user_id', 'created_at', 'temperature', 'weather_type'
    ]);
    
    console.log('Colonnes disponibles:', Array.from(columnSet));
    
    // Priorité à categorie_id s'il est fourni
    if (vetement.categorie_id) {
      cleanedData['categorie_id'] = vetement.categorie_id;
      
      // Récupérer le nom de la catégorie pour maintenir la cohérence
      const { data: categorieData } = await supabase
        .from('categories')
        .select('nom')
        .eq('id', vetement.categorie_id)
        .single();
      
      if (categorieData && categorieData.nom) {
        cleanedData['categorie'] = categorieData.nom;
      } else if (vetement.categorie) {
        // Utiliser le nom de catégorie fourni comme fallback
        cleanedData['categorie'] = vetement.categorie;
      }
    } 
    // Si pas de categorie_id mais nom de catégorie fourni et différent de l'existant
    else if (vetement.categorie && vetement.categorie !== existingData.categorie) {
      cleanedData['categorie'] = vetement.categorie;
      
      // Essayer de trouver l'ID de catégorie correspondant
      const { data: categorieData } = await supabase
        .from('categories')
        .select('id')
        .eq('nom', vetement.categorie)
        .maybeSingle();
      
      if (categorieData && categorieData.id) {
        cleanedData['categorie_id'] = categorieData.id;
      } else {
        // Si la catégorie n'existe pas, supprimer la référence à l'ancienne catégorie
        cleanedData['categorie_id'] = null;
      }
    }
    
    // Ne garder que les propriétés qui existent dans la table
    Object.entries(vetement).forEach(([key, value]) => {
      // Ne pas inclure les propriétés undefined ou qui n'existent pas dans la table
      // Éviter également de redéfinir categorie et categorie_id qui ont déjà été traités
      if (value !== undefined && columnSet.has(key) && key !== 'categorie' && key !== 'categorie_id') {
        cleanedData[key] = value;
      } else if (value !== undefined && !columnSet.has(key)) {
        console.log(`La colonne '${key}' n'existe pas dans la table vetements et sera ignorée`);
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
