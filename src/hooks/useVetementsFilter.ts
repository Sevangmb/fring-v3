
import { useState, useEffect } from 'react';
import { Vetement } from '@/services/vetement/types';
import { VetementType, determinerTypeVetement } from '@/services/meteo/tenue';
import { Owner } from '@/components/ensembles/OwnerSelector';

export const useVetementsFilter = (vetements: Vetement[]) => {
  const [categorizedVetements, setCategorizedVetements] = useState<{
    hauts: Vetement[];
    bas: Vetement[];
    chaussures: Vetement[];
  }>({
    hauts: [],
    bas: [],
    chaussures: []
  });

  // État pour suivre les propriétaires uniques
  const [owners, setOwners] = useState<Owner[]>([
    { id: 'me', name: 'Moi' }
  ]);

  // État pour suivre la sélection du propriétaire pour chaque catégorie
  const [selectedOwners, setSelectedOwners] = useState({
    haut: 'me',
    bas: 'me',
    chaussures: 'me'
  });

  // Vêtements filtrés par propriétaire pour chaque catégorie
  const [filteredVetements, setFilteredVetements] = useState<{
    hauts: Vetement[];
    bas: Vetement[];
    chaussures: Vetement[];
  }>({
    hauts: [],
    bas: [],
    chaussures: []
  });

  // Effet pour extraire les propriétaires uniques des vêtements
  useEffect(() => {
    const uniqueOwners = new Map<string, Owner>();
    uniqueOwners.set('me', { id: 'me', name: 'Moi' });
    
    vetements.forEach(vetement => {
      if (vetement.owner_email && vetement.user_id) {
        const ownerName = vetement.owner_email.split('@')[0];
        uniqueOwners.set(vetement.user_id, { 
          id: vetement.user_id, 
          name: ownerName 
        });
      }
    });
    
    setOwners(Array.from(uniqueOwners.values()));
  }, [vetements]);

  // Catégoriser les vêtements par type
  useEffect(() => {
    const categorizeVetements = async () => {
      const hauts: Vetement[] = [];
      const bas: Vetement[] = [];
      const chaussures: Vetement[] = [];

      for (const vetement of vetements) {
        const type = await determinerTypeVetement(vetement);
        
        if (type === VetementType.HAUT) {
          hauts.push(vetement);
        } else if (type === VetementType.BAS) {
          bas.push(vetement);
        } else if (type === VetementType.CHAUSSURES) {
          chaussures.push(vetement);
        }
      }

      setCategorizedVetements({ hauts, bas, chaussures });
    };

    categorizeVetements();
  }, [vetements]);

  // Filtrer les vêtements par propriétaire lorsque la sélection change
  useEffect(() => {
    const filterByOwner = () => {
      setFilteredVetements({
        hauts: categorizedVetements.hauts.filter(item => 
          selectedOwners.haut === 'me' 
            ? !item.owner_email 
            : item.user_id === selectedOwners.haut
        ),
        bas: categorizedVetements.bas.filter(item => 
          selectedOwners.bas === 'me' 
            ? !item.owner_email 
            : item.user_id === selectedOwners.bas
        ),
        chaussures: categorizedVetements.chaussures.filter(item => 
          selectedOwners.chaussures === 'me' 
            ? !item.owner_email 
            : item.user_id === selectedOwners.chaussures
        ),
      });
    };

    filterByOwner();
  }, [selectedOwners, categorizedVetements]);

  const handleOwnerChange = (type: 'haut' | 'bas' | 'chaussures', ownerId: string) => {
    setSelectedOwners(prev => ({
      ...prev,
      [type]: ownerId
    }));
  };

  return {
    filteredVetements,
    owners,
    selectedOwners,
    handleOwnerChange
  };
};
