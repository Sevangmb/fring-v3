
import React from "react";
import { Alert, Box, Typography } from "@mui/material";
import { WifiOff, AlertTriangle } from "lucide-react";
import VoteButtons from "@/components/defis/voting/VoteButtons";
import EnsembleContentDisplay from "../EnsembleContentDisplay";

interface VoteDialogContentProps {
  ensemble: any;
  loading: boolean;
  error: string | null;
  vetementsByType: any;
  hasVoted: boolean;
  userVote: 'up' | 'down' | null;
  isVoting: boolean;
  isOffline: boolean;
  onVote: (vote: 'up' | 'down') => Promise<void>;
}

const VoteDialogContent: React.FC<VoteDialogContentProps> = ({
  ensemble,
  loading,
  error,
  vetementsByType,
  hasVoted,
  userVote,
  isVoting,
  isOffline,
  onVote
}) => {
  const connectionError = isOffline;
  const hasEmptyEnsemble = ensemble && (!ensemble.vetements || ensemble.vetements.length === 0);
  
  return (
    <>
      {connectionError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WifiOff size={16} />
            <Typography variant="body2">
              Problème de connexion. Vérifiez votre connexion internet.
            </Typography>
          </Box>
        </Alert>
      )}
      
      {(!ensemble && !loading && !error) && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AlertTriangle size={16} />
            <Typography variant="body2">
              Aucun ensemble disponible. L'ensemble n'a pas pu être chargé ou n'existe pas.
            </Typography>
          </Box>
        </Alert>
      )}
      
      {hasEmptyEnsemble && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AlertTriangle size={16} />
            <Typography variant="body2">
              Cet ensemble ne contient aucun vêtement.
            </Typography>
          </Box>
        </Alert>
      )}
      
      <EnsembleContentDisplay
        ensemble={ensemble}
        loading={loading}
        error={error || ''}
        vetementsByType={vetementsByType}
      />
      
      {!hasVoted && ensemble && (
        <VoteButtons
          userVote={userVote}
          onVote={onVote}
          size="lg"
          isLoading={isVoting}
          disabled={loading || isVoting}
          connectionError={connectionError}
          className="pt-4"
        />
      )}
    </>
  );
};

export default VoteDialogContent;
