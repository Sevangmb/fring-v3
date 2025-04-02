
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

export interface DefiState {
  participation: any;
  participantEnsembleId: number | null;
  ensembleName: string | null;
  votesCount: number;
  leaderName: string | null;
  userHasVoted: boolean;
  validEnsembleId: number | undefined;
  participantsCount: number;
}
