
import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ThemeSwitcherProps {
  variant?: 'icon' | 'button';
  className?: string;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ variant = 'icon', className }) => {
  const { theme, setTheme } = useTheme();
  
  const ThemeIcon = theme === 'dark' 
    ? Moon 
    : theme === 'light' 
      ? Sun 
      : Monitor;

  if (variant === 'button') {
    return (
      <Button
        variant="ghost"
        className={className}
        onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')}
      >
        <ThemeIcon className="h-5 w-5 mr-2" />
        {theme === 'dark' ? 'Mode sombre' : theme === 'light' ? 'Mode clair' : 'Système'}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className={className}
          aria-label="Changer le thème"
        >
          <ThemeIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')} className="flex items-center gap-2">
          <Sun className="h-4 w-4" />
          <span>Clair</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className="flex items-center gap-2">
          <Moon className="h-4 w-4" />
          <span>Sombre</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')} className="flex items-center gap-2">
          <Monitor className="h-4 w-4" />
          <span>Système</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
