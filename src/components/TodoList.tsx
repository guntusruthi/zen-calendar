import { useState } from 'react';
import { Plus, CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Todo } from '@/types';
import { format } from 'date-fns';

interface TodoListProps {
  todos: Todo[];
  selectedDate: Date;
  onAddTodo: (todo: Omit<Todo, 'id'>) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

export function TodoList({ todos, selectedDate, onAddTodo, onToggleTodo, onDeleteTodo }: TodoListProps) {
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayTodos = todos.filter(t => t.date === dateStr);
  const completedCount = dayTodos.filter(t => t.completed).length;

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    onAddTodo({
      text: newTodo,
      completed: false,
      date: dateStr,
      priority,
    });
    setNewTodo('');
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 card-hover">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground">To-Do List</h2>
          <p className="text-muted-foreground text-sm">
            {format(selectedDate, 'MMMM d, yyyy')} • {completedCount}/{dayTodos.length} completed
          </p>
        </div>
      </div>

      {/* Add Todo Form */}
      <form onSubmit={handleAddTodo} className="mb-6">
        <div className="flex gap-2">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 bg-muted/50"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="h-10 px-3 rounded-lg border border-input bg-muted/50 text-foreground text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <Button type="submit" size="icon">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </form>

      {/* Progress Bar */}
      {dayTodos.length > 0 && (
        <div className="mb-6">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{ width: `${(completedCount / dayTodos.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Todo Items */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {dayTodos.length > 0 ? (
          dayTodos.map((todo, index) => (
            <div
              key={todo.id}
              className={cn(
                "p-4 rounded-lg bg-muted/50 flex items-center gap-3 group transition-all",
                "hover:bg-muted animate-fade-in-up",
                todo.completed && "opacity-60"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <button onClick={() => onToggleTodo(todo.id)}>
                {todo.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                )}
              </button>
              <span className={cn(
                "flex-1",
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
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                onClick={() => onDeleteTodo(todo.id)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No tasks for this day</p>
            <p className="text-sm">Add a task to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
