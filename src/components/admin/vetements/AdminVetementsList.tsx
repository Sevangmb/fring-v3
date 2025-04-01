
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import AdminVetementDialog from './dialogs/AdminVetementDialog';
import VetementsTable from './VetementsTable';
import SearchBar from './SearchBar';
import { useVetementsList } from '@/hooks/admin/useVetementsList';

const AdminVetementsList: React.FC = () => {
  const {
    vetements,
    loading,
    searchTerm,
    dialogOpen,
    currentVetement,
    categories,
    fetchVetements,
    handleSearchChange,
    handleSearchSubmit,
    handleEdit,
    handleDelete,
    handleAddNew,
    handleDialogClose
  } = useVetementsList();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Liste des vêtements</h3>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={fetchVetements} 
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
          />
        </div>

        <VetementsTable 
          vetements={vetements}
          loading={loading}
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        
        <AdminVetementDialog 
          open={dialogOpen} 
          onOpenChange={handleDialogClose}
          vetement={currentVetement}
          categories={categories}
        />
      </CardContent>
    </Card>
  );
};

export default AdminVetementsList;
