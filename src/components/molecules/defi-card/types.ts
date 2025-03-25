
import { ReactElement } from "react";

export type DefiType = "current" | "upcoming" | "past";

export interface DefiCardProps {
  id: number;
  title: string;
  description: string;
  dateRange: string;
  type: DefiType;
  icon?: ReactElement;
  participantsCount?: number;
  onParticipation?: () => void;
  ensembleId?: number;
}

export interface DefiState {
  participation: any;
  participantEnsembleId: number | null;
  ensembleName: string | null;
  votesCount: number;
  participantsCount: number;
  leaderName: string | null;
  userHasVoted: boolean;
  validEnsembleId?: number;
}
