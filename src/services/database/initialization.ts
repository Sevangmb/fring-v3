
import { supabase, checkTableExists, checkFunctionExists } from '@/lib/supabase';
import { initializeCategories } from '@/services/categorieService';
import { initializeMarques } from '@/services/marqueService';
import { initializeVetements } from '@/services/vetement';
import { addDemoVetements } from '@/services/vetement/demoVetements';
import { initializeAmisTable } from '@/services/amis';
import { initializeEnsembleData } from './ensembleInitialization';

export const initializeDatabase = async () => {
  try {
    // Vérifie si la connexion à Supabase est établie
    const isConnected = await checkSupabaseConnection();
    if (!isConnected) {
      console.error('La connexion à Supabase a échoué. Veuillez vérifier votre configuration.');
      return false;
    }
    
    // Vérifie si la table vetements existe
    const vetementsTableExists = await checkTableExists('vetements');
    
    // Si la table vetements n'existe pas, on initialise les tables et les données
    if (!vetementsTableExists) {
      console.warn('La table vetements n\'existe pas encore, initialisation...');
      
      // Initialise les tables (catégories, marques, vetements)
      await initializeCategories();
      await initializeMarques();
      await initializeVetements();
      await initializeAmisTable();
      
      // Ajoute des vêtements de démonstration
      await addDemoVetements();
    }
    
    // Vérifie si les fonctions nécessaires existent
    const createTableFunctionExists = await checkFunctionExists('create_table');
    const execSqlFunctionExists = await checkFunctionExists('exec_sql');
    
    if (!createTableFunctionExists || !execSqlFunctionExists) {
      console.warn('Les fonctions SQL nécessaires ne sont pas toutes disponibles');
      console.warn('Veuillez exécuter le script SQL dans l\'interface Supabase');
    }
    
    // Initialize ensemble data structure
    await initializeEnsembleData();
    
    console.log('Database initialization completed successfully');
    return true;
  } catch (error) {
    console.error('Error during database initialization:', error);
    return false;
  }
};

// Fonction pour vérifier la connexion à Supabase
const checkSupabaseConnection = async () => {
  try {
    // Vérifie si la connexion à Supabase est établie
    const { error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Erreur de connexion à Supabase:', error);
      return false;
    }
    
    console.log('Connexion à Supabase établie avec succès');
    return true;
  } catch (error) {
    console.error('Erreur de connexion à Supabase:', error);
    return false;
  }
};
