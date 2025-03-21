
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Users, RefreshCw } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface NewConversationDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  filteredAmis: any[];
  loadingAmis: boolean;
  startNewConversation: (amiEmail: string) => void;
  user: User;
  navigate: (path: string) => void;
}

const NewConversationDialog: React.FC<NewConversationDialogProps> = ({
  isOpen,
  setIsOpen,
  filteredAmis,
  loadingAmis,
  startNewConversation,
  user,
  navigate
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Nouveau
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Démarrer une nouvelle conversation</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="mt-4 max-h-[60vh]">
          {loadingAmis ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Chargement des amis...</span>
            </div>
          ) : filteredAmis.length > 0 ? (
            <div className="space-y-2">
              {filteredAmis.map((ami) => (
                <Button
                  key={ami.id}
                  variant="ghost"
                  className="w-full justify-start p-2 h-auto"
                  onClick={() => startNewConversation(ami.email || "")}
                >
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback>
                      {ami.email ? ami.email.substring(0, 2).toUpperCase() : 'UN'}
                    </AvatarFallback>
                  </Avatar>
                  <span>{ami.email || "Utilisateur inconnu"}</span>
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Users className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="mt-2">Vous n'avez pas encore d'amis</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/mes-amis");
                }}
              >
                Ajouter des amis
              </Button>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NewConversationDialog;
