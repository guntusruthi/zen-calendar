import { format } from 'date-fns';
import { Calendar as CalendarIcon, CheckCircle2, Image, BookOpen, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Event, Todo, Memory, JournalEntry } from '@/types';
import { Calendar } from './Calendar';
import { DayView } from './DayView';

interface DashboardProps {
  events: Event[];
  todos: Todo[];
  memories: Memory[];
  journals: JournalEntry[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onToggleTodo: (id: string) => void;
}

export function Dashboard({ 
  events, 
  todos, 
  memories, 
  journals, 
  selectedDate, 
  onSelectDate,
  onToggleTodo 
}: DashboardProps) {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayEvents = events.filter(e => e.date === todayStr);
  const todayTodos = todos.filter(t => t.date === todayStr);
  const completedTodayTodos = todayTodos.filter(t => t.completed).length;

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const selectedJournal = journals.find(j => j.date === selectedDateStr);

  const stats = [
    { 
      label: 'Events Today', 
      value: todayEvents.length, 
      icon: CalendarIcon, 
      color: 'text-primary',
      bg: 'bg-primary/10' 
    },
    { 
      label: 'Tasks Done', 
      value: `${completedTodayTodos}/${todayTodos.length}`, 
      icon: CheckCircle2, 
      color: 'text-secondary',
      bg: 'bg-secondary/10' 
    },
    { 
      label: 'Total Memories', 
      value: memories.length, 
      icon: Image, 
      color: 'text-accent',
      bg: 'bg-accent/10' 
    },
    { 
      label: 'Journal Entries', 
      value: journals.length, 
      icon: BookOpen, 
      color: 'text-muted-foreground',
      bg: 'bg-muted' 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-1">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-card rounded-xl border border-border p-4 card-hover animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.bg)}>
                  <Icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Calendar
          events={events}
          todos={todos}
          memories={memories}
          journals={journals}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
        />

        {/* Day View */}
        <DayView
          date={selectedDate}
          events={events}
          todos={todos}
          memories={memories}
          journal={selectedJournal}
          onToggleTodo={onToggleTodo}
        />
      </div>

      {/* Upcoming Events */}
      <div className="bg-card rounded-2xl border border-border p-6 card-hover">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="font-display text-xl font-semibold text-foreground">Upcoming Events</h2>
        </div>
        
        {events.filter(e => new Date(e.date) >= new Date()).length > 0 ? (
          <div className="space-y-3">
            {events
              .filter(e => new Date(e.date) >= new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 5)
              .map((event, index) => (
                <div
                  key={event.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 animate-slide-in-right"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="text-center min-w-[60px]">
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(event.date), 'MMM')}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {format(new Date(event.date), 'd')}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.startTime} - {event.endTime}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-6">No upcoming events</p>
        )}
      </div>
    </div>
  );
}
