
import React, { useState } from "react";
import { Button } from "@mui/material";
import { ThumbsUp, ThumbsDown, Loader2, Check } from "lucide-react";
import { VoteType } from "@/services/votes/types";

interface VoteButtonsProps {
  userVote: VoteType;
  onVote: (vote: VoteType) => void;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  connectionError?: boolean;
  className?: string;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({
  userVote,
  onVote,
  size = "md",
  showLabels = false,
  isLoading = false,
  disabled = false,
  connectionError = false,
  className = ""
}) => {
  const [justVoted, setJustVoted] = useState<VoteType>(null);

  // Tailles des boutons et icônes selon size
  const getSizeProps = () => {
    switch (size) {
      case "sm":
        return { iconSize: 14, buttonSize: "small", buttonPadding: "4px 8px" };
      case "lg":
        return { iconSize: 20, buttonSize: "large", buttonPadding: "10px 20px" };
      case "md":
      default:
        return { iconSize: 16, buttonSize: "medium", buttonPadding: "8px 16px" };
    }
  };

  const { iconSize, buttonSize, buttonPadding } = getSizeProps();
  
  console.log("Current userVote:", userVote);
  console.log("Button state - isLoading:", isLoading, "disabled:", disabled);
  
  const handleVote = (vote: VoteType) => {
    console.log(`${vote} vote clicked`);
    setJustVoted(vote);
    onVote(vote);
    
    // Reset the visual feedback after a delay
    setTimeout(() => {
      setJustVoted(null);
    }, 1000);
  };

  return (
    <div className={`flex gap-3 justify-center ${className}`}>
      <Button
        variant="contained"
        color="success"
        size={buttonSize as any}
        disabled={isLoading || disabled || connectionError || justVoted === "up"}
        onClick={() => handleVote("up")}
        sx={{
          backgroundColor: userVote === "up" ? "#22c55e" : "#4ade80", // green-600 : green-400
          "&:hover": {
            backgroundColor: "#16a34a" // green-600
          },
          padding: buttonPadding,
          color: "white",
          fontWeight: "bold",
          boxShadow: userVote === "up" ? 3 : 1
        }}
      >
        {isLoading && justVoted === "up" ? (
          <Loader2 size={iconSize} className="mr-1 animate-spin" />
        ) : justVoted === "up" ? (
          <Check size={iconSize} className="mr-1" />
        ) : (
          <ThumbsUp size={iconSize} className="mr-1" />
        )}
        {showLabels && "J'AIME"}
      </Button>

      <Button
        variant="contained"
        color="error"
        size={buttonSize as any}
        disabled={isLoading || disabled || connectionError || justVoted === "down"}
        onClick={() => handleVote("down")}
        sx={{
          backgroundColor: userVote === "down" ? "#ef4444" : "#f87171", // red-600 : red-400
          "&:hover": {
            backgroundColor: "#dc2626" // red-700
          },
          padding: buttonPadding,
          color: "white",
          fontWeight: "bold",
          boxShadow: userVote === "down" ? 3 : 1
        }}
      >
        {isLoading && justVoted === "down" ? (
          <Loader2 size={iconSize} className="mr-1 animate-spin" />
        ) : justVoted === "down" ? (
          <Check size={iconSize} className="mr-1" />
        ) : (
          <ThumbsDown size={iconSize} className="mr-1" />
        )}
        {showLabels && "JE N'AIME PAS"}
      </Button>
    </div>
  );
};

export default VoteButtons;
