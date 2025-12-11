import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Event, Todo, Memory, JournalEntry } from '@/types';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';

interface CalendarProps {
  events: Event[];
  todos: Todo[];
  memories: Memory[];
  journals: JournalEntry[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function Calendar({ events, todos, memories, journals, selectedDate, onSelectDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    const daysArray = [];
    let day = start;
    
    while (day <= end) {
      daysArray.push(day);
      day = addDays(day, 1);
    }
    
    return daysArray;
  }, [currentMonth]);

  const getDateIndicators = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const hasEvents = events.some(e => e.date === dateStr);
    const hasTodos = todos.some(t => t.date === dateStr);
    const hasMemories = memories.some(m => m.date === dateStr);
    const hasJournal = journals.some(j => j.date === dateStr);
    
    return { hasEvents, hasTodos, hasMemories, hasJournal };
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 card-hover">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-semibold text-foreground">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const indicators = getDateIndicators(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentDay = isToday(day);

          return (
            <button
              key={index}
              onClick={() => onSelectDate(day)}
              className={cn(
                "relative aspect-square p-2 rounded-lg transition-all duration-200",
                "hover:bg-muted group",
                !isCurrentMonth && "opacity-40",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
                isCurrentDay && !isSelected && "ring-2 ring-primary"
              )}
            >
              <span className={cn(
                "text-sm font-medium",
                isSelected ? "text-primary-foreground" : "text-foreground"
              )}>
                {format(day, 'd')}
              </span>
              
              {/* Indicators */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                {indicators.hasEvents && (
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    isSelected ? "bg-primary-foreground" : "bg-primary"
                  )} />
                )}
                {indicators.hasTodos && (
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    isSelected ? "bg-primary-foreground" : "bg-secondary"
                  )} />
                )}
                {indicators.hasMemories && (
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    isSelected ? "bg-primary-foreground" : "bg-accent"
                  )} />
                )}
                {indicators.hasJournal && (
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    isSelected ? "bg-primary-foreground/70" : "bg-muted-foreground"
                  )} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-muted-foreground">Events</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-secondary" />
          <span className="text-muted-foreground">Todos</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-muted-foreground">Memories</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-muted-foreground" />
          <span className="text-muted-foreground">Journal</span>
        </div>
      </div>
    </div>
  );
}
