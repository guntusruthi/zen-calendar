import { Calendar, CheckSquare, Image, BookOpen, FolderOpen, LayoutDashboard, Swords, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ViewMode } from '@/types';
import { ThemeToggle } from './ThemeToggle';
import { DateSelector } from './DateSelector';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const navItems: { id: ViewMode; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'todos', label: 'To-Do List', icon: CheckSquare },
  { id: 'memories', label: 'Memories', icon: Image },
  { id: 'journal', label: 'Journal', icon: BookOpen },
  { id: 'collections', label: 'Collections', icon: FolderOpen },
];

export function Sidebar({ currentView, onViewChange, selectedDate, onSelectDate }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border flex flex-col z-50">
      {/* Logo Section */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary">
            <Swords className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-lg font-semibold text-foreground">Breath</h1>
            <p className="text-xs text-muted-foreground">Scheduler</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
                "hover:bg-muted group",
                isActive && "bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon className={cn(
                "w-5 h-5 transition-transform group-hover:scale-110",
                isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
              )} />
              <span className={cn(
                "font-medium",
                isActive ? "text-primary-foreground" : "text-foreground"
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="ml-auto w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Date Selector */}
      <div className="p-4 border-t border-border">
        <DateSelector selectedDate={selectedDate} onSelectDate={onSelectDate} />
      </div>

      {/* Theme Toggle */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
