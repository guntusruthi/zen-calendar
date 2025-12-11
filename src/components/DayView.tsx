import { format } from 'date-fns';
import { Clock, CheckCircle2, Circle, Image, BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Event, Todo, Memory, JournalEntry } from '@/types';

interface DayViewProps {
  date: Date;
  events: Event[];
  todos: Todo[];
  memories: Memory[];
  journal?: JournalEntry;
  onToggleTodo: (id: string) => void;
}

export function DayView({ date, events, todos, memories, journal, onToggleTodo }: DayViewProps) {
  const dateStr = format(date, 'yyyy-MM-dd');
  const dayEvents = events.filter(e => e.date === dateStr);
  const dayTodos = todos.filter(t => t.date === dateStr);
  const dayMemories = memories.filter(m => m.date === dateStr);

  return (
    <div className="bg-card rounded-2xl border border-border p-6 card-hover">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground">
            {format(date, 'EEEE')}
          </h2>
          <p className="text-muted-foreground">{format(date, 'MMMM d, yyyy')}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Schedule Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-primary" />
            <h3 className="font-medium text-foreground">Schedule</h3>
            <span className="text-xs text-muted-foreground">({dayEvents.length})</span>
          </div>
          {dayEvents.length > 0 ? (
            <div className="space-y-2">
              {dayEvents.map(event => (
                <div
                  key={event.id}
                  className="p-3 rounded-lg bg-muted/50 border-l-4 border-primary"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{event.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {event.startTime} - {event.endTime}
                    </span>
                  </div>
                  {event.description && (
                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No events scheduled</p>
          )}
        </div>

        {/* Todos Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-secondary" />
            <h3 className="font-medium text-foreground">To-Do</h3>
            <span className="text-xs text-muted-foreground">
              ({dayTodos.filter(t => t.completed).length}/{dayTodos.length})
            </span>
          </div>
          {dayTodos.length > 0 ? (
            <div className="space-y-2">
              {dayTodos.map(todo => (
                <button
                  key={todo.id}
                  onClick={() => onToggleTodo(todo.id)}
                  className={cn(
                    "w-full p-3 rounded-lg bg-muted/50 flex items-center gap-3 transition-all",
                    "hover:bg-muted",
                    todo.completed && "opacity-60"
                  )}
                >
                  {todo.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className={cn(
                    "flex-1 text-left",
                    todo.completed && "line-through text-muted-foreground"
                  )}>
                    {todo.text}
                  </span>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    todo.priority === 'high' && "bg-destructive/20 text-destructive",
                    todo.priority === 'medium' && "bg-secondary/20 text-secondary",
                    todo.priority === 'low' && "bg-muted text-muted-foreground"
                  )}>
                    {todo.priority}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No tasks for today</p>
          )}
        </div>

        {/* Memories Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Image className="w-4 h-4 text-accent" />
            <h3 className="font-medium text-foreground">Memories</h3>
            <span className="text-xs text-muted-foreground">({dayMemories.length})</span>
          </div>
          {dayMemories.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {dayMemories.map(memory => (
                <div key={memory.id} className="relative group rounded-lg overflow-hidden">
                  <img
                    src={memory.imageUrl}
                    alt={memory.caption}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <p className="text-white text-xs line-clamp-2">{memory.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No memories captured</p>
          )}
        </div>

        {/* Journal Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-medium text-foreground">Journal</h3>
          </div>
          {journal ? (
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm text-foreground line-clamp-3">{journal.content}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No journal entry</p>
          )}
        </div>
      </div>
    </div>
  );
}
