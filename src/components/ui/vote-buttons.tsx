
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Loader2 } from "lucide-react";

export interface VoteButtonsProps extends React.HTMLAttributes<HTMLDivElement> {
  score?: number;
  userVote?: 'up' | 'down' | null;
  size?: "sm" | "md" | "lg";
  onUpvote: () => void;
  onDownvote: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  vertical?: boolean;
  showScore?: boolean;
}

export function VoteButtons({
  score = 0,
  userVote = null,
  size = "md",
  onUpvote,
  onDownvote,
  isLoading = false,
  disabled = false,
  vertical = true,
  showScore = true,
  className,
  ...props
}: VoteButtonsProps) {
  // Determine sizes based on the size prop
  const buttonSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const scoreSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base font-medium",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1",
        vertical ? "flex-col" : "flex-row",
        className
      )}
      {...props}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onUpvote}
        disabled={disabled || isLoading}
        className={cn(
          buttonSizes[size],
          userVote === "up" && "text-green-500 bg-green-50 hover:bg-green-100 hover:text-green-600"
        )}
      >
        {isLoading ? (
          <Loader2 className={cn(iconSizes[size], "animate-spin")} />
        ) : (
          <ArrowUp className={iconSizes[size]} />
        )}
      </Button>
      
      {showScore && (
        <span className={cn(scoreSizes[size], "text-center min-w-[20px]")}>
          {score}
        </span>
      )}
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onDownvote}
        disabled={disabled || isLoading}
        className={cn(
          buttonSizes[size],
          userVote === "down" && "text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600"
        )}
      >
        <ArrowDown className={iconSizes[size]} />
      </Button>
    </div>
  );
}
