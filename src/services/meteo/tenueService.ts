
// This file provides backward compatibility with the old structure
// It re-exports everything from the new modular structure
export {
  VetementType,
  determinerTypeVetement,
  estAdaptePluie,
  estAEviterPluie,
  suggestVetements,
  generateOutfitMessage
} from './tenue';

// Use 'export type' for type re-exports when isolatedModules is enabled
export type { TenueSuggestion } from './tenue';
