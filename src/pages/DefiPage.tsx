
import React from "react";
import { useParams } from "react-router-dom";
import PageLayout from "@/components/templates/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DefiHeader from "@/components/defis/DefiHeader";
import DefiOverviewTab from "@/components/defis/DefiOverviewTab";
import DefiParticipationsList from "@/components/organisms/DefiParticipationsList";
import DefiPageLoading from "@/components/defis/DefiPageLoading";
import DefiPageError from "@/components/defis/DefiPageError";
import { useDefiPage } from "@/hooks/useDefiPage";

const DefiPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    defi,
    participations,
    loading,
    error,
    activeTab,
    setActiveTab,
    handleBack,
    getDefiStatus,
    handleVoteUpdated,
    handleParticipationUpdated
  } = useDefiPage(id);
  
  if (loading) {
    return <DefiPageLoading />;
  }
  
  if (error || !defi) {
    return <DefiPageError error={error} onBack={handleBack} />;
  }
  
  const defiStatus = getDefiStatus();
  
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <DefiHeader
          defi={defi}
          defiStatus={defiStatus}
          onBack={handleBack}
          onVoteUpdated={handleVoteUpdated}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-8">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="participations">Participations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <DefiOverviewTab 
              defi={defi} 
              defiStatus={defiStatus}
              onParticipationUpdated={handleParticipationUpdated}
            />
          </TabsContent>
          
          <TabsContent value="participations" className="space-y-6">
            <DefiParticipationsList 
              participations={participations} 
              defiStatus={defiStatus} 
              defiId={defi.id}
              onVoteUpdated={handleParticipationUpdated}
            />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default DefiPage;
