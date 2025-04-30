
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from "@/components/templates/PageLayout";
import ResultsDisplay from '@/components/defis/voting/ResultsDisplay';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { fetchDefiById } from '@/services/defi/votes/fetchDefiById';

const ResultatsDefi: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [defi, setDefi] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadDefi = async () => {
      if (!id) {
        setError("ID du défi non spécifié");
        setLoading(false);
        return;
      }
      
      try {
        const defiData = await fetchDefiById(parseInt(id));
        
        if (!defiData) {
          setError("Défi non trouvé");
          setLoading(false);
          return;
        }
        
        setDefi(defiData);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement du défi:", err);
        setError("Erreur lors du chargement du défi");
        setLoading(false);
      }
    };
    
    loadDefi();
  }, [id]);
  
  const handleBack = () => {
    navigate(`/defis/${id}`);
  };
  
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au défi
          </Button>
          
          <h1 className="text-3xl font-bold">
            {loading ? "Chargement..." : error ? "Erreur" : `Résultats : ${defi?.titre}`}
          </h1>
        </div>
        
        {error ? (
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <>
            {defi && (
              <div className="mb-8">
                <p className="text-gray-600">{defi.description}</p>
                <div className="flex gap-4 mt-4 text-sm text-gray-500">
                  <div>Du {new Date(defi.date_debut).toLocaleDateString('fr-FR')}</div>
                  <div>au {new Date(defi.date_fin).toLocaleDateString('fr-FR')}</div>
                  <div>{defi.participants_count || 0} participant(s)</div>
                </div>
              </div>
            )}
            
            {id && <ResultsDisplay defiId={parseInt(id)} />}
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default ResultatsDefi;
