
export type TabType = 'mes-favoris' | 'mes-vetements' | 'ajouter-vetement' | 'vetements-amis' | 'mes-ensembles' | 'ajouter-ensemble';

export type TabChangeHandler = (value: TabType) => void;
