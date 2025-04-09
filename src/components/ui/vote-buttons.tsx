
import * as React from "react"
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { VoteType } from "@/services/votes/types"

interface VoteButtonsProps extends React.HTMLAttributes<HTMLDivElement> {
  score?: number
  userVote?: VoteType
  size?: "sm" | "md" | "lg"
  onUpvote?: () => void
  onDownvote?: () => void
  isLoading?: boolean
  vertical?: boolean
  showScore?: boolean
}

export function VoteButtons({
  score = 0,
  userVote = null,
  size = "md",
  onUpvote,
  onDownvote,
  isLoading = false,
  vertical = true,
  showScore = true,
  className,
  ...props
}: VoteButtonsProps) {
  // Size configurations
  const config = {
    sm: { buttonSize: "sm" as const, iconSize: 16, fontSize: "text-xs" },
    md: { buttonSize: "sm" as const, iconSize: 18, fontSize: "text-sm" },
    lg: { buttonSize: "default" as const, iconSize: 22, fontSize: "text-base" },
  }
  
  const { buttonSize, iconSize, fontSize } = config[size]
  
  // Determine score color based on value
  const scoreColor = 
    score > 0 ? "text-orange-600" : 
    score < 0 ? "text-blue-600" : 
    "text-gray-500"

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
        size={buttonSize}
        variant="ghost"
        disabled={isLoading}
        onClick={onUpvote}
        className={cn(
          "rounded-full p-0 h-auto", 
          userVote === "up" ? "text-orange-600" : "text-gray-500 hover:text-orange-600"
        )}
      >
        {isLoading ? (
          <Loader2 size={iconSize} className="animate-spin" />
        ) : (
          <ArrowBigUp size={iconSize} />
        )}
        <span className="sr-only">Upvote</span>
      </Button>
      
      {showScore && (
        <span className={cn("font-medium", fontSize, scoreColor)}>
          {score}
        </span>
      )}
      
      <Button
        size={buttonSize}
        variant="ghost"
        disabled={isLoading}
        onClick={onDownvote}
        className={cn(
          "rounded-full p-0 h-auto", 
          userVote === "down" ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
        )}
      >
        {isLoading ? (
          <Loader2 size={iconSize} className="animate-spin" />
        ) : (
          <ArrowBigDown size={iconSize} />
        )}
        <span className="sr-only">Downvote</span>
      </Button>
    </div>
  )
}
