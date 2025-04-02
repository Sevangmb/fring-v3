
import { VetementType } from '@/services/meteo/tenue';
import { Vetement } from '@/services/vetement/types';

export interface Ensemble {
  id: number;
  nom: string;
  description?: string;
  saison?: string;
  occasion?: string;
  user_id: string;
  created_at: string;
  email?: string; // Added for friend ensembles
  vetements: {
    id: number;
    vetement: Vetement;
    position_ordre: number;
  }[];
}

export interface EnsembleCreateParams {
  nom: string;
  description?: string;
  saison?: string;
  occasion?: string;
  vetements: {
    id: number;
    type: VetementType;
  }[];
}

export interface EnsembleUpdateParams {
  id: number;
  nom: string;
  description?: string;
  saison?: string;
  occasion?: string;
  vetements: {
    id: number;
    type: VetementType;
  }[];
}
