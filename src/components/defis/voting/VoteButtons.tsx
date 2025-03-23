
import React from "react";
import { Button } from "@/components/ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export interface VoteButtonsProps {
  ensembleId: number;
  userVote: 'up' | 'down' | null;
  onVote: (ensembleId: number, vote: 'up' | 'down') => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact';
  showLabels?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

// Define a type for the button size values accepted by the Button component
type ButtonSizeType = "sm" | "lg" | "default" | "icon";

const VoteButtons: React.FC<VoteButtonsProps> = ({
  ensembleId,
  userVote,
  onVote,
  size = 'md',
  variant = 'default',
  showLabels = true,
  disabled = false,
  isLoading = false,
  className
}) => {
  const { toast } = useToast();
  
  // Size mappings for different button sizes
  const sizeClasses = {
    sm: { button: "px-2 py-1", icon: "h-4 w-4", buttonSize: "sm" as ButtonSizeType },
    md: { button: "px-3 py-2", icon: "h-5 w-5", buttonSize: "default" as ButtonSizeType },
    lg: { button: "px-4 py-2", icon: "h-5 w-5", buttonSize: "lg" as ButtonSizeType }
  };
  
  // Get the appropriate sizes based on the size prop
  const { button: buttonSize, icon: iconSize, buttonSize: buttonSizeValue } = sizeClasses[size];
  
  // Determine the spacing between buttons based on the variant
  const spacing = variant === 'compact' ? 2 : 6;
  
  const handleVote = async (vote: 'up' | 'down') => {
    try {
      // Check if the button is already disabled or if the user has already voted this way
      if (disabled || isLoading || userVote === vote) return;
      
      // Call the onVote callback
      onVote(ensembleId, vote);
    } catch (error) {
      console.error("Erreur lors du vote:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du vote. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };
  
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
        onClick={() => handleVote('up')}
        variant={userVote === 'up' ? 'default' : 'outline'} 
        size={buttonSizeValue}
        disabled={disabled || isLoading}
        className={cn(
          "flex items-center gap-2",
          buttonSize,
          userVote === 'up' 
            ? 'bg-green-500 hover:bg-green-600 text-white' 
            : 'hover:bg-green-50 hover:border-green-200',
          (disabled || isLoading) && "opacity-50 cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <CircularProgress size={16} color="inherit" />
        ) : (
          <ThumbsUp className={cn(
            iconSize,
            userVote === 'up' ? 'text-white' : 'text-green-500'
          )} />
        )}
        {showLabels && (
          <Typography variant="button" component="span">
            J'aime
          </Typography>
        )}
      </Button>
      
      <Button 
        onClick={() => handleVote('down')}
        variant={userVote === 'down' ? 'default' : 'outline'} 
        size={buttonSizeValue}
        disabled={disabled || isLoading}
        className={cn(
          "flex items-center gap-2",
          buttonSize,
          userVote === 'down' 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'hover:bg-red-50 hover:border-red-200',
          (disabled || isLoading) && "opacity-50 cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <CircularProgress size={16} color="inherit" />
        ) : (
          <ThumbsDown className={cn(
            iconSize,
            userVote === 'down' ? 'text-white' : 'text-red-500'
          )} />
        )}
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
