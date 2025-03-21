
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
import { Input } from "@/components/ui/input";
import { Search, UserPlus, X, Users, AlertCircle } from "lucide-react";
import { searchUsersByEmail } from "@/services/userService";
import { envoyerDemandeAmi } from "@/services/amiService";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/services/userService";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  const renderUserItem = (user: User, isSuggestion = false) => (
    <div 
      key={user.id} 
      className="flex items-center justify-between p-3 rounded-md border"
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback>
            {user.email.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{user.email}</p>
          {isSuggestion && (
            <p className="text-xs text-muted-foreground">Suggestion</p>
          )}
        </div>
      </div>
      <Button
        size="sm"
        onClick={() => handleEnvoyerDemande(user.id)}
        disabled={sendingRequest[user.id]}
      >
        <UserPlus className="h-4 w-4 mr-1" />
        {sendingRequest[user.id] ? "Envoi..." : "Ajouter"}
      </Button>
    </div>
  );

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
        
        <form onSubmit={handleSearch} className="flex items-center space-x-2 mt-4">
          <Input
            placeholder="Rechercher par email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="sm"
            disabled={isSearching || !searchTerm.trim()}
          >
            <Search className="h-4 w-4 mr-1" />
            {isSearching ? "Recherche..." : "Rechercher"}
          </Button>
        </form>
        
        <div className="mt-4 max-h-[300px] overflow-y-auto">
          {/* Résultats de recherche */}
          {searchTerm && searchResults.length > 0 && (
            <div className="space-y-2 mb-4">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Search className="h-4 w-4 mr-1 text-muted-foreground" />
                Résultats de recherche
              </h3>
              {searchResults.map(user => renderUserItem(user))}
            </div>
          )}
          
          {/* Message si aucun résultat trouvé */}
          {searchTerm && isSearching === false && searchResults.length === 0 && (
            <div className="text-center py-4 text-muted-foreground border rounded-md mb-4">
              <p>Aucun utilisateur trouvé pour "{searchTerm}"</p>
            </div>
          )}
          
          {/* Suggestions d'utilisateurs */}
          {suggestedUsers.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                Suggestions d'utilisateurs
              </h3>
              {suggestedUsers.map(user => renderUserItem(user, true))}
            </div>
          )}
          
          {/* État de chargement */}
          {(isSearching || isLoadingSuggestions) && searchResults.length === 0 && suggestedUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Recherche en cours...</p>
            </div>
          )}
          
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
