
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogContentText,
  Button,
  IconButton,
  Box
} from "@mui/material";
import { Vote } from "lucide-react";
import { fetchEnsembleById } from "@/services/ensemble/fetchEnsembleById";
import { organizeVetementsByType } from "@/components/defis/voting/helpers/vetementOrganizer";
import EnsembleImages from "@/components/ensembles/EnsembleImages";
import VoteButtons from "@/components/defis/voting/VoteButtons";
import { useEntityVote } from "@/hooks/useEntityVote";
import { VetementType } from "@/services/meteo/tenue";

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
    try {
      const ensembleData = await fetchEnsembleById(ensembleId);
      setEnsemble(ensembleData);
      
      if (ensembleData) {
        const organizedVetements = organizeVetementsByType(ensembleData);
        setVetementsByType(organizedVetements);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'ensemble:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onVote = (ensembleId: number, vote: 'up' | 'down') => {
    handleVote(vote);
    // Fermer le dialogue après le vote
    setTimeout(() => {
      handleClose();
    }, 500);
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
          
          {ensemble && (
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <h3 className="text-lg font-medium mb-2">{ensemble.nom || "Ensemble sans nom"}</h3>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                mb: 3,
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 1
              }}>
                <EnsembleImages 
                  vetementsByType={vetementsByType} 
                  className="w-full max-w-md mx-auto"
                />
              </Box>
              
              {ensemble.description && (
                <p className="text-sm text-gray-600 mb-4">{ensemble.description}</p>
              )}
            </Box>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
