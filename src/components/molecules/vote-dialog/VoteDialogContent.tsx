
import React from "react";
import { Box, Typography } from "@mui/material";
import { WifiOff, AlertTriangle } from "lucide-react";
import VoteButtons from "@/components/defis/voting/VoteButtons";
import EnsembleContentDisplay from "../EnsembleContentDisplay";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
        <Alert variant="destructive" className="mb-4 bg-red-100 text-red-900 border-red-200 dark:bg-red-900 dark:text-red-50 dark:border-red-800">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WifiOff size={16} />
            <AlertDescription>
              Problème de connexion. Vérifiez votre connexion internet.
            </AlertDescription>
          </Box>
        </Alert>
      )}
      
      {(!ensemble && !loading && !error) && (
        <Alert variant="destructive" className="mb-4 bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-900 dark:text-amber-50 dark:border-amber-800">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AlertTriangle size={16} />
            <AlertDescription>
              Aucun ensemble disponible. L'ensemble n'a pas pu être chargé ou n'existe pas.
            </AlertDescription>
          </Box>
        </Alert>
      )}
      
      {hasEmptyEnsemble && (
        <Alert variant="destructive" className="mb-4 bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-900 dark:text-amber-50 dark:border-amber-800">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AlertTriangle size={16} />
            <AlertDescription>
              Cet ensemble ne contient aucun vêtement.
            </AlertDescription>
          </Box>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive" className="mb-4 bg-red-100 text-red-900 border-red-200 dark:bg-red-900 dark:text-red-50 dark:border-red-800">
          <AlertDescription>{error}</AlertDescription>
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
