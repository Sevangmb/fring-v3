
import React from "react";

interface VoteProgressProps {
  upVotes: number;
  downVotes: number;
}

const VoteProgress: React.FC<VoteProgressProps> = ({
  upVotes,
  downVotes
}) => {
  const totalVotes = upVotes + downVotes;
  const upPercentage = totalVotes ? (upVotes / totalVotes) * 100 : 50;

  return (
    <div className="mt-6">
      <div className="flex justify-between text-sm mb-1">
        <span>👎 {downVotes}</span>
        <span>👍 {upVotes}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-red-200 h-2 rounded-full" style={{ width: `${100 - upPercentage}%` }}></div>
        <div className="bg-green-200 h-2 rounded-full" style={{ width: `${upPercentage}%` }}></div>
      </div>
    </div>
  );
};

export default VoteProgress;
