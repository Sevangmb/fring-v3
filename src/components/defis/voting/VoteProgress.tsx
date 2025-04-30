
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface VoteProgressProps {
  current: number;
  total: number;
  votedCount?: number;
}

const VoteProgress: React.FC<VoteProgressProps> = ({ current, total, votedCount }) => {
  const progressPercentage = Math.round((current / total) * 100);
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">
          {votedCount !== undefined ? (
            `${votedCount} sur ${total} tenues évaluées`
          ) : (
            `Tenue ${current} sur ${total}`
          )}
        </span>
        <span className="text-sm font-medium">{progressPercentage}%</span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
};

export default VoteProgress;
