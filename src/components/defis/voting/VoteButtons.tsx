
import React from "react";
import { Box, Button, CircularProgress, Tooltip, Typography } from "@mui/material";
import { ThumbsDown, ThumbsUp, WifiOff } from "lucide-react";
import { VoteType } from "@/services/votes/types";

export interface VoteButtonsProps {
  userVote: VoteType;
  onVote: (vote: 'up' | 'down') => void;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  connectionError?: boolean;
  className?: string;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({
  userVote,
  onVote,
  size = 'md',
  showLabels = true,
  disabled = false,
  isLoading = false,
  connectionError = false,
  className
}) => {
  // Size mappings for Material UI
  const sizeMap = {
    sm: { button: 'small', iconSize: 16, padding: '4px 10px' },
    md: { button: 'medium', iconSize: 20, padding: '6px 16px' },
    lg: { button: 'large', iconSize: 24, padding: '8px 22px' }
  };
  
  const { button: buttonSize, iconSize, padding } = sizeMap[size];
  
  // Affiche un message d'erreur en cas de problème de connexion
  if (connectionError) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: 1, 
        pt: 2 
      }}>
        <WifiOff color="error" style={{ width: 32, height: 32 }} />
        <Typography variant="body2" color="error">
          Problème de connexion. Vérifiez votre connexion internet.
        </Typography>
        <Button 
          onClick={() => window.location.reload()}
          variant="outlined" 
          color="error"
          size="small"
          sx={{ mt: 1 }}
        >
          Réessayer
        </Button>
      </Box>
    );
  }
  
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      gap: 2, 
      pt: 2,
      width: '100%'
    }}>
      <Tooltip title={userVote === 'up' ? "Vous avez aimé" : "J'aime"}>
        <span> {/* Use span to avoid Tooltip warning */}
          <Button 
            onClick={() => onVote('up')}
            variant="outlined" 
            size={buttonSize as any}
            disabled={disabled || isLoading}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              padding: padding,
              minWidth: '140px',
              opacity: (disabled || isLoading) ? 0.5 : 1,
              cursor: (disabled || isLoading) ? 'not-allowed' : 'pointer',
              border: '1px solid #4caf50',
              color: '#4caf50',
              '&:hover': {
                backgroundColor: 'rgba(76, 175, 80, 0.04)',
                border: '1px solid #4caf50',
              }
            }}
          >
            {isLoading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <ThumbsUp style={{ 
                width: iconSize, 
                height: iconSize,
                color: '#4caf50'
              }} />
            )}
            {showLabels && (
              <span style={{ color: '#4caf50', fontWeight: 'bold' }}>J'AIME</span>
            )}
          </Button>
        </span>
      </Tooltip>
      
      <Tooltip title={userVote === 'down' ? "Vous n'avez pas aimé" : "Je n'aime pas"}>
        <span>
          <Button 
            onClick={() => onVote('down')}
            variant="outlined" 
            size={buttonSize as any}
            disabled={disabled || isLoading}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              padding: padding,
              minWidth: '140px',
              opacity: (disabled || isLoading) ? 0.5 : 1,
              cursor: (disabled || isLoading) ? 'not-allowed' : 'pointer',
              border: '1px solid #f44336',
              color: '#f44336',
              '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.04)',
                border: '1px solid #f44336',
              }
            }}
          >
            {isLoading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <ThumbsDown style={{ 
                width: iconSize, 
                height: iconSize,
                color: '#f44336'
              }} />
            )}
            {showLabels && (
              <span style={{ color: '#f44336', fontWeight: 'bold' }}>JE N'AIME PAS</span>
            )}
          </Button>
        </span>
      </Tooltip>
    </Box>
  );
};

export default VoteButtons;
