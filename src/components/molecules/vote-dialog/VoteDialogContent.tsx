
import React from "react";
import { Box, Typography } from "@mui/material";
import { WifiOff, AlertTriangle, ThumbsUp, ThumbsDown } from "lucide-react";
import VoteButtons from "@/components/defis/voting/VoteButtons";
import EnsembleContentDisplay from "../EnsembleContentDisplay";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

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
        <div className="flex justify-center gap-6 pt-4">
          <Button
            onClick={() => onVote('up')}
            disabled={isVoting || loading || isOffline}
            variant="outline"
            className={`p-6 rounded-full hover:bg-green-100 transition-colors ${
              userVote === 'up' ? 'bg-green-100 border-green-500' : ''
            }`}
            aria-label="J'aime"
          >
            {isVoting ? (
              <div className="animate-spin h-6 w-6 border-2 border-green-500 border-t-transparent rounded-full"></div>
            ) : (
              <ThumbsUp size={32} className={userVote === 'up' ? 'text-green-500' : 'text-gray-500'} />
            )}
          </Button>
          
          <Button
            onClick={() => onVote('down')}
            disabled={isVoting || loading || isOffline}
            variant="outline"
            className={`p-6 rounded-full hover:bg-red-100 transition-colors ${
              userVote === 'down' ? 'bg-red-100 border-red-500' : ''
            }`}
            aria-label="Je n'aime pas"
          >
            {isVoting ? (
              <div className="animate-spin h-6 w-6 border-2 border-red-500 border-t-transparent rounded-full"></div>
            ) : (
              <ThumbsDown size={32} className={userVote === 'down' ? 'text-red-500' : 'text-gray-500'} />
            )}
          </Button>
        </div>
      )}
    </>
  );
};

export default VoteDialogContent;
