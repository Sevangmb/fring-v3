
import { useState } from "react";
import { Ami } from "@/services/amis/types";

export const useAmisPageState = (
  demandesRecues: Ami[],
  demandesEnvoyees: Ami[],
  amisAcceptes: Ami[]
) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("amis");

  // Filtrer les amis en fonction du terme de recherche
  const filteredAmisAcceptes = searchTerm 
    ? amisAcceptes.filter(ami => 
        ami.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : amisAcceptes;

  // Filtrer également les demandes
  const filteredDemandesEnvoyees = searchTerm
    ? demandesEnvoyees.filter(demande => 
        demande.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : demandesEnvoyees;
    
  const filteredDemandesRecues = searchTerm
    ? demandesRecues.filter(demande => 
        demande.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : demandesRecues;

  return {
    searchTerm,
    setSearchTerm,
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    filteredAmisAcceptes,
    filteredDemandesEnvoyees,
    filteredDemandesRecues
  };
};
