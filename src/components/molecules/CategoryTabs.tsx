
import React from 'react';
import { Categorie } from '@/services/categorieService';

interface CategoryTabsProps {
  categories: Categorie[];
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  children
}) => {
  return (
    <div className="mb-8">
      {children}
    </div>
  );
};

export default CategoryTabs;
