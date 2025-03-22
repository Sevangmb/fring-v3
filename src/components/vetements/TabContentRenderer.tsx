
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import MesFavorisTab from "./tabs/MesFavorisTab";

interface TabContentRendererProps {
  children?: React.ReactNode;
}

const TabContentRenderer: React.FC<TabContentRendererProps> = ({ children }) => {
  return (
    <>
      <TabsContent value="mes-favoris">
        <MesFavorisTab />
      </TabsContent>
    </>
  );
};

export default TabContentRenderer;
