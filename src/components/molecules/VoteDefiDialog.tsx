
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ThumbsUp, X, WifiOff } from "lucide-react";
import VoteButtons from "@/components/defis/voting/VoteButtons";
import EnsembleContentDisplay from "./EnsembleContentDisplay";
import { Alert, Box, Typography } from "@mui/material";
import { useVote } from "@/hooks/useVote";
import { useToast } from "@/hooks/use-toast";

interface VoteDefiDialogProps {
  defiId: number;
  defiTitle?: string;
  ensembleId?: number;
}

const VoteDefiDialog: React.FC<VoteDefiDialogProps> = ({
  defiId,
  defiTitle,
  ensembleId
}) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [ensemble, setEnsemble] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vetementsByType, setVetementsByType] = useState<any>({});
  
  // Use our hook with the proper entity type
  const entityType = ensembleId ? 'ensemble' : 'defi';
  const entityId = ensembleId || defiId;
  
  const {
    submitVote,
    userVote,
    votesCount,
    isLoading: isVoting,
    isOffline,
    loadVoteData
  } = useVote(entityType, entityId, {
    onVoteSuccess: () => {
      if (!ensembleId) {
        // Close dialog after voting directly on a defi
        setOpen(false);
      }
    }
  });
  
  const handleClose = () => setOpen(false);
  
  const handleOpen = () => {
    setOpen(true);
    loadVoteData();
    
    if (ensembleId) {
      loadEnsemble();
    }
  };
  
  const loadEnsemble = async () => {
    if (!ensembleId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { supabase } = await import('@/lib/supabase');
      
      const { data, error } = await supabase
        .from('tenues')
        .select(`
          id, 
          nom, 
          description, 
          occasion, 
          saison, 
          created_at, 
          user_id,
          vetements:tenues_vetements(
            id,
            vetement:vetement_id(*),
            position_ordre
          )
        `)
        .eq('id', ensembleId)
        .single();
      
      if (error) throw error;
      
      setEnsemble(data);
      
      // Organize vetements by type
      const byType: any = {};
      if (data?.vetements) {
        data.vetements.forEach((item: any) => {
          const vetement = item.vetement;
          if (vetement) {
            const categorie = vetement.categorie_id;
            if (!byType[categorie]) {
              byType[categorie] = [];
            }
            byType[categorie].push(vetement);
          }
        });
      }
      
      setVetementsByType(byType);
    } catch (err) {
      console.error('Error loading ensemble:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };
  
  const handleVote = async (vote: 'up' | 'down') => {
    await submitVote(vote);
  };
  
  const connectionError = isOffline;
  
  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleOpen}
        className="flex items-center gap-1 text-sm font-medium"
      >
        <ThumbsUp className="h-4 w-4" />
        <span>Voter</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Voter pour {defiTitle || 'ce défi'}
              <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogTitle>
            <p className="text-center text-muted-foreground">
              {!ensembleId 
                ? "Donnez votre avis sur ce défi." 
                : "Donnez votre avis sur cet ensemble."}
            </p>
          </DialogHeader>
          
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
          
          {/* Display ensemble preview only if ensembleId is provided */}
          {ensembleId && (
            <EnsembleContentDisplay
              ensemble={ensemble}
              loading={loading}
              error={error || ''}
              vetementsByType={vetementsByType}
            />
          )}
          
          <VoteButtons
            userVote={userVote}
            onVote={handleVote}
            size="lg"
            isLoading={isVoting}
            disabled={(ensembleId && loading) || isVoting}
            connectionError={connectionError}
            className="pt-4"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VoteDefiDialog;
