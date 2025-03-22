
export type TabType = 'mes-vetements' | 'ajouter-vetement' | 'mes-ensembles' | 'ajouter-ensemble' | 'mes-tenues';

export interface TabChangeHandler {
  (value: TabType): void;
}
