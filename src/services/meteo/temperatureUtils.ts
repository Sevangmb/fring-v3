
/**
 * Utilitaires de calcul pour les températures et conditions météo
 */

export type TemperatureType = 'froid' | 'tempere' | 'chaud';
export type WeatherType = 'normal' | 'pluie' | 'neige';

export interface WeatherTenue {
  temperature?: TemperatureType;
  weather?: WeatherType;
}

/**
 * Calcule un score de compatibilité entre deux températures
 * @param vetementTemp Température du vêtement
 * @param targetTemp Température cible
 * @returns Score entre 0 et 1 (1 = parfaitement adapté)
 */
export const calculateTemperatureScore = (vetementTemp: TemperatureType, targetTemp: TemperatureType): number => {
  const tempValues = {
    'froid': 0,
    'tempere': 1,
    'chaud': 2
  };

  const vetementValue = tempValues[vetementTemp];
  const targetValue = tempValues[targetTemp];
  
  // Score parfait si même température
  if (vetementValue === targetValue) {
    return 1;
  }
  
  // Score moyen pour température adjacente (ex: tempere pour froid)
  if (Math.abs(vetementValue - targetValue) === 1) {
    return 0.5;
  }
  
  // Score nul pour différence extrême
  return 0.2;
};
