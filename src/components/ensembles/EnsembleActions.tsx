
import React from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import FavoriButton from "../atoms/FavoriButton";
import RedditStyleVoter from "../molecules/RedditStyleVoter";

interface EnsembleActionsProps {
  ensembleId: number;
  size?: "sm" | "md" | "lg";
  orientation?: "horizontal" | "vertical";
  showTooltips?: boolean;
}

const EnsembleActions: React.FC<EnsembleActionsProps> = ({
  ensembleId,
  size = "md",
  orientation = "horizontal",
  showTooltips = true
}) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Partager cet ensemble",
        url: `${window.location.origin}/ensembles/${ensembleId}`,
      });
    } else {
      navigator.clipboard.writeText(
        `${window.location.origin}/ensembles/${ensembleId}`
      );
    }
  };

  const actionButtons = (
    <>
      <RedditStyleVoter 
        entityType="ensemble"
        entityId={ensembleId}
        size={size}
        vertical={orientation === "vertical"}
        className="mr-2"
      />

      <FavoriButton 
        elementId={String(ensembleId)} 
        type="ensemble" 
        size={size === "lg" ? "default" : "sm"}
        variant="ghost" 
        className="rounded-full"
      />

      <Button
        variant="ghost"
        size={size === "lg" ? "default" : "sm"}
        onClick={handleShare}
        className="rounded-full"
      >
        <Share2 className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
        <span className="sr-only">Partager</span>
      </Button>
    </>
  );

  if (!showTooltips) {
    return (
      <div className={`flex ${orientation === "vertical" ? "flex-col" : "flex-row"} items-center gap-1`}>
        {actionButtons}
      </div>
    );
  }

  return (
    <div className={`flex ${orientation === "vertical" ? "flex-col" : "flex-row"} items-center gap-1`}>
      <TooltipProvider>
        {actionButtons}
      </TooltipProvider>
    </div>
  );
};

export default EnsembleActions;
