
// Stub file to satisfy imports
export interface Defi {
  id: number;
  titre: string;
  description: string;
  date_debut: string;
  date_fin: string;
  participants_count: number;
  ensemble_id?: number | null;
}

export const fetchDefis = async (): Promise<Defi[]> => {
  console.warn("fetchDefis est une fonctionnalité retirée");
  return [];
};
