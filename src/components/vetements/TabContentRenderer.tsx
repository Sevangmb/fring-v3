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
      {/* Other tab contents will be provided via children */}
      {children}
    </>
  );
};

export default TabContentRenderer;
