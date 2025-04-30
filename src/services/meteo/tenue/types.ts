
import { Vetement } from '@/services/vetement/types';

export enum VetementType {
  HAUT = 'haut',
  BAS = 'bas',
  CHAUSSURES = 'chaussures'
}

// Classification des vêtements par type
export const VETEMENTS_HAUTS = [
  'tshirt', 't-shirt', 'chemise', 'pull', 'sweat', 'sweatshirt', 'veste', 
  'manteau', 'blouson', 'gilet', 'hoodie', 'débardeur', 'top', 'polo'
];

export const VETEMENTS_BAS = [
  'pantalon', 'jean', 'short', 'jupe', 'bermuda', 'jogging', 'legging'
];

export const VETEMENTS_CHAUSSURES = [
  'chaussures', 'basket', 'baskets', 'sneakers', 'tennis', 'bottes', 'bottines', 
  'mocassins', 'sandales', 'tongs', 'escarpins', 'derbies', 'chaussure'
];

// Liste des vêtements adaptés à la pluie
export const VETEMENTS_PLUIE = [
  'imperméable', 'impermeable', 'k-way', 'kway', 'ciré', 'cire',
  'coupe-vent', 'coupe vent', 'poncho', 'parapluie', 'bottes de pluie', 
  'bottines imperméables', 'veste imperméable', 'anorak', 'gore-tex',
  'déperlant', 'deperlant', 'étanche', 'etanche', 'waterproof',
  'rain', 'pluie', 'rain jacket', 'imperméabilisé', 'impermeabilise'
];

// Liste des vêtements à éviter sous la pluie
export const VETEMENTS_A_EVITER_PLUIE = [
  'short', 'shorts', 'sandales', 'tongs', 'espadrilles', 'suède', 'daim',
  'suede', 'cuir non traité', 'cuir non traite', 'lin', 'coton léger',
  'coton leger', 'tissu fin', 'chaussures en toile', 'toile', 'canvas'
];

export interface TenueSuggestion {
  haut: Vetement | null;
  bas: Vetement | null;
  chaussures: Vetement | null;
}
