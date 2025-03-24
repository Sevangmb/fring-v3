
import { ReactNode } from "react";

export type DefiType = "current" | "upcoming" | "past";

export interface DefiCardProps {
  id: number;
  title: string;
  description: string;
  dateRange: string;
  type: DefiType;
  icon?: ReactNode;
  participantsCount?: number;
  onParticipation?: () => void;
  ensembleId?: number; // Ensemble ID optionnel si un ensemble est lié au défi
}

export interface DefiState {
  participation: any;
  participantEnsembleId: number | null;
  ensembleName: string | null;
  votesCount: number;
  leaderName: string | null;
  userHasVoted: boolean;
}
