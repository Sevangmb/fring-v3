
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Newspaper, Trophy } from "lucide-react";
import PageHeader from "../organisms/PageHeader";
import DefisSection from "../organisms/DefisSection";
import NewsContent from "../organisms/NewsContent";

const FringPageContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("defis");
  
  return (
    <>
      <PageHeader 
        title="Fring" 
        description="Découvrez nos défis et les dernières nouvelles" 
      />
      
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="defis" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="defis" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span>Défis</span>
            </TabsTrigger>
            <TabsTrigger value="nouvelles" className="flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              <span>Nouvelles</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="defis" className="space-y-6 animate-fade-in">
            <DefisSection />
          </TabsContent>
          
          <TabsContent value="nouvelles" className="space-y-6 animate-fade-in">
            <NewsContent />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default FringPageContent;
