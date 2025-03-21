
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
  const tempCategory = temperature < 10 ? 'froid' : temperature > 20 ? 'chaud' : 'tempere';
  
  // Filtrer par adaptation à la température (si disponible)
  const vetementsTemperatureOk = vetementsFiltered.filter(v => 
    !v.temperature || v.temperature === tempCategory
  );
  
  // Si aucun vêtement adapté à la température, utiliser tous les vêtements du type
  const vetementsEligibles = vetementsTemperatureOk.length > 0 ? vetementsTemperatureOk : vetementsFiltered;
  
  // S'il pleut, privilégier les vêtements adaptés à la pluie et éviter ceux qui ne le sont pas
  if (isRaining) {
    // Vêtements explicitement adaptés à la pluie
    const vetementsAdaptesPluie = vetementsEligibles.filter(v => 
      estAdaptePluie(v) || v.weatherType === 'pluie'
    );
    
    if (vetementsAdaptesPluie.length > 0) {
      // Choisir aléatoirement parmi les vêtements adaptés à la pluie
      return vetementsAdaptesPluie[Math.floor(Math.random() * vetementsAdaptesPluie.length)];
    }
    
    // Sinon, exclure les vêtements à éviter sous la pluie
    const vetementsNonDeconseilles = vetementsEligibles.filter(v => !estAEviterPluie(v));
    
    if (vetementsNonDeconseilles.length > 0) {
      return vetementsNonDeconseilles[Math.floor(Math.random() * vetementsNonDeconseilles.length)];
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
    // Sélectionner un haut, un bas et des chaussures adaptés
    const haut = await selectionnerVetementAdapte(vetements, temperature, isRaining, VetementType.HAUT);
    const bas = await selectionnerVetementAdapte(vetements, temperature, isRaining, VetementType.BAS);
    const chaussures = await selectionnerVetementAdapte(vetements, temperature, isRaining, VetementType.CHAUSSURES);
    
    return { haut, bas, chaussures };
  } catch (error) {
    console.error('Erreur lors de la suggestion de vêtements:', error);
    return { haut: null, bas: null, chaussures: null };
  }
};
