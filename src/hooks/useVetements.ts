
import { useState, useEffect } from 'react';
import { fetchVetements, Vetement } from '@/services/vetement';
import { fetchCategories, Categorie } from '@/services/categorieService';

export const useVetements = () => {
  const [vetements, setVetements] = useState<Vetement[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [vetementsLoading, setVetementsLoading] = useState<boolean>(true);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  const [vetementsError, setVetementsError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setVetementsLoading(true);
        setCategoriesLoading(true);
        setVetementsError(null);
        setCategoriesError(null);
        
        // Récupérer les vêtements et les catégories en parallèle
        const [vetementsData, categoriesData] = await Promise.all([
          fetchVetements(),
          fetchCategories()
        ]);
        
        // Enrichir les vêtements avec les informations de catégorie
        const enrichedVetements = vetementsData.map(vetement => {
          // Trouver la catégorie correspondante si categorie_id existe
          if (vetement.categorie_id) {
            const categorie = categoriesData.find(cat => cat.id === vetement.categorie_id);
            if (categorie) {
              return {
                ...vetement,
                categorie: categorie.nom // Assurer que le nom de la catégorie est toujours à jour
              };
            }
          }
          return vetement;
        });
        
        setVetements(enrichedVetements);
        setCategories(categoriesData);
      } catch (err) {
        console.warn('Impossible de récupérer les données:', err);
        const errorMessage = err instanceof Error ? err.message : 'Impossible de récupérer les données';
        
        if (String(err).includes('catégories')) {
          setCategoriesError(errorMessage);
        } else {
          setVetementsError(errorMessage);
        }
      } finally {
        setVetementsLoading(false);
        setCategoriesLoading(false);
      }
    };

    fetchData();
  }, []);

  return { 
    vetements, 
    categories, 
    vetementsLoading, 
    categoriesLoading, 
    vetementsError,
    categoriesError
  };
};
