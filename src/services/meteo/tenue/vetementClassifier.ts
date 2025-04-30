
import { Vetement } from "@/services/vetement/types";
import { VetementType } from "./types";
import { calculateTemperatureScore, TemperatureType, WeatherTenue, WeatherType } from "../temperatureUtils";
import { removeDiacritics } from "@/lib/stringUtils";

/**
 * Cette fonction évalue si un vêtement convient pour une tenue pour une certaine météo
 * @param vetement Le vêtement à évaluer
 * @param weatherTenue Informations sur les conditions météo souhaitées
 * @returns Score entre 0 et 100 indiquant la pertinence du vêtement pour cette météo
 */
export const evaluateVetementForWeather = async (
  vetement: Vetement, 
  weatherTenue: WeatherTenue
): Promise<number> => {
  if (!vetement) return 0;
  
  // Scores cumulatifs pour différents critères
  let totalScore = 0;
  let maxPossibleScore = 0;
  
  // 1. Score pour la température
  if (weatherTenue.temperature && vetement.temperature) {
    // S'assurer que la température est de type TemperatureType
    const vetementTemp = vetement.temperature as TemperatureType;
    
    const temperatureScore = calculateTemperatureScore(
      vetementTemp,
      weatherTenue.temperature
    );
    
    totalScore += temperatureScore * 50; // Pondération de la température
    maxPossibleScore += 50;
  }
  
  // 2. Score pour le type de météo (pluie, neige)
  if (weatherTenue.weather && vetement.weather_type) {
    // Si le temps est normal, tous les vêtements sont adaptés
    if (weatherTenue.weather === 'normal') {
      totalScore += 30;
    } 
    // Si le vêtement est spécifiquement adapté au temps en cours
    else if (vetement.weather_type === weatherTenue.weather) {
      totalScore += 30;
    } 
    // Si le vêtement est spécifié pour la pluie mais qu'il neige
    else if (vetement.weather_type === 'pluie' && weatherTenue.weather === 'neige') {
      totalScore += 15; // Partiellement adapté
    }
    // Si le vêtement est adapté à la neige mais qu'il pleut
    else if (vetement.weather_type === 'neige' && weatherTenue.weather === 'pluie') {
      totalScore += 20; // Assez bien adapté
    }
    // Si le vêtement est adapté pour un temps spécifique mais qu'il fait normal
    else if (vetement.weather_type !== 'normal' && typeof weatherTenue.weather === 'string') {
      totalScore += 15; // Moins idéal mais acceptable
    }
    // Dans les autres cas (vêtement normal par temps de pluie/neige)
    else {
      totalScore += 5; // Peu adapté
    }
    
    maxPossibleScore += 30;
  }
  
  // 3. Score additionnel selon le type de vêtement (haut/bas/chaussures)
  const vetementType = await determinerTypeVetement(vetement);
  
  // Ajuster les scores pour certaines combinaisons spécifiques
  if (weatherTenue.weather === 'pluie') {
    // Pour la pluie, les chaussures imperméables sont importantes
    if (vetementType === VetementType.CHAUSSURES) {
      // Vérifier si le nom ou la description mentionne l'imperméabilité
      const isWaterproof = checkWaterproofAttributes(vetement);
      totalScore += isWaterproof ? 20 : 0;
      maxPossibleScore += 20;
    }
    
    // Pour la pluie, les vêtements imperméables sont importants pour le haut
    if (vetementType === VetementType.HAUT) {
      // Vérifier si le nom ou la description mentionne l'imperméabilité
      const isWaterproof = checkWaterproofAttributes(vetement);
      totalScore += isWaterproof ? 15 : 0;
      maxPossibleScore += 15;
    }
  }
  
  // Pour la neige, les vêtements chauds et imperméables sont importants
  if (weatherTenue.weather === 'neige') {
    const isWarm = vetement.temperature === 'chaud';
    const isWaterproof = checkWaterproofAttributes(vetement);
    
    if (vetementType === VetementType.CHAUSSURES) {
      totalScore += isWaterproof ? 15 : 0;
      totalScore += isWarm ? 10 : 0;
      maxPossibleScore += 25;
    }
    
    if (vetementType === VetementType.HAUT || vetementType === VetementType.BAS) {
      totalScore += isWaterproof ? 10 : 0;
      totalScore += isWarm ? 15 : 0;
      maxPossibleScore += 25;
    }
  }
  
  // Calculer le score final sur 100
  const finalScore = maxPossibleScore > 0 
    ? Math.round((totalScore / maxPossibleScore) * 100)
    : 50; // Score par défaut si aucun critère n'a été évalué
    
  return Math.min(100, Math.max(0, finalScore)); // Garantir que le score est entre 0 et 100
};

