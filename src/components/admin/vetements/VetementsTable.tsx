
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { Vetement } from '@/services/vetement/types';

interface VetementsTableProps {
  vetements: Vetement[];
  loading: boolean;
  categories: {id: number, nom: string}[];
  onEdit: (vetement: Vetement) => void;
  onDelete: (id: number) => void;
}

const VetementsTable: React.FC<VetementsTableProps> = ({ 
  vetements, 
  loading, 
  categories, 
  onEdit, 
  onDelete 
}) => {
  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.nom : 'Catégorie inconnue';
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="w-full h-12" />
        ))}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Catégorie</TableHead>
          <TableHead>Taille</TableHead>
          <TableHead>Couleur</TableHead>
          <TableHead>Propriétaire</TableHead>
          <TableHead>Date d'ajout</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vetements.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center">
              Aucun vêtement trouvé
            </TableCell>
          </TableRow>
        ) : (
          vetements.map((vetement) => (
            <TableRow key={vetement.id}>
              <TableCell>
                {vetement.image_url ? (
                  <div className="w-10 h-10 relative rounded overflow-hidden bg-gray-100">
                    <img 
                      src={vetement.image_url} 
                      alt={vetement.nom}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded">
                    <Tag className="h-5 w-5 text-gray-400" />
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{vetement.nom}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {getCategoryName(vetement.categorie_id)}
                </Badge>
              </TableCell>
              <TableCell>{vetement.taille}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: vetement.couleur }}
                  />
                  {vetement.couleur}
                </div>
              </TableCell>
              <TableCell>
                {(vetement as any).profiles?.email || 'Non assigné'}
              </TableCell>
              <TableCell>
                {vetement.created_at && format(
                  new Date(vetement.created_at),
                  'dd MMM yyyy',
                  { locale: fr }
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    onClick={() => onEdit(vetement)} 
                    variant="outline" 
                    size="icon"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={() => onDelete(vetement.id)} 
                    variant="destructive" 
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default VetementsTable;
