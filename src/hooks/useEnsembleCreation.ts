
import { useState } from "react";
import { useEnsembleInitialization } from "./ensembles/useEnsembleInitialization";
import { useEnsembleVetements } from "./ensembles/useEnsembleVetements";
import { useEnsembleSubmission, SelectedItems } from "./ensembles/useEnsembleSubmission";

export const useEnsembleCreation = () => {
  const { initialized } = useEnsembleInitialization();
  const { allVetements, loading } = useEnsembleVetements();
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({
    haut: null,
    bas: null,
    chaussures: null
  });
  const { creating, submitEnsemble } = useEnsembleSubmission();

  const handleCreateEnsemble = async () => {
    await submitEnsemble(selectedItems);
  };

  return {
    allVetements,
    loading,
    selectedItems,
    creating,
    setSelectedItems,
    handleCreateEnsemble
  };
};
