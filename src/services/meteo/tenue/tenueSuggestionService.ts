
import { Vetement } from '@/services/vetement/types';
import { TenueSuggestion, VetementType } from './types';
import { determinerTypeVetement, estAdaptePluie, estAEviterPluie } from './vetementClassifier';

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
  if (temperature < 10) {
    tempCategory = 'froid';
  } else if (temperature > 20) {
    tempCategory = 'chaud';
  } else {
    tempCategory = 'tempere';
  }
  
  console.log(`Recherche de vêtements pour ${typeVetement}, température: ${tempCategory} (${temperature}°C), pluie: ${isRaining ? 'Oui' : 'Non'}`);
  
  // Filtrer par adaptation à la température (si disponible)
  const vetementsTemperatureOk = vetementsFiltered.filter(v => 
    !v.temperature || v.temperature === tempCategory
  );
  
  // Si aucun vêtement adapté à la température, utiliser tous les vêtements du type
  const vetementsEligibles = vetementsTemperatureOk.length > 0 ? vetementsTemperatureOk : vetementsFiltered;
  
  // S'il pleut, privilégier fortement les vêtements adaptés à la pluie
  if (isRaining) {
    console.log(`Recherche de vêtements adaptés à la pluie pour ${typeVetement}`);
    
    // 1. Vêtements explicitement adaptés à la pluie
    const vetementsAdaptesPluie = vetementsEligibles.filter(v => 
      estAdaptePluie(v) || v.weatherType === 'pluie'
    );
    
    if (vetementsAdaptesPluie.length > 0) {
      console.log(`${vetementsAdaptesPluie.length} vêtements adaptés à la pluie trouvés pour ${typeVetement}`);
      // Choisir aléatoirement parmi les vêtements adaptés à la pluie
      return vetementsAdaptesPluie[Math.floor(Math.random() * vetementsAdaptesPluie.length)];
    }
    
    // 2. Exclure les vêtements à éviter sous la pluie
    const vetementsNonDeconseilles = vetementsEligibles.filter(v => !estAEviterPluie(v));
    
    if (vetementsNonDeconseilles.length > 0) {
      console.log(`${vetementsNonDeconseilles.length} vêtements non déconseillés sous la pluie trouvés pour ${typeVetement}`);
      return vetementsNonDeconseilles[Math.floor(Math.random() * vetementsNonDeconseilles.length)];
    }
    
    console.log(`Aucun vêtement idéal pour la pluie trouvé pour ${typeVetement}, utilisation d'un vêtement standard`);
  } else if (tempCategory === 'chaud') {
    // S'il fait chaud, privilégier les vêtements légers
    const vetementsLegers = vetementsEligibles.filter(v => 
      v.description?.toLowerCase().includes('léger') || 
      v.description?.toLowerCase().includes('leger') ||
      v.temperature === 'chaud'
    );
    
    if (vetementsLegers.length > 0) {
      console.log(`${vetementsLegers.length} vêtements légers trouvés pour ${typeVetement}`);
      return vetementsLegers[Math.floor(Math.random() * vetementsLegers.length)];
    }
  } else if (tempCategory === 'froid') {
    // S'il fait froid, privilégier les vêtements chauds
    const vetementsChauds = vetementsEligibles.filter(v => 
      v.description?.toLowerCase().includes('chaud') || 
      v.description?.toLowerCase().includes('épais') ||
      v.description?.toLowerCase().includes('epais') ||
      v.temperature === 'froid'
    );
    
    if (vetementsChauds.length > 0) {
      console.log(`${vetementsChauds.length} vêtements chauds trouvés pour ${typeVetement}`);
      return vetementsChauds[Math.floor(Math.random() * vetementsChauds.length)];
    }
  }
  
  // Choisir aléatoirement parmi les vêtements éligibles
  return vetementsEligibles[Math.floor(Math.random() * vetementsEligibles.length)];
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
    
    // Sélectionner un haut, un bas et des chaussures adaptés
    const haut = await selectionnerVetementAdapte(vetements, temperature, isRaining, VetementType.HAUT);
    const bas = await selectionnerVetementAdapte(vetements, temperature, isRaining, VetementType.BAS);
    const chaussures = await selectionnerVetementAdapte(vetements, temperature, isRaining, VetementType.CHAUSSURES);
    
    console.log(`Suggestion générée: Haut=${haut?.nom || 'Non trouvé'}, Bas=${bas?.nom || 'Non trouvé'}, Chaussures=${chaussures?.nom || 'Non trouvé'}`);
    
    return { haut, bas, chaussures };
  } catch (error) {
    console.error('Erreur lors de la suggestion de vêtements:', error);
    return { haut: null, bas: null, chaussures: null };
  }
};
