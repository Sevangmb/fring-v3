
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogContentText,
  Button,
  Box,
  CircularProgress
} from "@mui/material";
import { Vote } from "lucide-react";
import { fetchEnsembleById } from "@/services/ensemble/fetchEnsembleById";
import { organizeVetementsByType } from "@/components/defis/voting/helpers/vetementOrganizer";
import EnsembleImages from "@/components/ensembles/EnsembleImages";
import VoteButtons from "@/components/defis/voting/VoteButtons";
import { useEntityVote } from "@/hooks/useEntityVote";
import { VetementType } from "@/services/meteo/tenue";
import { Skeleton } from "@/components/ui/skeleton";

interface VoteDefiDialogProps {
  defiId: number;
  defiTitle?: string;
  ensembleId: number;
}

const VoteDefiDialog: React.FC<VoteDefiDialogProps> = ({
  defiId,
  defiTitle,
  ensembleId
}) => {
  const [open, setOpen] = useState(false);
  const [ensemble, setEnsemble] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vetementsByType, setVetementsByType] = useState<Record<string, any[]>>({
    [VetementType.HAUT]: [],
    [VetementType.BAS]: [],
    [VetementType.CHAUSSURES]: [],
    'autre': []
  });

  const { userVote, votes, handleVote } = useEntityVote({
    entityType: "defi",
    entityId: ensembleId,
  });

  useEffect(() => {
    if (open && ensembleId) {
      loadEnsemble();
    }
  }, [open, ensembleId]);

  const loadEnsemble = async () => {
    if (!ensembleId) return;
    
    setLoading(true);
    setError(null);
    try {
      console.log("Chargement de l'ensemble:", ensembleId);
      const ensembleData = await fetchEnsembleById(ensembleId);
      console.log("Ensemble chargé:", ensembleData);
      
      if (!ensembleData) {
        throw new Error("Impossible de charger l'ensemble");
      }
      
      setEnsemble(ensembleData);
      
      if (ensembleData && ensembleData.vetements) {
        console.log("Organisation des vêtements de l'ensemble:", ensembleData.vetements);
        const organizedVetements = organizeVetementsByType(ensembleData);
        console.log("Vêtements organisés:", organizedVetements);
        setVetementsByType(organizedVetements);
      } else {
        console.error("L'ensemble n'a pas de vêtements ou format invalide:", ensembleData);
        setError("Aucun vêtement trouvé pour cet ensemble");
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'ensemble:", error);
      setError("Erreur lors du chargement de l'ensemble");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    // Reset the error and ensemble states when opening the dialog
    setError(null);
    setEnsemble(null);
    setVetementsByType({
      [VetementType.HAUT]: [],
      [VetementType.BAS]: [],
      [VetementType.CHAUSSURES]: [],
      'autre': []
    });
  };
  
  const handleClose = () => setOpen(false);

  const onVote = (ensembleId: number, vote: 'up' | 'down') => {
    handleVote(vote);
    // Fermer le dialogue après le vote
    setTimeout(() => {
      handleClose();
    }, 500);
  };

  const renderEnsembleContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={40} />
        </Box>
      );
    }
    
    if (error) {
      return (
        <Box sx={{ textAlign: 'center', my: 4, color: 'error.main' }}>
          <p>{error}</p>
        </Box>
      );
    }
    
    if (!ensemble) {
      return (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <p className="text-muted-foreground">Aucune information d'ensemble disponible</p>
        </Box>
      );
    }
    
    return (
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <h3 className="text-lg font-medium mb-2">{ensemble.nom || "Ensemble sans nom"}</h3>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          mb: 3,
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          minHeight: '150px'
        }}>
          {loading ? (
            <div className="grid grid-cols-3 gap-2 w-full">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          ) : (
            <EnsembleImages 
              vetementsByType={vetementsByType} 
              className="w-full max-w-md mx-auto h-40"
            />
          )}
        </Box>
        
        {ensemble.description && (
          <p className="text-sm text-gray-600 mb-4">{ensemble.description}</p>
        )}
      </Box>
    );
  };

  return (
    <>
      <Button 
        variant="contained" 
        size="small"
        onClick={handleOpen}
        startIcon={<Vote className="h-4 w-4" />}
        sx={{ 
          textTransform: 'none', 
          gap: '0.5rem', 
          fontSize: '0.875rem',
          padding: '0.5rem 0.75rem',
          lineHeight: '1.25rem',
          fontWeight: '500'
        }}
      >
        Voter
      </Button>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
          Voter pour {defiTitle || 'ce défi'}
        </DialogTitle>
        
        <DialogContent>
          <DialogContentText sx={{ mb: 3, color: 'text.secondary' }}>
            Donnez votre avis sur ce défi.
          </DialogContentText>
          
          {renderEnsembleContent()}
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <VoteButtons
              ensembleId={ensembleId}
              userVote={userVote}
              onVote={onVote}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VoteDefiDialog;
