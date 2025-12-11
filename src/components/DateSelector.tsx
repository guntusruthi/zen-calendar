import { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DateSelectorProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function DateSelector({ selectedDate, onSelectDate }: DateSelectorProps) {
  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">Quick Navigate</span>
        <Calendar className="w-4 h-4 text-muted-foreground" />
      </div>
      
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onSelectDate(subDays(selectedDate, 1))}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">
            {format(selectedDate, 'd')}
          </p>
          <p className="text-xs text-muted-foreground">
            {format(selectedDate, 'MMM')}
          </p>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onSelectDate(addDays(selectedDate, 1))}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {!isToday && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-3 text-xs"
          onClick={() => onSelectDate(new Date())}
        >
          Go to Today
        </Button>
      )}
    </div>
  );
}
