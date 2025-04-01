
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import AdminEnsembleDialog from './dialogs/AdminEnsembleDialog';
import EnsemblesTable from './EnsemblesTable';
import SearchBar from '../vetements/SearchBar';
import { useEnsemblesList } from '@/hooks/admin/useEnsemblesList';

const AdminEnsemblesList: React.FC = () => {
  const {
    ensembles,
    loading,
    searchTerm,
    dialogOpen,
    currentEnsemble,
    fetchEnsembles,
    handleSearchChange,
    handleSearchSubmit,
    handleEdit,
    handleDelete,
    handleAddNew,
    handleDialogClose
  } = useEnsemblesList();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Liste des ensembles</h3>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={fetchEnsembles} 
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

        <EnsemblesTable 
          ensembles={ensembles}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        
        <AdminEnsembleDialog 
          open={dialogOpen} 
          onOpenChange={handleDialogClose}
          ensemble={currentEnsemble}
        />
      </CardContent>
    </Card>
  );
};

export default AdminEnsemblesList;
