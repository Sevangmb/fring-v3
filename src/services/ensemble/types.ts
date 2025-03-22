
import { Vetement } from '../vetement/types';
import { VetementType } from '../meteo/tenue';

export interface EnsembleVetement {
  id: number;
  type: VetementType;
}

export interface EnsembleCreateData {
  nom: string;
  description?: string;
  vetements: EnsembleVetement[];
  occasion?: string;
  saison?: string;
}

export interface EnsembleUpdateData {
  id: number;
  nom?: string;
  description?: string;
  vetements?: EnsembleVetement[];
  occasion?: string;
  saison?: string;
}

export interface Ensemble {
  id: number;
  nom: string;
  description?: string;
  occasion?: string;
  saison?: string;
  created_at: string;
  vetements: {
    id: number;
    vetement: Vetement;
    position_ordre: number;
  }[];
}
