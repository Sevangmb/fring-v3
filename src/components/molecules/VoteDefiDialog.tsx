
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Vote } from "lucide-react";
import VotingCarousel from "@/components/defis/VotingCarousel";

interface VoteDefiDialogProps {
  defiId: number;
  defiTitle?: string;
}

const VoteDefiDialog: React.FC<VoteDefiDialogProps> = ({
  defiId,
  defiTitle
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-2">
          <Vote className="h-4 w-4" />
          Voter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Voter pour {defiTitle || 'ce défi'}</DialogTitle>
          <DialogDescription>
            Parcourez les ensembles et votez pour vos favoris.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <VotingCarousel defiId={defiId} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoteDefiDialog;
