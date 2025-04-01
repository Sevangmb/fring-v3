
import React from 'react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = "Chargement des utilisateurs..." }) => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};

interface EmptyStateProps {
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message = "Aucun utilisateur trouvé" }) => {
  return (
    <div className="text-center py-8 border rounded-md bg-muted/10">
      <p>{message}</p>
    </div>
  );
};
