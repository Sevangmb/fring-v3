
import React, { useState } from "react";
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
import { Search, UserPlus, X } from "lucide-react";
import { searchUsersByEmail } from "@/services/userService";
import { envoyerDemandeAmi } from "@/services/amiService";
import { useToast } from "@/hooks/use-toast";

interface AjouterAmiDialogProps {
  open: boolean;
  onClose: () => void;
  onAmiAdded: () => void;
}

const AjouterAmiDialog: React.FC<AjouterAmiDialogProps> = ({ open, onClose, onAmiAdded }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [sendingRequest, setSendingRequest] = useState<Record<string, boolean>>({});
  
  const { toast } = useToast();

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
      const results = await searchUsersByEmail(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
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
      
      setSearchResults(prevResults => 
        prevResults.filter(user => user.id !== userId)
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
          {searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((user) => (
                <div 
                  key={user.id} 
                  className="flex items-center justify-between p-3 rounded-md border"
                >
                  <div>
                    <p className="font-medium">{user.email}</p>
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
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {isSearching ? (
                <p>Recherche en cours...</p>
              ) : searchTerm ? (
                <p>Aucun utilisateur trouvé</p>
              ) : (
                <p>Recherchez des utilisateurs pour les ajouter comme amis</p>
              )}
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
