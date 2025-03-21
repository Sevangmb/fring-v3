
import React from "react";
import Layout from "@/components/templates/Layout";
import { Heading, Text } from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";
import Card from "@/components/molecules/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, LogOut } from "lucide-react";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  // Fonction pour obtenir les initiales de l'utilisateur
  const getUserInitials = () => {
    const name = user?.user_metadata?.name || user?.email || "";
    if (name) {
      const parts = name.split(/\s+/);
      if (parts.length > 1) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return name[0].toUpperCase();
    }
    return "U";
  };

  // Fonction pour formater la date d'inscription
  const formatJoinDate = () => {
    if (user?.created_at) {
      const date = new Date(user.created_at);
      return date.toLocaleDateString('fr-FR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    return "Date inconnue";
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6 flex items-center gap-2" 
            onClick={handleBack}
          >
            <ArrowLeft size={18} />
            Retour au tableau de bord
          </Button>
          
          <Heading variant="h3" className="mb-6">Mon profil</Heading>
          
          <Card className="p-8">
            <div className="flex flex-col items-center md:flex-row md:items-start gap-8">
              <div className="flex flex-col items-center">
                <Avatar className="w-24 h-24 text-2xl mb-3">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.name || "Utilisateur"} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" className="mt-2 text-xs flex items-center gap-1">
                  <Edit size={12} />
                  Modifier
                </Button>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <Heading variant="h4" className="mb-1">
                  {user?.user_metadata?.name || user?.email?.split('@')[0] || "Utilisateur"}
                </Heading>
                <Text variant="subtle" className="mb-6">
                  {user?.email}
                </Text>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <Text variant="small" className="text-muted-foreground">ID Utilisateur</Text>
                    <Text className="font-medium truncate">{user?.id}</Text>
                  </div>
                  <div>
                    <Text variant="small" className="text-muted-foreground">Inscrit le</Text>
                    <Text className="font-medium">{formatJoinDate()}</Text>
                  </div>
                  <div>
                    <Text variant="small" className="text-muted-foreground">Rôle</Text>
                    <Text className="font-medium">{user?.role || "Utilisateur"}</Text>
                  </div>
                  <div>
                    <Text variant="small" className="text-muted-foreground">Email vérifié</Text>
                    <Text className="font-medium">
                      {user?.email_confirmed_at ? "Oui" : "Non"}
                    </Text>
                  </div>
                </div>
                
                <Button 
                  variant="primary" 
                  onClick={handleLogout} 
                  className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Se déconnecter
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
