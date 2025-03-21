
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';
import { generateImageDescription, preprocessImageUrl } from './imageDescription.ts';
import { extractClothingColor, performDirectColorQuery, detectDominantColor } from './colorExtraction.ts';
import { detectClothingType, checkIfPantsOrJeans } from './clothingType.ts';
import { analyzeImageDirectly } from './directAnalysis.ts';

export {
  generateImageDescription,
  preprocessImageUrl,
  extractClothingColor,
  performDirectColorQuery,
  detectDominantColor,
  detectClothingType,
  checkIfPantsOrJeans,
  analyzeImageDirectly
};
