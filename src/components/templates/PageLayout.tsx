
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  className,
  fullWidth = false
}) => {
  return (
    <ScrollArea className="h-screen">
      <main className={cn(
        "flex flex-col items-center p-4 md:p-6 lg:p-8",
        fullWidth ? 'w-full' : 'max-w-screen-xl mx-auto',
        className
      )}>
        {children}
      </main>
    </ScrollArea>
  );
};

export default PageLayout;
