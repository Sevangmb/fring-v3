
import React from "react";
import { Button } from "@/components/ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Box, Typography } from "@mui/material";
import { cn } from "@/lib/utils";

export interface VoteButtonsProps {
  ensembleId: number;
  userVote: 'up' | 'down' | null;
  onVote: (ensembleId: number, vote: 'up' | 'down') => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact';
  showLabels?: boolean;
  disabled?: boolean;
  className?: string;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({
  ensembleId,
  userVote,
  onVote,
  size = 'md',
  variant = 'default',
  showLabels = true,
  disabled = false,
  className
}) => {
  // Size mappings for different button sizes
  const sizeClasses = {
    sm: { button: "px-2 py-1", icon: "h-4 w-4" },
    md: { button: "px-3 py-2", icon: "h-5 w-5" },
    lg: { button: "px-4 py-2", icon: "h-5 w-5" }
  };
  
  // Get the appropriate sizes based on the size prop
  const { button: buttonSize, icon: iconSize } = sizeClasses[size];
  
  // Determine the spacing between buttons based on the variant
  const spacing = variant === 'compact' ? 2 : 6;
  
  return (
    <Box
      sx={{ 
        display: 'flex',
        justifyContent: 'center',
        gap: spacing,
        pt: 2
      }}
      className={className}
    >
      <Button 
        onClick={() => !disabled && onVote(ensembleId, 'up')}
        variant={userVote === 'up' ? 'default' : 'outline'} 
        size={size}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2",
          buttonSize,
          userVote === 'up' 
            ? 'bg-green-500 hover:bg-green-600 text-white' 
            : 'hover:bg-green-50 hover:border-green-200',
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <ThumbsUp className={cn(
          iconSize,
          userVote === 'up' ? 'text-white' : 'text-green-500'
        )} />
        {showLabels && (
          <Typography variant="button" component="span">
            J'aime
          </Typography>
        )}
      </Button>
      
      <Button 
        onClick={() => !disabled && onVote(ensembleId, 'down')}
        variant={userVote === 'down' ? 'default' : 'outline'} 
        size={size}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2",
          buttonSize,
          userVote === 'down' 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'hover:bg-red-50 hover:border-red-200',
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <ThumbsDown className={cn(
          iconSize,
          userVote === 'down' ? 'text-white' : 'text-red-500'
        )} />
        {showLabels && (
          <Typography variant="button" component="span">
            Je n'aime pas
          </Typography>
        )}
      </Button>
    </Box>
  );
};

export default VoteButtons;
