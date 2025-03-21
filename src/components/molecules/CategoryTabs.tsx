
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Categorie } from '@/services/categorieService';

interface CategoryTabsProps {
  categories: Categorie[];
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeTab,
  onTabChange,
  children
}) => {
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={onTabChange}
      className="mb-8"
    >
      <TabsList className="mb-4 flex flex-wrap">
        <TabsTrigger value="tous">Tous</TabsTrigger>
        {categories.slice(0, 6).map((cat) => (
          <TabsTrigger key={cat.id} value={cat.nom}>
            {cat.nom}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {/* Contenu des onglets */}
      <TabsContent value="tous" className="mt-0">
        {children}
      </TabsContent>
      
      {/* Contenu pour chaque catégorie d'onglet */}
      {categories.slice(0, 6).map((cat) => (
        <TabsContent key={cat.id} value={cat.nom} className="mt-0">
          {children}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default CategoryTabs;
