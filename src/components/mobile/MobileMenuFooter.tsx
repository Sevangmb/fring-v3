
import React from 'react';
import ThemeSwitcher from '@/components/molecules/ThemeSwitcher';

interface MobileMenuFooterProps {
  className?: string;
}

const MobileMenuFooter: React.FC<MobileMenuFooterProps> = ({ className }) => {
  return (
    <div className={`px-4 py-6 border-t ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Fring
        </p>
        
        <ThemeSwitcher variant="icon" />
      </div>
    </div>
  );
};

export default MobileMenuFooter;
