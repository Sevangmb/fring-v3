
export type DefiType = 'current' | 'upcoming' | 'past';

export interface DefiCardProps {
  id: number;
  title: string;
  description: string;
  dateRange?: string;
  type: DefiType;
  icon?: React.ReactNode;
  participantsCount?: number;
  onParticipation?: () => void;
  ensembleId?: number;
}
