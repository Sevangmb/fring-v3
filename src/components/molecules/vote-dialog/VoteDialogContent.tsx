
import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { WifiOff, AlertTriangle } from "lucide-react";
import EnsembleContentDisplay from "../EnsembleContentDisplay";
import { Alert, AlertDescription } from "@/components/ui/alert";
import VoteButtons from "@/components/defis/voting/VoteButtons";
import EnsembleImages from "@/components/ensembles/EnsembleImages";

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
  useEffect(() => {
    console.log("VoteDialogContent rendering with ensemble:", ensemble);
    console.log("VoteDialogContent vetementsByType:", vetementsByType);
    console.log("VoteDialogContent loading:", loading);
    console.log("VoteDialogContent error:", error);
  }, [ensemble, vetementsByType, loading, error]);

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </Box>
    );
  }

  // Handle error states
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  // Handle null ensemble
  if (!ensemble) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>
          L'ensemble n'a pas pu être chargé
        </AlertDescription>
      </Alert>
    );
  }

  // Handle offline state
  if (isOffline) {
    return (
      <Alert variant="destructive" className="mb-4">
        <Box className="flex items-center gap-2">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            Problème de connexion. Vérifiez votre connexion internet.
          </AlertDescription>
        </Box>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Images Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
        <EnsembleImages 
          vetementsByType={vetementsByType}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Ensemble Details */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">{ensemble.nom}</h3>
          {ensemble.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {ensemble.description}
            </p>
          )}
        </div>

        <EnsembleContentDisplay 
          ensemble={ensemble}
          loading={loading}
          error={error || ''}
          vetementsByType={vetementsByType}
        />
      </div>

      {/* Vote Buttons */}
      {!hasVoted && (
        <div className="flex justify-center pt-4">
          <VoteButtons
            userVote={userVote}
            onVote={onVote}
            size="lg"
            showLabels={true}
            isLoading={isVoting}
            disabled={isOffline}
            connectionError={isOffline}
          />
        </div>
      )}
    </div>
  );
};

export default VoteDialogContent;
