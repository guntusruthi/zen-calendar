import { Sun, Moon, Zap, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden group"
    >
      {theme === 'light' ? (
        <>
          <Droplets className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
          <span className="sr-only">Switch to Zenitsu theme</span>
        </>
      ) : (
        <>
          <Zap className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
          <span className="sr-only">Switch to Tanjiro theme</span>
        </>
      )}
    </Button>
  );
}
