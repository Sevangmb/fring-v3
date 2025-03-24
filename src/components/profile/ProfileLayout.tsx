
import React from "react";
import Layout from "@/components/templates/Layout";
import { Heading } from "@/components/atoms/Typography";
import Card from "@/components/molecules/Card";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileDetails from "@/components/profile/ProfileDetails";
import UserStats from "@/components/profile/UserStats";
import NotificationSettings from "@/components/profile/NotificationSettings";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, BarChart } from "lucide-react";

const ProfileLayout: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    form,
    isEditing,
    isLoading,
    uploadingAvatar,
    avatarPreview,
    userStats,
    getUserInitials,
    formatJoinDate,
    getLastActivityDate,
    toggleEdit,
    handleAvatarChange,
    onSubmit,
    handleLogout
  } = useProfile();

  // Rediriger vers la page d'accueil si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <Heading 
            variant="h3" 
            className="mb-8 font-montserrat flex items-center gap-2 animate-fade-in"
          >
            <span className="bg-gradient-to-r from-primary to-theme-teal-medium bg-clip-text text-transparent">
              Mon profil
            </span>
          </Heading>
          
          <div className="space-y-8">
            <Card 
              className="p-8 shadow-lg border border-primary/10 transition-all duration-300 hover:shadow-xl rounded-xl bg-card/90"
              padding="none"
            >
              {isEditing ? (
                <ProfileForm
                  form={form}
                  onSubmit={onSubmit}
                  isLoading={isLoading}
                  isUploading={uploadingAvatar}
                  avatarPreview={avatarPreview}
                  userEmail={user.email || ""}
                  userInitials={getUserInitials()}
                  onToggleEdit={toggleEdit}
                  onAvatarChange={handleAvatarChange}
                />
              ) : (
                <ProfileDetails
                  user={user}
                  getUserInitials={getUserInitials}
                  formatJoinDate={formatJoinDate}
                  avatarUrl={user.user_metadata?.avatar_url}
                  onLogout={handleLogout}
                  onToggleEdit={toggleEdit}
                />
              )}
            </Card>
            
            {!isEditing && (
              <Tabs defaultValue="stats" className="animate-fade-in">
                <TabsList className="mb-6 bg-card/90 border border-primary/10">
                  <TabsTrigger value="stats" className="font-montserrat flex items-center gap-2">
                    <BarChart size={14} />
                    Statistiques
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="font-montserrat flex items-center gap-2">
                    <Bell size={14} />
                    Notifications
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="stats" className="space-y-4">
                  <UserStats 
                    vetementCount={userStats.vetementCount}
                    ensembleCount={userStats.ensembleCount}
                    friendsCount={userStats.friendsCount}
                    favorisCount={userStats.favorisCount}
                    memberSince={formatJoinDate()}
                    lastActive={getLastActivityDate()}
                    isLoading={userStats.isLoading}
                  />
                </TabsContent>
                
                <TabsContent value="notifications">
                  <NotificationSettings />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfileLayout;
