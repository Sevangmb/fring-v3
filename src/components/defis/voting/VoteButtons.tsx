
import React from "react";
import { Button } from "@/components/ui/button";
import { ThumbsDown, ThumbsUp, WifiOff } from "lucide-react";
import { CircularProgress, Tooltip } from "@mui/material";
import { cn } from "@/lib/utils";
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

// Define a type for the button size values accepted by the Button component
type ButtonSizeType = "sm" | "lg" | "default" | "icon";

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
  // Size mappings for different button sizes
  const sizeClasses = {
    sm: { button: "px-2 py-1", icon: "h-4 w-4", buttonSize: "sm" as ButtonSizeType },
    md: { button: "px-3 py-2", icon: "h-5 w-5", buttonSize: "default" as ButtonSizeType },
    lg: { button: "px-4 py-2", icon: "h-5 w-5", buttonSize: "lg" as ButtonSizeType }
  };
  
  // Get the appropriate sizes based on the size prop
  const { button: buttonSize, icon: iconSize, buttonSize: buttonSizeValue } = sizeClasses[size];
  
  // Affiche un message d'erreur en cas de problème de connexion
  if (connectionError) {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-2 pt-2", className)}>
        <WifiOff className="text-red-500 h-8 w-8" />
        <p className="text-red-500 text-sm">
          Problème de connexion. Vérifiez votre connexion internet.
        </p>
        <Button 
          onClick={() => window.location.reload()}
          variant="outline" 
          size="sm"
          className="mt-2"
        >
          Réessayer
        </Button>
      </div>
    );
  }
  
  return (
    <div className={cn("flex justify-center gap-4 pt-2", className)}>
      <Tooltip title={userVote === 'up' ? "Vous avez aimé" : "J'aime"}>
        <span> {/* Use span instead of the direct Button to avoid Tooltip warning */}
          <Button 
            onClick={() => onVote('up')}
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
            type="button"
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
              <span>J'aime</span>
            )}
          </Button>
        </span>
      </Tooltip>
      
      <Tooltip title={userVote === 'down' ? "Vous n'avez pas aimé" : "Je n'aime pas"}>
        <span>
          <Button 
            onClick={() => onVote('down')}
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
            type="button"
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
              <span>Je n'aime pas</span>
            )}
          </Button>
        </span>
      </Tooltip>
    </div>
  );
};

export default VoteButtons;
