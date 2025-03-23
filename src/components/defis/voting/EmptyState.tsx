
import React from "react";

const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">
        Aucune participation pour ce défi pour le moment.
      </p>
    </div>
  );
};

export default EmptyState;
