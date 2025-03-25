
import React from "react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Award, ThumbsUp } from "lucide-react";

interface ResultItem {
  id: number;
  name: string;
  upVotes: number;
  totalVotes: number;
}

interface ResultsDisplayProps {
  winner: any;
  votingResults: {[key: number]: ResultItem};
  onClose: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ winner, votingResults, onClose }) => {
  // Calculate local winner
  const calculateLocalWinner = () => {
    const results = Object.values(votingResults);
    if (results.length === 0) return null;
    
    return results.reduce((max, current) => 
      (current.upVotes > max.upVotes) ? current : max, results[0]);
  };

  const localWinner = calculateLocalWinner();
  
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-center text-primary">
          Votes terminés
        </DialogTitle>
        <DialogDescription className="text-center">
          Résultats du vote pour ce défi.
        </DialogDescription>
      </DialogHeader>
      
      <div className="mt-6 text-center space-y-4">
        {winner ? (
          <div className="space-y-4">
            <Award className="h-12 w-12 mx-auto text-yellow-500" />
            <h3 className="font-bold text-lg">Ensemble gagnant</h3>
            <div className="bg-primary/10 rounded-lg p-4">
              <h4 className="font-semibold text-primary">{winner.ensembleName}</h4>
              <p className="text-sm text-muted-foreground">Par {winner.userName}</p>
              <div className="mt-2 flex items-center justify-center gap-3">
                <span className="flex items-center text-green-500">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {winner.upVotes}
                </span>
                <span className="text-muted-foreground font-medium">
                  sur {winner.upVotes + winner.downVotes} votes
                </span>
              </div>
            </div>
            
            {localWinner && (
              <div className="mt-4">
                <h4 className="font-medium text-sm text-muted-foreground">Votes pour cette session:</h4>
                <div className="mt-2">
                  {Object.values(votingResults).map(result => (
                    <div key={result.id} className="flex justify-between items-center py-1">
                      <span className={result.id === localWinner.id ? "font-semibold text-primary" : ""}>
                        {result.name}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="text-green-500 flex items-center">
                          <ThumbsUp className="h-3 w-3 mr-1" /> {result.upVotes}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          /{result.totalVotes} votes
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Aucun résultat disponible pour le moment.
          </div>
        )}
        
        <button
          onClick={onClose}
          className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Fermer
        </button>
      </div>
    </>
  );
};

export default ResultsDisplay;
