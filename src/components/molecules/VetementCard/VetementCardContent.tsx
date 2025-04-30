
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, CircleDollarSign } from 'lucide-react';
import { Vetement } from '@/services/vetement/types';

interface VetementCardContentProps {
  vetement: Vetement;
  onVote?: (type: 'up' | 'down') => void;
  userVote?: 'up' | 'down' | null;
  showVoteButtons?: boolean;
  disableVoting?: boolean;
}

const VetementCardContent: React.FC<VetementCardContentProps> = ({ 
  vetement, 
  onVote, 
  userVote, 
  showVoteButtons = false,
  disableVoting = false
}) => {
  return (
    <div className="relative">
      {/* "À vendre" indicator */}
      {vetement.a_vendre && (
        <div className="absolute top-2 left-2 z-10">
          <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1 bg-primary/80 text-primary-foreground backdrop-blur-sm">
            <CircleDollarSign className="h-3 w-3" />
            <span className="text-xs font-medium">À vendre</span>
          </Badge>
        </div>
      )}

      {/* Vote buttons */}
      {showVoteButtons && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6 z-20">
          <button 
            onClick={() => !disableVoting && onVote?.('up')} 
            className={`p-3 rounded-full shadow-md transition-all ${userVote === 'up' ? 'bg-green-500' : 'bg-white hover:bg-green-100'} ${disableVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={disableVoting}
            aria-label="J'aime"
          >
            <ThumbsUp className={`h-8 w-8 ${userVote === 'up' ? 'text-white' : 'text-green-500'}`} />
          </button>
          <button
            onClick={() => !disableVoting && onVote?.('down')}
            className={`p-3 rounded-full shadow-md transition-all ${userVote === 'down' ? 'bg-red-500' : 'bg-white hover:bg-red-100'} ${disableVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={disableVoting}
            aria-label="Je n'aime pas"
          >
            <ThumbsDown className={`h-8 w-8 ${userVote === 'down' ? 'text-white' : 'text-red-500'}`} />
          </button>
        </div>
      )}
    </div>
  );
};

export default VetementCardContent;
