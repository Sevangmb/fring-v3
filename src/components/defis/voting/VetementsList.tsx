
import React from "react";
import { Shirt } from "lucide-react";

interface VetementsListProps {
  vetements: any[];
}

const VetementsList: React.FC<VetementsListProps> = ({ vetements }) => {
  if (!vetements || vetements.length === 0) {
    return (
      <div className="mt-3 p-3 bg-gray-50 rounded-md text-center text-muted-foreground">
        <Shirt className="h-5 w-5 mx-auto mb-1 opacity-50" />
        <p className="text-sm">Cet ensemble ne contient pas de vêtements.</p>
      </div>
    );
  }

  // Group vetements by category if possible
  let groupedVetements: { [key: string]: any[] } = {};
  
  vetements.forEach(item => {
    let vetement;
    
    // Handle different data structures
    if (item.vetement) {
      vetement = item.vetement;
    } else if (item.id) {
      vetement = item;
    } else {
      return; // Skip invalid items
    }
    
    const category = vetement.categorie_id ? `Catégorie ${vetement.categorie_id}` : 'Autre';
    
    if (!groupedVetements[category]) {
      groupedVetements[category] = [];
    }
    
    groupedVetements[category].push(vetement);
  });

  return (
    <div className="mt-3 max-h-60 overflow-y-auto">
      {Object.entries(groupedVetements).map(([category, items]) => (
        <div key={category} className="mb-3">
          <h4 className="text-sm font-medium mb-1">{category}</h4>
          <div className="grid grid-cols-2 gap-2">
            {items.map((vetement) => (
              <div 
                key={vetement.id} 
                className="p-2 bg-gray-50 rounded border border-gray-100 text-sm"
              >
                <div className="font-medium">{vetement.nom}</div>
                {vetement.couleur && (
                  <div className="text-xs text-muted-foreground">
                    Couleur: {vetement.couleur}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VetementsList;
