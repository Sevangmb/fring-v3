
export type TabType = 
  | 'mes-vetements' 
  | 'ajouter-vetement' 
  | 'vetements-amis' 
  | 'mes-ensembles' 
  | 'ajouter-ensemble'
  | 'mes-favoris';

export type TabChangeHandler = (value: TabType) => void;
