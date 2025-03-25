
import React, { useState, useEffect } from "react";
import { Button, Box, Typography } from "@mui/material";
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
  showScore?: boolean;
  votesCount?: { up: number; down: number };
}

const VoteButtons: React.FC<VoteButtonsProps> = ({
  userVote,
  onVote,
  size = "md",
  showLabels = false,
  isLoading = false,
  disabled = false,
  connectionError = false,
  className = "",
  showScore = false,
  votesCount = { up: 0, down: 0 }
}) => {
  const [justVoted, setJustVoted] = useState<VoteType>(null);
  const [animating, setAnimating] = useState<VoteType>(null);

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
  
  // Feedback animation when vote changes
  useEffect(() => {
    if (userVote) {
      setAnimating(userVote);
      const timer = setTimeout(() => {
        setAnimating(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [userVote]);
  
  const handleVote = (vote: VoteType) => {
    console.log(`${vote} vote clicked`);
    setJustVoted(vote);
    onVote(vote);
    
    // Reset the visual feedback after a delay
    setTimeout(() => {
      setJustVoted(null);
    }, 1000);
  };

  // Calculate percentages for vote bars
  const totalVotes = votesCount.up + votesCount.down;
  const upPercentage = totalVotes > 0 ? (votesCount.up / totalVotes) * 100 : 0;
  const downPercentage = totalVotes > 0 ? (votesCount.down / totalVotes) * 100 : 0;

  return (
    <Box className={`flex flex-col gap-3 ${className}`}>
      {/* Vote buttons */}
      <Box className="flex gap-3 justify-center">
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
            boxShadow: userVote === "up" ? 3 : 1,
            transform: animating === "up" ? "scale(1.1)" : "scale(1)",
            transition: "transform 0.2s ease-in-out, background-color 0.2s ease-in-out",
          }}
        >
          {isLoading && justVoted === "up" ? (
            <Loader2 size={iconSize} className="mr-1 animate-spin" />
          ) : justVoted === "up" ? (
            <Check size={iconSize} className="mr-1" />
          ) : (
            <ThumbsUp size={iconSize} className={showLabels ? "mr-1" : ""} />
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
            boxShadow: userVote === "down" ? 3 : 1,
            transform: animating === "down" ? "scale(1.1)" : "scale(1)",
            transition: "transform 0.2s ease-in-out, background-color 0.2s ease-in-out",
          }}
        >
          {isLoading && justVoted === "down" ? (
            <Loader2 size={iconSize} className="mr-1 animate-spin" />
          ) : justVoted === "down" ? (
            <Check size={iconSize} className="mr-1" />
          ) : (
            <ThumbsDown size={iconSize} className={showLabels ? "mr-1" : ""} />
          )}
          {showLabels && "JE N'AIME PAS"}
        </Button>
      </Box>

      {/* Score visualization - only shown when showScore is true */}
      {showScore && totalVotes > 0 && (
        <Box sx={{ width: '100%', mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              height: '10px',
              backgroundColor: '#f1f5f9', // slate-100
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <Box sx={{ 
                width: `${upPercentage}%`, 
                height: '100%', 
                backgroundColor: '#22c55e',
                transition: 'width 0.5s ease-in-out'
              }} />
              <Box sx={{ 
                width: `${downPercentage}%`, 
                height: '100%', 
                backgroundColor: '#ef4444',
                transition: 'width 0.5s ease-in-out'
              }} />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', color: '#22c55e' }}>
              <ThumbsUp size={12} style={{ marginRight: 4 }} /> {votesCount.up}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
            </Typography>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', color: '#ef4444' }}>
              {votesCount.down} <ThumbsDown size={12} style={{ marginLeft: 4 }} />
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default VoteButtons;
