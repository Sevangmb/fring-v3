
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, AlertCircle } from "lucide-react";
import { searchUsersByEmail } from "@/services/user";
import { envoyerDemandeAmi } from "@/services/amis";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User } from "@/services/user/types";
import UserSearchForm from "@/components/atoms/UserSearchForm";
import UserSearchResults from "@/components/molecules/UserSearchResults";
import UserSuggestions from "@/components/molecules/UserSuggestions";

interface AjouterAmiDialogProps {
  open: boolean;
  onClose: () => void;
  onAmiAdded: () => void;
}

const AjouterAmiDialog: React.FC<AjouterAmiDialogProps> = ({ open, onClose, onAmiAdded }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [sendingRequest, setSendingRequest] = useState<Record<string, boolean>>({});
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Charger les suggestions d'utilisateurs lors de l'ouverture de la boîte de dialogue
  useEffect(() => {
    if (open) {
      loadSuggestedUsers();
    }
  }, [open]);

  const loadSuggestedUsers = async () => {
    try {
      setIsLoadingSuggestions(true);
      setSearchError(null);
      // Utiliser la même fonction mais sans terme de recherche pour obtenir quelques utilisateurs récents
      const users = await searchUsersByEmail("");
      setSuggestedUsers(users);
    } catch (error: any) {
      console.error("Erreur lors du chargement des suggestions:", error);
      setSearchError("Impossible de charger les suggestions d'utilisateurs");
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      toast({
        title: "Recherche vide",
        description: "Veuillez saisir un email pour rechercher des utilisateurs.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSearching(true);
      setSearchError(null);
      const results = await searchUsersByEmail(searchTerm);
      setSearchResults(results);
      
      if (results.length === 0) {
        toast({
          title: "Aucun résultat",
          description: `Aucun utilisateur trouvé pour "${searchTerm}"`,
        });
      }
    } catch (error: any) {
      console.error("Erreur lors de la recherche:", error);
      setSearchError(`Erreur de recherche: ${error.message}`);
      toast({
        title: "Erreur",
        description: "Impossible de rechercher des utilisateurs.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleEnvoyerDemande = async (userId: string) => {
    try {
      setSendingRequest(prev => ({ ...prev, [userId]: true }));
      
      await envoyerDemandeAmi(userId);
      
      toast({
        title: "Demande envoyée",
        description: "Votre demande d'ami a été envoyée avec succès.",
      });
      
      // Retirer l'utilisateur des résultats de recherche
      setSearchResults(prevResults => 
        prevResults.filter(user => user.id !== userId)
      );
      
      // Retirer également des suggestions
      setSuggestedUsers(prevSuggestions => 
        prevSuggestions.filter(user => user.id !== userId)
      );
      
      onAmiAdded();
    } catch (error: any) {
      console.error("Erreur lors de l'envoi de la demande:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer la demande d'ami.",
        variant: "destructive",
      });
    } finally {
      setSendingRequest(prev => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un ami</DialogTitle>
          <DialogDescription>
            Recherchez un utilisateur par son adresse email pour lui envoyer une demande d'ami.
          </DialogDescription>
        </DialogHeader>
        
        {searchError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{searchError}</AlertDescription>
          </Alert>
        )}
        
        <UserSearchForm 
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={handleSearch}
          isSearching={isSearching}
        />
        
        <div className="mt-4 max-h-[300px] overflow-y-auto">
          <UserSearchResults 
            searchTerm={searchTerm}
            searchResults={searchResults}
            isSearching={isSearching}
            sendingRequest={sendingRequest}
            onAddFriend={handleEnvoyerDemande}
          />
          
          <UserSuggestions 
            suggestedUsers={suggestedUsers}
            isLoadingSuggestions={isLoadingSuggestions}
            sendingRequest={sendingRequest}
            onAddFriend={handleEnvoyerDemande}
          />
          
          {/* État vide */}
          {!isSearching && !isLoadingSuggestions && searchResults.length === 0 && suggestedUsers.length === 0 && !searchError && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Recherchez des utilisateurs pour les ajouter comme amis</p>
            </div>
          )}
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-1" />
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AjouterAmiDialog;
