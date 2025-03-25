
import React from "react";
import { Box, Button, Chip, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface VotingControlsProps {
  currentIndex: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
  score?: number;
  disabled?: boolean;
}

const VotingControls: React.FC<VotingControlsProps> = ({
  currentIndex,
  totalItems,
  onPrevious,
  onNext,
  score = 0,
  disabled = false
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      p: 2,
      borderRadius: 2,
      bgcolor: 'background.paper',
      boxShadow: 1
    }}>
      <Button
        variant="outlined"
        startIcon={<ChevronLeft size={16} />}
        onClick={onPrevious}
        disabled={currentIndex === 0 || disabled}
        sx={{ minWidth: 100 }}
      >
        Précédent
      </Button>
      
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="subtitle1" component="div">
          Participation {currentIndex + 1} sur {totalItems}
        </Typography>
        <Chip 
          label={`Score: ${score}`} 
          color={score >= 0 ? "success" : "error"} 
          size="small"
          sx={{ mt: 0.5 }}
        />
      </Box>
      
      <Button
        variant="outlined"
        endIcon={<ChevronRight size={16} />}
        onClick={onNext}
        disabled={currentIndex >= totalItems - 1 || disabled}
        sx={{ minWidth: 100 }}
      >
        Suivant
      </Button>
    </Box>
  );
};

export default VotingControls;
