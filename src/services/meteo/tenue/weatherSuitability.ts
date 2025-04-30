
import { Vetement } from "@/services/vetement/types";
import { VetementType } from "./types";
import { calculateTemperatureScore, TemperatureType, WeatherTenue, WeatherType } from "../temperatureUtils";
import { removeDiacritics } from "@/lib/stringUtils";
import { checkWaterproofAttributes } from "./waterproofUtils";
import { determinerTypeVetement } from "./vetementTypeClassifier";

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
