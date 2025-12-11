import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from './Calendar';
import { DayView } from './DayView';
import { EventModal } from './EventModal';
import { Event, Todo, Memory, JournalEntry } from '@/types';

interface CalendarViewProps {
  events: Event[];
  todos: Todo[];
  memories: Memory[];
  journals: JournalEntry[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onAddEvent: (event: Omit<Event, 'id'>) => void;
  onToggleTodo: (id: string) => void;
}

export function CalendarView({
  events,
  todos,
  memories,
  journals,
  selectedDate,
  onSelectDate,
  onAddEvent,
  onToggleTodo,
}: CalendarViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const selectedJournal = journals.find(j => j.date === selectedDateStr);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground mt-1">Manage your schedule and events</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} variant="breathing">
          <Plus className="w-4 h-4 mr-2" />
          New Event
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Calendar
          events={events}
          todos={todos}
          memories={memories}
          journals={journals}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
        />

        <DayView
          date={selectedDate}
          events={events}
          todos={todos}
          memories={memories}
          journal={selectedJournal}
          onToggleTodo={onToggleTodo}
        />
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onAddEvent}
        selectedDate={selectedDate}
      />
    </div>
  );
}
