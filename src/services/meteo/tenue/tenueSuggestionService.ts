
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
  
  // Pré-vérification de debug
  console.log(`Recherche de vêtements de type ${typeVetement}, collection: ${vetements.length} items`);
  
  for (const vetement of vetements) {
    const type = await determinerTypeVetement(vetement);
    if (type === typeVetement) {
      console.log(`Vêtement trouvé pour type ${typeVetement}: ${vetement.nom} (ID: ${vetement.id})`);
      vetementsFiltered.push(vetement);
    }
  }
  
  console.log(`Nombre de ${typeVetement} trouvés: ${vetementsFiltered.length}`);
  
  if (vetementsFiltered.length === 0) {
    console.warn(`Aucun vêtement trouvé pour le type: ${typeVetement}`);
    return null;
  }
  
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
    
    // 1. AMÉLIORATION: Priorité absolue aux vêtements explicitement adaptés à la pluie
    const vetementsExplicitementPluie = vetementsTemperatureOk.filter(v => 
      v.weather_type === 'pluie'
    );
    
    if (vetementsExplicitementPluie.length > 0) {
      console.log(`${vetementsExplicitementPluie.length} vêtements explicitement marqués pour la pluie trouvés pour ${typeVetement}`);
      return vetementsExplicitementPluie[Math.floor(Math.random() * vetementsExplicitementPluie.length)];
    }
    
    // 2. Deuxième priorité: vêtements adaptés à la pluie selon leur description
    const vetementsAdaptesPluie = vetementsTemperatureOk.filter(v => 
      estAdaptePluie(v) && v.weather_type !== 'pluie'
    );
    
    if (vetementsAdaptesPluie.length > 0) {
      console.log(`${vetementsAdaptesPluie.length} vêtements adaptés à la pluie trouvés pour ${typeVetement}`);
      return vetementsAdaptesPluie[Math.floor(Math.random() * vetementsAdaptesPluie.length)];
    }
    
    // 3. Dernière priorité: exclure les vêtements à éviter sous la pluie
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
    
    // AMÉLIORATION: Séparation claire entre les vêtements adaptés à la pluie et les autres
    let vetementsAdaptesPluie = [];
    let vetementsNormaux = [...vetements];
    
    if (isRaining) {
      // Pré-filtrer les vêtements pour la pluie
      vetementsAdaptesPluie = vetements.filter(v => 
        v.weather_type === 'pluie' || estAdaptePluie(v)
      );
      console.log(`Nombre de vêtements adaptés à la pluie: ${vetementsAdaptesPluie.length}`);
    }
    
    // Commencer par chercher les chaussures pour éviter une mauvaise classification
    let chaussures = await selectionnerVetementAdapte(vetements, temperature, isRaining, VetementType.CHAUSSURES);
    console.log(`Chaussures sélectionnées: ${chaussures?.nom || 'Non trouvées'}`);
    
    // Créer une liste de vêtements sans les chaussures trouvées pour éviter de réutiliser le même item
    const vetementsRestants = chaussures ? vetements.filter(v => v.id !== chaussures?.id) : vetements;
    
    // Ensuite sélectionner un haut
    const haut = await selectionnerVetementAdapte(vetementsRestants, temperature, isRaining, VetementType.HAUT);
    console.log(`Haut sélectionné: ${haut?.nom || 'Non trouvé'}`);
    
    // Puis un bas
    const vetementsRestantsSansPull = haut ? vetementsRestants.filter(v => v.id !== haut?.id) : vetementsRestants;
    const bas = await selectionnerVetementAdapte(vetementsRestantsSansPull, temperature, isRaining, VetementType.BAS);
    console.log(`Bas sélectionné: ${bas?.nom || 'Non trouvé'}`);
    
    // Nouvelle tentative pour les chaussures si non trouvées
    if (!chaussures) {
      console.log("Seconde tentative pour trouver des chaussures...");
      const vetementsFiltrés = vetements.filter(v => {
        const nom = v.nom.toLowerCase();
        return nom.includes('chaussure') || 
               nom.includes('basket') || 
               nom.includes('botte') || 
               nom.includes('sandale');
      });
      
      if (vetementsFiltrés.length > 0) {
        chaussures = vetementsFiltrés[Math.floor(Math.random() * vetementsFiltrés.length)];
        console.log(`Chaussures trouvées lors de la seconde tentative: ${chaussures.nom}`);
      }
    }
    
    console.log(`Suggestion finale de tenue: 
      Haut=${haut?.nom || 'Non trouvé'}, 
      Bas=${bas?.nom || 'Non trouvé'}, 
      Chaussures=${chaussures?.nom || 'Non trouvé'}
    `);
    
    return { haut, bas, chaussures };
  } catch (error) {
    console.error('Erreur lors de la suggestion de vêtements:', error);
    return { haut: null, bas: null, chaussures: null };
  }
};
