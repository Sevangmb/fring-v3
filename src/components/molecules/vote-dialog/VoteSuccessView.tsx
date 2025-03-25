
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface VoteSuccessViewProps {
  onContinue: () => void;
}

const VoteSuccessView: React.FC<VoteSuccessViewProps> = ({ onContinue }) => {
  return (
    <div className="pt-4 flex flex-col items-center gap-3">
      <div className="text-center bg-green-50 p-3 rounded-md border border-green-100 text-green-600">
        <p className="font-medium">Vote enregistré avec succès !</p>
        <p className="text-sm text-green-500">Merci pour votre participation.</p>
      </div>
      <Button 
        className="w-full flex items-center justify-center gap-1"
        onClick={onContinue}
      >
        <span>Continuer</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default VoteSuccessView;
