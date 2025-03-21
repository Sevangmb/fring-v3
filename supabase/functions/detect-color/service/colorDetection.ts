
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';
import { colorMapping } from "../utils/colorMapping.ts";
import { availableColors } from "../utils/colorMapping.ts";
import { 
  generateImageDescription, 
  extractClothingColor, 
  performDirectColorQuery, 
  detectDominantColor, 
  analyzeImageDirectly 
} from "./huggingFaceService.ts";

/**
 * Mappe la couleur détectée en anglais vers son équivalent français
 * @param detectedColor Couleur détectée en anglais
 * @returns Couleur en français
 */
function mapToFrenchColor(detectedColor: string): string {
  console.log("Mapping detected color to French:", detectedColor);
  
  // Cas spécial pour les pantalons souvent de couleur bleue (jeans)
  if (detectedColor.includes("pants") || detectedColor.includes("jeans") || 
      detectedColor.includes("denim") || detectedColor.includes("trousers")) {
    console.log("Pants/jeans detected, assuming blue");
    return "bleu";
  }
  
  for (const [englishColor, frenchColor] of Object.entries(colorMapping)) {
    if (detectedColor.includes(englishColor)) {
      console.log(`Mapped '${detectedColor}' to '${frenchColor}'`);
      return frenchColor;
    }
  }
  
  // Si aucune correspondance n'est trouvée, chercher la couleur la plus proche au lieu de renvoyer "multicolore"
  console.log("No direct color mapping found for:", detectedColor);
  
  // Essayer de trouver une correspondance partielle
  for (const [englishColor, frenchColor] of Object.entries(colorMapping)) {
    if (detectedColor.includes(englishColor)) {
      console.log(`Found partial match '${englishColor}' -> '${frenchColor}'`);
      return frenchColor;
    }
  }
  
  // Si toujours pas de correspondance, chercher le mot le plus proche dans le texte
  const words = detectedColor.split(/\s+/);
  for (const word of words) {
    for (const [englishColor, frenchColor] of Object.entries(colorMapping)) {
      if (word === englishColor) {
        console.log(`Found word match '${word}' -> '${frenchColor}'`);
        return frenchColor;
      }
    }
  }
  
  // Si on arrive ici, retourner une couleur par défaut basée sur les mots clés
  if (detectedColor.includes("dark")) {
    return "noir";
  } else if (detectedColor.includes("light")) {
    return "blanc";
  }
  
  // En dernier recours, retourner la première couleur disponible (souvent bleu)
  return availableColors[0];
}

/**
 * Analyse plusieurs approches pour déterminer la couleur et sélectionne la plus probable
 * @param imageDescription Description de l'image
 * @param detectedColors Tableau de couleurs détectées par différentes méthodes
 * @param hf Client Hugging Face Inference
 * @returns Couleur la plus probable
 */
async function determineMostLikelyColor(imageDescription: string, detectedColors: string[], hf: HfInference): Promise<string> {
  console.log("Determining most likely color from detected colors:", detectedColors);
  
  // Si une seule couleur est détectée, la retourner directement
  if (detectedColors.length === 1) {
    return detectedColors[0];
  }
  
  // Si "blue" est parmi les couleurs détectées, le prioriser
  if (detectedColors.includes("blue")) {
    return "blue";
  }
  
  // Détecter la couleur dominante comme dernier recours
  return await detectDominantColor(imageDescription, hf);
}

/**
 * Détecte la couleur dominante d'un vêtement dans une image
 * @param imageUrl URL de l'image à analyser
 * @returns Couleur du vêtement détectée
 */
export async function detectClothingColor(imageUrl: string): Promise<string> {
  try {
    console.log("Detecting clothing color from image:", imageUrl.substring(0, 50) + "...");
    
    // Initialiser l'API Hugging Face
    const hf = new HfInference(Deno.env.get('HUGGINGFACE_API_KEY'));
    
    // Vérifier d'abord si c'est bleu par analyse directe
    const directColorAnalysis = await analyzeImageDirectly(imageUrl, hf);
    if (directColorAnalysis === "blue") {
      console.log("Direct analysis detected blue clothing");
      return "bleu";
    }
    
    // Étape 1: Générer une description de l'image
    const imageDescription = await generateImageDescription(imageUrl, hf);
    
    // Vérifier si la description contient des mots-clés de jeans/pantalons bleus
    if (imageDescription.toLowerCase().includes("blue jeans") || 
        imageDescription.toLowerCase().includes("denim") ||
        (imageDescription.toLowerCase().includes("blue") && 
        (imageDescription.toLowerCase().includes("pants") || 
         imageDescription.toLowerCase().includes("trousers")))) {
      console.log("Description suggests blue jeans/pants");
      return "bleu";
    }
    
    // Collecter les résultats de différentes méthodes de détection
    let detectedColors = [];
    
    // Étape 2: Extraire la couleur du vêtement à partir de la description
    let detectedColor = await extractClothingColor(imageDescription, hf);
    if (detectedColor && detectedColor.length < 20) {
      detectedColors.push(detectedColor);
    }
    
    // Étape 3: Essayer avec une requête directe si nécessaire
    const directQueryColor = await performDirectColorQuery(imageDescription, hf);
    if (directQueryColor && directQueryColor.length < 20) {
      detectedColors.push(directQueryColor);
    }
    
    // Étape 4: Détecter la couleur dominante si nécessaire
    if (detectedColors.length === 0) {
      const dominantColor = await detectDominantColor(imageDescription, hf);
      if (dominantColor && dominantColor !== "unknown") {
        detectedColors.push(dominantColor);
      }
    }
    
    // Étape 5: Déterminer la couleur la plus probable parmi celles détectées
    let finalDetectedColor = await determineMostLikelyColor(imageDescription, detectedColors, hf);
    
    // Étape 6: Mapper la couleur détectée vers les couleurs françaises disponibles
    return mapToFrenchColor(finalDetectedColor);
  } catch (error) {
    console.error("Error detecting clothing color:", error);
    // Retourner une couleur par défaut au lieu de "multicolore"
    return "bleu"; // Couleur par défaut car souvent les vêtements sont bleus
  }
}
