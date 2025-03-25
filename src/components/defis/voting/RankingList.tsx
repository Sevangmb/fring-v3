
import React from "react";

interface RankingListProps {
  participations: any[];
}

const RankingList: React.FC<RankingListProps> = ({ participations }) => {
  const sortedParticipations = [...participations].sort((a, b) => b.score - a.score);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Classement</h3>
      <div className="space-y-2">
        {sortedParticipations
          .slice(0, 5)
          .map((p, index) => (
            <div 
              key={p.id} 
              className={`flex items-center justify-between p-3 rounded-md ${
                index === 0 ? 'bg-amber-100 border border-amber-200' : 
                index === 1 ? 'bg-gray-100 border border-gray-200' :
                index === 2 ? 'bg-orange-50 border border-orange-100' :
                'bg-white border'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-bold">{index + 1}.</span>
                <span>{p.ensemble?.nom || `Ensemble #${p.ensemble_id}`}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {p.votes.up} 👍 | {p.votes.down} 👎
                </span>
                <span className="font-semibold">Score: {p.score}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RankingList;
