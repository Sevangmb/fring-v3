
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, WifiOff } from "lucide-react";
import { useEntityVote } from "@/hooks/useEntityVote";
import { EntityType, VoteType } from "@/hooks/useVote";
import { Alert, Box } from "@mui/material";

interface VoterDialogProps {
  elementId?: number;
  elementType?: EntityType;
  onVoteSubmitted?: (vote: VoteType) => void;
}

const VoterDialog: React.FC<VoterDialogProps> = ({
  elementId,
  elementType = "vetement",
  onVoteSubmitted,
}) => {
  const [open, setOpen] = useState(false);
  
  const { 
    handleVote, 
    loading, 
    userVote, 
    connectionError, 
    isSubmitting,
    refresh
  } = useEntityVote({
    entityType: elementType,
    entityId: elementId,
    onVoteSubmitted
  });
  
  // Refresh vote data when dialog opens
  useEffect(() => {
    if (open && elementId) {
      refresh();
    }
  }, [open, elementId, refresh]);
  
  const handleVoteClick = async (vote: VoteType) => {
    if (isSubmitting || loading || connectionError || !elementId) return;
    
    const success = await handleVote(vote);
    if (success) {
      setTimeout(() => setOpen(false), 500);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2" type="button">
          Voter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Voter pour cet élément</DialogTitle>
          <DialogDescription>
            Donnez votre avis sur {elementType === "vetement" ? "ce vêtement" : 
                                 elementType === "ensemble" ? "cet ensemble" : 
                                 "ce défi"}.
          </DialogDescription>
        </DialogHeader>
        
        {!elementId && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>Impossible de voter: ID de l'élément manquant.</span>
            </Box>
          </Alert>
        )}
        
        {connectionError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WifiOff size={16} />
              <span>Problème de connexion. Vérifiez votre connexion internet.</span>
            </Box>
          </Alert>
        )}
        
        <div className="flex justify-center gap-4 py-4">
          <Button 
            onClick={() => handleVoteClick("up")}
            variant={userVote === "up" ? "default" : "outline"}
            size="lg"
            disabled={loading || isSubmitting || connectionError || !elementId}
            className={`flex-1 max-w-40 flex flex-col items-center p-6 ${
              userVote === "up" 
                ? "bg-green-500 hover:bg-green-600 text-white" 
                : "hover:bg-green-50 hover:border-green-200"
            } ${(loading || isSubmitting || !elementId) && "opacity-50 cursor-not-allowed"}`}
            type="button"
          >
            <ThumbsUp className={`h-8 w-8 mb-2 ${userVote === "up" ? "text-white" : "text-green-500"}`} />
            <span>J'aime</span>
          </Button>
          
          <Button 
            onClick={() => handleVoteClick("down")}
            variant={userVote === "down" ? "default" : "outline"}
            size="lg"
            disabled={loading || isSubmitting || connectionError || !elementId}
            className={`flex-1 max-w-40 flex flex-col items-center p-6 ${
              userVote === "down" 
                ? "bg-red-500 hover:bg-red-600 text-white" 
                : "hover:bg-red-50 hover:border-red-200"
            } ${(loading || isSubmitting || !elementId) && "opacity-50 cursor-not-allowed"}`}
            type="button"
          >
            <ThumbsDown className={`h-8 w-8 mb-2 ${userVote === "down" ? "text-white" : "text-red-500"}`} />
            <span>Je n'aime pas</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoterDialog;
