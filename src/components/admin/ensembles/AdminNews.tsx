
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import SearchBar from '../vetements/SearchBar';
import { useNewsList } from '@/hooks/admin/useNewsList';
import NewsTable from './NewsTable';
import AdminNewsDialog from './dialogs/AdminNewsDialog';

const AdminNews: React.FC = () => {
  const {
    news,
    loading,
    searchTerm,
    dialogOpen,
    currentNews,
    fetchNews,
    handleSearchChange,
    handleSearchSubmit,
    handleEdit,
    handleDelete,
    handleAddNew,
    handleDialogClose
  } = useNewsList();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Gestion des actualités</h3>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={fetchNews} 
              className="ml-2"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearchSubmit}
            onAddNew={handleAddNew}
            addButtonText="Ajouter une actualité"
          />
        </div>

        <NewsTable 
          news={news}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        
        <AdminNewsDialog 
          open={dialogOpen} 
          onOpenChange={handleDialogClose}
          news={currentNews}
        />
      </CardContent>
    </Card>
  );
};

export default AdminNews;
