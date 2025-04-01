
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { Ensemble } from '@/services/ensemble/types';

interface EnsemblesTableProps {
  ensembles: Ensemble[];
  loading: boolean;
  onEdit: (ensemble: Ensemble) => void;
  onDelete: (id: number) => void;
}

const EnsemblesTable: React.FC<EnsemblesTableProps> = ({ 
  ensembles, 
  loading, 
  onEdit, 
  onDelete 
}) => {
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
          <TableHead>Nom</TableHead>
          <TableHead>Occasion</TableHead>
          <TableHead>Saison</TableHead>
          <TableHead>Propriétaire</TableHead>
          <TableHead>Date de création</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ensembles.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              Aucun ensemble trouvé
            </TableCell>
          </TableRow>
        ) : (
          ensembles.map((ensemble) => (
            <TableRow key={ensemble.id}>
              <TableCell className="font-medium">{ensemble.nom}</TableCell>
              <TableCell>
                {ensemble.occasion && ensemble.occasion !== "none" ? (
                  <Badge variant="outline">{ensemble.occasion}</Badge>
                ) : (
                  <span className="text-gray-400">Non spécifié</span>
                )}
              </TableCell>
              <TableCell>
                {ensemble.saison && ensemble.saison !== "none" ? (
                  <Badge variant="outline">{ensemble.saison}</Badge>
                ) : (
                  <span className="text-gray-400">Non spécifié</span>
                )}
              </TableCell>
              <TableCell>
                {(ensemble as any).profiles?.email || 'Non assigné'}
              </TableCell>
              <TableCell>
                {ensemble.created_at && format(
                  new Date(ensemble.created_at),
                  'dd MMM yyyy',
                  { locale: fr }
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    onClick={() => onEdit(ensemble)} 
                    variant="outline" 
                    size="icon"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={() => onDelete(ensemble.id)} 
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

export default EnsemblesTable;