/**
 * Vérifie si les attributs du vêtement indiquent qu'il est imperméable
 */
function checkWaterproofAttributes(vetement: Vetement): boolean {
  const waterproofTerms = ['imperméable', 'impermeable', 'étanche', 'etanche', 'waterproof', 'pluie'];
  
  // Vérifier dans le nom
  const name = removeDiacritics(vetement.nom.toLowerCase());
  if (waterproofTerms.some(term => name.includes(removeDiacritics(term)))) {
    return true;
  }
  
  // Vérifier dans la description si présente
  if (vetement.description) {
    const description = removeDiacritics(vetement.description.toLowerCase());
    if (waterproofTerms.some(term => description.includes(removeDiacritics(term)))) {
      return true;
    }
  }
  
  // Si le vêtement est spécifiquement marqué pour la pluie
  if (vetement.weather_type === 'pluie') {
    return true;
  }
  
  return false;
}

/**
 * Détermine le type de vêtement (haut, bas ou chaussures)
 * @param vetement Vêtement à analyser
 * @returns Le type de vêtement
 */
export const determinerTypeVetement = async (vetement: Vetement): Promise<VetementType> => {
  // Détermine le type de vêtement en fonction de sa catégorie
  // Dans une implémentation réelle, on utiliserait une table de correspondance depuis la BDD
  const categorieId = vetement.categorie_id;
  
  // Exemple simple basé sur des IDs hypothétiques
  // Hauts: 1, 4, 7
  // Bas: 2, 5, 8 
  // Chaussures: 3, 6, 9
  
  if ([1, 4, 7].includes(categorieId)) {
    return VetementType.HAUT;
  }
  
  if ([2, 5, 8].includes(categorieId)) {
    return VetementType.BAS;
  }
  
  if ([3, 6, 9].includes(categorieId)) {
    return VetementType.CHAUSSURES;
  }
  
  // Analyse du nom si catégorie inconnue
  const normalizedName = vetement.nom.toLowerCase();
  
  // Liste des termes pour chaque type
  const hautsTerms = ['tshirt', 't-shirt', 'chemise', 'pull', 'veste', 'sweat', 'manteau', 'haut'];
  const basTerms = ['pantalon', 'jean', 'short', 'jupe', 'bas'];
  const chaussuresTerms = ['chaussure', 'basket', 'botte', 'sandale', 'mocassin'];
  
  if (hautsTerms.some(term => normalizedName.includes(term))) {
    return VetementType.HAUT;
  }
  
  if (basTerms.some(term => normalizedName.includes(term))) {
    return VetementType.BAS;
  }
  
  if (chaussuresTerms.some(term => normalizedName.includes(term))) {
    return VetementType.CHAUSSURES;
  }
  
  // Par défaut, on considère que c'est un haut
  return VetementType.HAUT;
};

/**
 * Vérifie si un vêtement est adapté pour la pluie
 */
export const estAdaptePluie = (vetement: Vetement): boolean => {
  if (!vetement) return false;
  
  // Vérifier si le vêtement est spécifiquement marqué pour la pluie
  if (vetement.weather_type === 'pluie') {
    return true;
  }
  
  return checkWaterproofAttributes(vetement);
};

/**
 * Vérifie si un vêtement est à éviter sous la pluie
 */
export const estAEviterPluie = (vetement: Vetement): boolean => {
  if (!vetement) return false;
  
  // Liste des termes indiquant des vêtements à éviter sous la pluie
  const termsToAvoid = ['daim', 'suède', 'suede', 'toile', 'canvas', 'lin'];
  
  const name = removeDiacritics((vetement.nom || '').toLowerCase());
  const description = removeDiacritics((vetement.description || '').toLowerCase());
  
  // Vérifier les termes à éviter
  for (const term of termsToAvoid) {
    if (name.includes(term) || description.includes(term)) {
      return true;
    }
  }
  
  return false;
};
