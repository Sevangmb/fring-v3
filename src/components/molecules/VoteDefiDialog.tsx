
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogHeader,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ThumbsUp, X, WifiOff, AlertTriangle } from "lucide-react";
import VoteButtons from "@/components/defis/voting/VoteButtons";
import EnsembleContentDisplay from "./EnsembleContentDisplay";
import { Alert, Box, Typography } from "@mui/material";
import { useVote } from "@/hooks/useVote";
import { useToast } from "@/hooks/use-toast";

interface VoteDefiDialogProps {
  defiId: number;
  defiTitle?: string;
  ensembleId: number;  // Rendre ensembleId obligatoire
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
  
  // Utilise toujours 'ensemble' comme type d'entité
  const {
    submitVote,
    userVote,
    votesCount,
    isLoading: isVoting,
    isOffline,
    loadVoteData
  } = useVote('ensemble', ensembleId, {
    onVoteSuccess: () => {
      // Ferme la boîte de dialogue après le vote
      setOpen(false);
    }
  });
  
  const handleClose = () => setOpen(false);
  
  const handleOpen = () => {
    console.log(`Ouverture de la boîte de dialogue de vote pour l'ensemble ${ensembleId}`);
    setOpen(true);
    loadVoteData();
    loadEnsemble();
  };
  
  const loadEnsemble = async () => {
    if (!ensembleId || isNaN(ensembleId) || ensembleId <= 0) {
      console.error(`ID d'ensemble invalide: ${ensembleId}`);
      setError("Aucun ensemble disponible pour ce participant");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { supabase } = await import('@/lib/supabase');
      
      console.log(`Chargement de l'ensemble ${ensembleId}`);
      
      // D'abord, vérifions si cet ensembleId existe réellement
      const { data: ensembleExists, error: checkError } = await supabase
        .from('tenues')
        .select('id')
        .eq('id', ensembleId)
        .maybeSingle();
        
      if (checkError) {
        console.error("Erreur lors de la vérification de l'ensemble:", checkError);
        throw checkError;
      }
      
      if (!ensembleExists) {
        console.error(`L'ensemble ${ensembleId} n'existe pas`);
        setError("L'ensemble n'a pas pu être chargé ou n'existe pas.");
        setLoading(false);
        return;
      }
      
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
        .maybeSingle();
      
      if (error) {
        console.error("Erreur lors du chargement de l'ensemble:", error);
        throw error;
      }
      
      if (!data) {
        console.error(`Aucun ensemble trouvé avec l'ID ${ensembleId}`);
        setError("L'ensemble n'a pas pu être chargé ou n'existe pas.");
        setLoading(false);
        return;
      }

      console.log(`Ensemble chargé: ${JSON.stringify(data)}`);
      setEnsemble(data);
      
      // Organize vetements by type
      const byType: any = {};
      if (data?.vetements && Array.isArray(data.vetements)) {
        console.log(`Nombre de vêtements: ${data.vetements.length}`);
        data.vetements.forEach((item: any) => {
          if (item.vetement) {
            const categorie = item.vetement.categorie_id;
            if (!byType[categorie]) {
              byType[categorie] = [];
            }
            byType[categorie].push(item.vetement);
          } else {
            console.log("Item sans vêtement:", item);
          }
        });
      } else {
        console.log("Pas de vêtements ou format invalide:", data?.vetements);
        // Si nous n'avons pas de vêtements mais que l'ensemble existe
        if (data) {
          setEnsemble(data);
        }
      }
      
      setVetementsByType(byType);
      setError(null);
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
  
  const hasEmptyEnsemble = ensemble && (!ensemble.vetements || ensemble.vetements.length === 0);
  
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
              Voter pour {ensemble?.nom || defiTitle || 'cet ensemble'}
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Donnez votre avis sur cet ensemble.
            </DialogDescription>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
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
          
          {(ensemble) ? (
            <VoteButtons
              userVote={userVote}
              onVote={handleVote}
              size="lg"
              isLoading={isVoting}
              disabled={loading || isVoting}
              connectionError={connectionError}
              className="pt-4"
            />
          ) : (
            <div className="text-center p-4 text-muted-foreground">
              L'ensemble n'a pas pu être chargé ou n'existe pas.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VoteDefiDialog;
