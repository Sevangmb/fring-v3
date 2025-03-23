
import React from "react";
import { Button } from "@/components/ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";

interface VoteButtonsProps {
  ensembleId: number;
  userVote: 'up' | 'down' | null;
  onVote: (ensembleId: number, vote: 'up' | 'down') => void;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({
  ensembleId,
  userVote,
  onVote
}) => {
  return (
    <div className="flex justify-center gap-6 pt-4 border-t">
      <Button 
        onClick={() => onVote(ensembleId, 'down')}
        variant={userVote === 'down' ? 'default' : 'outline'} 
        size="lg"
        className={`flex flex-col items-center p-6 ${
          userVote === 'down' 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'hover:bg-red-50 hover:border-red-200'
        }`}
      >
        <ThumbsDown className={`h-8 w-8 mb-2 ${userVote === 'down' ? 'text-white' : 'text-red-500'}`} />
        <span>Je n'aime pas</span>
      </Button>
      
      <Button 
        onClick={() => onVote(ensembleId, 'up')}
        variant={userVote === 'up' ? 'default' : 'outline'} 
        size="lg"
        className={`flex flex-col items-center p-6 ${
          userVote === 'up' 
            ? 'bg-green-500 hover:bg-green-600 text-white' 
            : 'hover:bg-green-50 hover:border-green-200'
        }`}
      >
        <ThumbsUp className={`h-8 w-8 mb-2 ${userVote === 'up' ? 'text-white' : 'text-green-500'}`} />
        <span>J'aime</span>
      </Button>
    </div>
  );
};

export default VoteButtons;
