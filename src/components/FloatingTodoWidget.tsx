import { useState } from 'react';
import { CheckCircle2, Circle, ChevronUp, ChevronDown, ListTodo, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Todo } from '@/types';
import { format, isToday, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface FloatingTodoWidgetProps {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
}

export function FloatingTodoWidget({ todos, onToggleTodo }: FloatingTodoWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  // Get today's incomplete todos
  const todayTodos = todos.filter(todo => {
    const todoDate = parseISO(todo.date);
    return isToday(todoDate) && !todo.completed;
  });

  // Get overdue todos
  const overdueTodos = todos.filter(todo => {
    const todoDate = parseISO(todo.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return todoDate < today && !todo.completed;
  });

  const allPendingTodos = [...overdueTodos, ...todayTodos];

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-elegant bg-primary hover:bg-primary/90"
      >
        <ListTodo className="w-6 h-6" />
        {allPendingTodos.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
            {allPendingTodos.length}
          </span>
        )}
      </Button>
    );
  }

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-muted-foreground';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 animate-fade-in-up">
      <div className="bg-card/95 backdrop-blur-lg border border-border rounded-2xl shadow-elegant overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-breathing dark:bg-gradient-thunder">
          <div className="flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-primary-foreground" />
            <span className="font-display font-semibold text-primary-foreground">
              Today's Tasks
            </span>
            {allPendingTodos.length > 0 && (
              <span className="px-2 py-0.5 bg-background/20 text-primary-foreground text-xs rounded-full">
                {allPendingTodos.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-primary-foreground hover:bg-background/20"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-primary-foreground hover:bg-background/20"
              onClick={() => setIsVisible(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Todo List */}
        {isExpanded && (
          <div className="max-h-64 overflow-y-auto">
            {allPendingTodos.length === 0 ? (
              <div className="p-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-2 opacity-50" />
                <p className="text-muted-foreground text-sm">All tasks completed!</p>
                <p className="text-muted-foreground/70 text-xs mt-1">Enjoy your day</p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {overdueTodos.length > 0 && (
                  <div className="px-2 py-1">
                    <span className="text-xs font-medium text-destructive">Overdue</span>
                  </div>
                )}
                {overdueTodos.map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggleTodo}
                    getPriorityColor={getPriorityColor}
                    isOverdue
                  />
                ))}
                {todayTodos.length > 0 && overdueTodos.length > 0 && (
                  <div className="px-2 py-1 pt-2">
                    <span className="text-xs font-medium text-muted-foreground">Today</span>
                  </div>
                )}
                {todayTodos.map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggleTodo}
                    getPriorityColor={getPriorityColor}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  getPriorityColor: (priority: Todo['priority']) => string;
  isOverdue?: boolean;
}

function TodoItem({ todo, onToggle, getPriorityColor, isOverdue }: TodoItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group",
        isOverdue && "bg-destructive/5"
      )}
      onClick={() => onToggle(todo.id)}
    >
      <button className="flex-shrink-0">
        <Circle className={cn("w-5 h-5", getPriorityColor(todo.priority))} />
      </button>
      <span className={cn(
        "flex-1 text-sm truncate",
        isOverdue && "text-destructive"
      )}>
        {todo.text}
      </span>
      {todo.priority === 'high' && (
        <span className="text-xs px-1.5 py-0.5 bg-destructive/10 text-destructive rounded">!</span>
      )}
    </div>
  );
}
