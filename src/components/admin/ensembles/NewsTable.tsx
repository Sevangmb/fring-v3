
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { News } from '@/hooks/admin/useNewsList';

interface NewsTableProps {
  news: News[];
  loading: boolean;
  onEdit: (news: News) => void;
  onDelete: (id: number) => void;
}

const NewsTable: React.FC<NewsTableProps> = ({ 
  news, 
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
          <TableHead>Titre</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Contenu</TableHead>
          <TableHead>Date de création</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {news.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              Aucune actualité trouvée
            </TableCell>
          </TableRow>
        ) : (
          news.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell className="max-w-[200px] truncate">{item.content}</TableCell>
              <TableCell>
                {item.created_at && format(
                  new Date(item.created_at),
                  'dd MMM yyyy',
                  { locale: fr }
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    onClick={() => onEdit(item)} 
                    variant="outline" 
                    size="icon"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={() => onDelete(item.id)} 
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

export default NewsTable;
