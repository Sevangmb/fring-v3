
import React from "react";
import { ThumbsUp, ThumbsDown, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VoteType } from "@/services/votes/types";

interface VoteButtonsProps {
  userVote: VoteType;
  onVote: (vote: VoteType) => void;
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  disabled?: boolean;
  connectionError?: boolean;
  showScore?: boolean;
  votesCount?: { up: number; down: number };
  className?: string;
  showLabels?: boolean;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({
  userVote,
  onVote,
  size = "md",
  isLoading = false,
  disabled = false,
  connectionError = false,
  showScore = false,
  votesCount = { up: 0, down: 0 },
  className = "",
  showLabels = false
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      button: "h-8 w-8",
      icon: "h-4 w-4",
      gap: "gap-1",
      fontSize: "text-xs"
    },
    md: {
      button: "h-10 w-10",
      icon: "h-5 w-5",
      gap: "gap-2",
      fontSize: "text-sm"
    },
    lg: {
      button: "h-12 w-12",
      icon: "h-6 w-6",
      gap: "gap-3",
      fontSize: "text-base"
    }
  };
  
  const current = sizeConfig[size];
  
  // Show connection error
  if (connectionError) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-center text-yellow-800">
          <WifiOff className="h-5 w-5 mr-2 text-yellow-600" />
          <span>Pas de connexion internet</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`flex items-center justify-center ${current.gap} ${className}`}>
      <Button 
        type="button"
        variant={userVote === 'up' ? "default" : "outline"}
        size="icon"
        className={`${current.button} bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 border-green-200 ${userVote === 'up' ? 'bg-green-600 text-white hover:bg-green-700 hover:text-white border-green-600' : ''}`}
        onClick={() => onVote('up')}
        disabled={isLoading || disabled}
      >
        {isLoading ? 
          <div className="animate-spin h-5 w-5 border-2 border-current opacity-50 border-t-transparent rounded-full"></div> :
          <ThumbsUp className={current.icon} />
        }
      </Button>
      
      {showLabels && (
        <div className="flex flex-col items-center mx-2">
          <span className={`font-medium ${current.fontSize}`}>Voter</span>
          {showScore && (
            <span className={`text-muted-foreground ${current.fontSize}`}>
              {votesCount.up - votesCount.down} points
            </span>
          )}
        </div>
      )}
      
      <Button 
        type="button"
        variant={userVote === 'down' ? "default" : "outline"}
        size="icon"
        className={`${current.button} bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800 border-red-200 ${userVote === 'down' ? 'bg-red-600 text-white hover:bg-red-700 hover:text-white border-red-600' : ''}`}
        onClick={() => onVote('down')}
        disabled={isLoading || disabled}
      >
        {isLoading ? 
          <div className="animate-spin h-5 w-5 border-2 border-current opacity-50 border-t-transparent rounded-full"></div> :
          <ThumbsDown className={current.icon} />
        }
      </Button>
      
      {showScore && !showLabels && (
        <div className="ml-3 text-sm">
          <span className="font-medium">{votesCount.up}</span> 👍 / 
          <span className="font-medium">{votesCount.down}</span> 👎
        </div>
      )}
    </div>
  );
};

export default VoteButtons;
