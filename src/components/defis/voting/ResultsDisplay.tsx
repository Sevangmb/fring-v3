
import React from "react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Award, ThumbsUp } from "lucide-react";

interface ResultsDisplayProps {
  winner: any;
  votingResults: {[key: number]: {id: number, name: string, upVotes: number, totalVotes: number}};
  onClose: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ winner, votingResults, onClose }) => {
  // Convert results object to array and sort by upVotes
  const sortedResults = Object.values(votingResults)
    .sort((a, b) => b.upVotes - a.upVotes);
  
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-center text-primary">
          Résultats du vote
        </DialogTitle>
        <DialogDescription className="text-center">
          Merci d'avoir participé au vote!
        </DialogDescription>
      </DialogHeader>
      
      {winner && (
        <div className="mt-4 p-4 border border-yellow-300 bg-yellow-50 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Award className="h-6 w-6 text-yellow-500" />
            <h3 className="font-bold text-lg">Le gagnant est:</h3>
          </div>
          <div className="text-center">
            <p className="font-semibold text-lg">{winner.ensembleName}</p>
            <p className="text-sm text-muted-foreground">
              Par {winner.userName || "Utilisateur inconnu"}
            </p>
            <p className="mt-1">
              <span className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                <ThumbsUp className="h-4 w-4 mr-1" /> {winner.upVotes} votes positifs
              </span>
            </p>
          </div>
        </div>
      )}
      
      <div className="mt-4">
        <h4 className="font-medium mb-2">Classement:</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {sortedResults.map((result, index) => (
            <div 
              key={result.id} 
              className={`p-3 rounded-md ${index === 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{index + 1}. {result.name}</span>
                </div>
                <div className="flex items-center">
                  <ThumbsUp className="h-4 w-4 text-green-600 mr-1" />
                  <span>{result.upVotes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 flex justify-center">
        <Button onClick={onClose}>Fermer</Button>
      </div>
    </>
  );
};

export default ResultsDisplay;
