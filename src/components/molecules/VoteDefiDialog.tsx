
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogContentText,
  Button,
  IconButton
} from "@mui/material";
import { Vote } from "lucide-react";
import VotingCarousel from "@/components/defis/VotingCarousel";

interface VoteDefiDialogProps {
  defiId: number;
  defiTitle?: string;
}

const VoteDefiDialog: React.FC<VoteDefiDialogProps> = ({
  defiId,
  defiTitle
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
          Voter pour {defiTitle || 'ce défi'}
        </DialogTitle>
        
        <DialogContent>
          <DialogContentText sx={{ mb: 3, color: 'text.secondary' }}>
            Parcourez les ensembles et votez pour vos favoris.
          </DialogContentText>
          
          <div className="mt-4">
            <VotingCarousel defiId={defiId} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VoteDefiDialog;
