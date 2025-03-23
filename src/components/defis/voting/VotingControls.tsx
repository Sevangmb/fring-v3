
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Award } from "lucide-react";

interface VotingControlsProps {
  currentIndex: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
  score: number;
  disabled?: boolean;
}

const VotingControls: React.FC<VotingControlsProps> = ({
  currentIndex,
  totalItems,
  onPrevious,
  onNext,
  score,
  disabled = false
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrevious}
          disabled={currentIndex === 0 || disabled}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm">
          {currentIndex + 1} / {totalItems}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
          disabled={currentIndex === totalItems - 1 || disabled}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Award className="h-5 w-5 text-amber-500" />
        <span className="font-medium">Score: {score}</span>
      </div>
    </div>
  );
};

export default VotingControls;
