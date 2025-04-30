
import { Vetement } from '@/services/vetement/types';
import { TenueSuggestion, VetementType } from './types';
import { determinerTypeVetement } from './vetementTypeClassifier';
import { estAdaptePluie, estAEviterPluie } from './waterproofUtils';

/**
 * Sélectionne un vêtement adapté à la température et à la météo
 */
const selectionnerVetementAdapte = async (
  vetements: Vetement[], 
  temperature: number, 
  isRaining: boolean, 
  typeVetement: VetementType
): Promise<Vetement | null> => {
  // Filtrer les vêtements par type
  const vetementsFiltered = [];
  
  for (const vetement of vetements) {
    const type = await determinerTypeVetement(vetement);
    if (type === typeVetement) {
      vetementsFiltered.push(vetement);
    }
  }
  
  if (vetementsFiltered.length === 0) return null;
  
  // Déterminer la catégorie de température
  let tempCategory: 'froid' | 'tempere' | 'chaud';
  if (temperature < 15) {
    tempCategory = 'froid';
  } else if (temperature > 25) {
    tempCategory = 'chaud';
  } else {
    tempCategory = 'tempere';
  }
  
  console.log(`Recherche de vêtements pour ${typeVetement}, température: ${tempCategory} (${temperature}°C), pluie: ${isRaining ? 'Oui' : 'Non'}`);
  
  // Filtrer par adaptation à la température (si disponible)
  let vetementsTemperatureOk = vetementsFiltered;
  
  // Pour les températures froides, privilégier fortement les vêtements chauds
  if (tempCategory === 'froid') {
    const vetementsFroid = vetementsFiltered.filter(v => 
      v.temperature === 'froid' || 
      (v.description && (
        v.description.toLowerCase().includes('hiver') || 
        v.description.toLowerCase().includes('chaud') || 
        v.description.toLowerCase().includes('épais')
      ))
    );
    
    if (vetementsFroid.length > 0) {
      vetementsTemperatureOk = vetementsFroid;
    }
  }
  // Pour les températures chaudes, privilégier fortement les vêtements légers/d'été
  else if (tempCategory === 'chaud') {
    const vetementsChauds = vetementsFiltered.filter(v => 
      v.temperature === 'chaud' || 
      (v.description && (
        v.description.toLowerCase().includes('été') || 
        v.description.toLowerCase().includes('ete') || 
        v.description.toLowerCase().includes('léger') ||
        v.description.toLowerCase().includes('leger')
      ))
    );
    
    if (vetementsChauds.length > 0) {
      vetementsTemperatureOk = vetementsChauds;
    }
  }
  
  // S'il pleut, privilégier fortement les vêtements adaptés à la pluie
  if (isRaining) {
    console.log(`Recherche de vêtements adaptés à la pluie pour ${typeVetement}`);
    
    // 1. Vêtements explicitement adaptés à la pluie
    const vetementsAdaptesPluie = vetementsTemperatureOk.filter(v => 
      estAdaptePluie(v) || v.weather_type === 'pluie'
    );
    
    if (vetementsAdaptesPluie.length > 0) {
      console.log(`${vetementsAdaptesPluie.length} vêtements adaptés à la pluie trouvés pour ${typeVetement}`);
      // Choisir aléatoirement parmi les vêtements adaptés à la pluie
      return vetementsAdaptesPluie[Math.floor(Math.random() * vetementsAdaptesPluie.length)];
    }
    
    // 2. Exclure les vêtements à éviter sous la pluie
    const vetementsNonDeconseilles = vetementsTemperatureOk.filter(v => !estAEviterPluie(v));
    
    if (vetementsNonDeconseilles.length > 0) {
      console.log(`${vetementsNonDeconseilles.length} vêtements non déconseillés sous la pluie trouvés pour ${typeVetement}`);
      return vetementsNonDeconseilles[Math.floor(Math.random() * vetementsNonDeconseilles.length)];
    }
  } 
  // S'il fait beau, ÉVITER les vêtements adaptés à la pluie
  else {
    console.log(`Recherche de vêtements adaptés au beau temps pour ${typeVetement}`);
    
    // Exclusion des vêtements spécifiquement adaptés à la pluie quand il fait beau
    const vetementsBeauTemps = vetementsTemperatureOk.filter(v => 
      v.weather_type !== 'pluie' && !estAdaptePluie(v)
    );
    
    // S'il y a des vêtements adaptés au beau temps, les privilégier
    if (vetementsBeauTemps.length > 0) {
      console.log(`${vetementsBeauTemps.length} vêtements adaptés au beau temps trouvés pour ${typeVetement}`);
      return vetementsBeauTemps[Math.floor(Math.random() * vetementsBeauTemps.length)];
    }
  }
  
  // Choisir aléatoirement parmi les vêtements selon la température
  return vetementsTemperatureOk[Math.floor(Math.random() * vetementsTemperatureOk.length)];
};

/**
 * Suggère une tenue complète (haut, bas, chaussures) adaptée à la température et à la météo
 */
export const suggestVetements = async (
  vetements: Vetement[], 
  temperature: number, 
  isRaining: boolean
): Promise<TenueSuggestion> => {
  try {
    console.log(`Génération de suggestion de tenue: Température ${temperature}°C, Pluie: ${isRaining ? 'Oui' : 'Non'}`);
    
    // Vérifier si nous avons suffisamment de vêtements
    if (!vetements || vetements.length === 0) {
      console.warn("Aucun vêtement disponible pour générer une suggestion");
      return { haut: null, bas: null, chaussures: null };
    }
    
    // Essayer jusqu'à 3 fois pour s'assurer d'avoir une tenue complète
    let haut = null, bas = null, chaussures = null;
    let tentatives = 0;
    
    while ((haut === null || bas === null || chaussures === null) && tentatives < 3) {
      tentatives++;
      console.log(`Tentative ${tentatives} de génération de tenue complète`);
      
      // Sélectionner un haut, un bas et des chaussures adaptés
      if (haut === null) {
        haut = await selectionnerVetementAdapte(vetements, temperature, isRaining, VetementType.HAUT);
      }
      
      if (bas === null) {
        bas = await selectionnerVetementAdapte(vetements, temperature, isRaining, VetementType.BAS);
      }
      
      if (chaussures === null) {
        chaussures = await selectionnerVetementAdapte(vetements, temperature, isRaining, VetementType.CHAUSSURES);
      }
    }
    
    console.log(`Suggestion générée: 
      Haut=${haut?.nom || 'Non trouvé'}, 
      Bas=${bas?.nom || 'Non trouvé'}, 
      Chaussures=${chaussures?.nom || 'Non trouvé'}
    `);
    
    // Ajouter un avertissement si certains éléments sont manquants
    if (!haut || !bas || !chaussures) {
      console.warn("Tenue incomplète générée. Certains vêtements n'ont pas été trouvés.");
    }
    
    return { haut, bas, chaussures };
  } catch (error) {
    console.error('Erreur lors de la suggestion de vêtements:', error);
    return { haut: null, bas: null, chaussures: null };
  }
};
