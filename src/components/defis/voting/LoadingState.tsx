
import React from "react";

const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      <span className="ml-2">Chargement des participations...</span>
    </div>
  );
};

export default LoadingState;
