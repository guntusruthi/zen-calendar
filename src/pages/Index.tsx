import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { CalendarView } from '@/components/CalendarView';
import { TodoList } from '@/components/TodoList';
import { MemoryGallery } from '@/components/MemoryGallery';
import { Journal } from '@/components/Journal';
import { Collections } from '@/components/Collections';
import { FloatingTodoWidget } from '@/components/FloatingTodoWidget';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useReminders } from '@/hooks/useReminders';
import { supabase } from '@/integrations/supabase/client';
import { Event, Todo, Memory, JournalEntry, Collection, CollectionFile, ViewMode } from '@/types';
import { 
  sampleEvents, 
  sampleTodos, 
  sampleMemories, 
  sampleJournals, 
  sampleCollections 
} from '@/data/sampleData';
import { User } from '@supabase/supabase-js';

// Simple ID generator
const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isInitialized, setIsInitialized] = useLocalStorage('breath-initialized', false);

  // Persistent data
  const [events, setEvents] = useLocalStorage<Event[]>('breath-events', []);
  const [todos, setTodos] = useLocalStorage<Todo[]>('breath-todos', []);
  const [memories, setMemories] = useLocalStorage<Memory[]>('breath-memories', []);
  const [journals, setJournals] = useLocalStorage<JournalEntry[]>('breath-journals', []);
  const [collections, setCollections] = useLocalStorage<Collection[]>('breath-collections', []);

  // Auth check
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) {
        navigate('/auth');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Initialize with sample data on first load
  useEffect(() => {
    if (!isInitialized && user) {
      setEvents(sampleEvents);
      setTodos(sampleTodos);
      setMemories(sampleMemories);
      setJournals(sampleJournals);
      setCollections(sampleCollections);
      setIsInitialized(true);
    }
  }, [isInitialized, user]);

  // Initialize smart reminders
  useReminders({ events });

  // Event handlers
  const handleAddEvent = (event: Omit<Event, 'id'>) => {
    setEvents(prev => [...prev, { ...event, id: generateId() }]);
  };

  const handleAddTodo = (todo: Omit<Todo, 'id'>) => {
    setTodos(prev => [...prev, { ...todo, id: generateId() }]);
  };

  const handleToggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const handleAddMemory = (memory: Omit<Memory, 'id'>) => {
    setMemories(prev => [...prev, { ...memory, id: generateId() }]);
  };

  const handleDeleteMemory = (id: string) => {
    setMemories(prev => prev.filter(memory => memory.id !== id));
  };

  const handleSaveJournal = (entry: Omit<JournalEntry, 'id'>) => {
    setJournals(prev => {
      const existingIndex = prev.findIndex(j => j.date === entry.date);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...entry, id: prev[existingIndex].id };
        return updated;
      }
      return [...prev, { ...entry, id: generateId() }];
    });
  };

  const handleAddCollection = (collection: Omit<Collection, 'id' | 'files'>) => {
    setCollections(prev => [...prev, { ...collection, id: generateId(), files: [] }]);
  };

  const handleDeleteCollection = (id: string) => {
    setCollections(prev => prev.filter(c => c.id !== id));
  };

  const handleAddFile = (collectionId: string, file: Omit<CollectionFile, 'id' | 'uploadedAt'>) => {
    setCollections(prev => prev.map(c =>
      c.id === collectionId
        ? { ...c, files: [...c.files, { ...file, id: generateId(), uploadedAt: new Date().toISOString() }] }
        : c
    ));
  };

  const handleDeleteFile = (collectionId: string, fileId: string) => {
    setCollections(prev => prev.map(c =>
      c.id === collectionId
        ? { ...c, files: c.files.filter(f => f.id !== fileId) }
        : c
    ));
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            events={events}
            todos={todos}
            memories={memories}
            journals={journals}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onToggleTodo={handleToggleTodo}
          />
        );
      case 'calendar':
        return (
          <CalendarView
            events={events}
            todos={todos}
            memories={memories}
            journals={journals}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onAddEvent={handleAddEvent}
            onToggleTodo={handleToggleTodo}
          />
        );
      case 'todos':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">To-Do List</h1>
              <p className="text-muted-foreground mt-1">Track and complete your tasks</p>
            </div>
            <TodoList
              todos={todos}
              selectedDate={selectedDate}
              onAddTodo={handleAddTodo}
              onToggleTodo={handleToggleTodo}
              onDeleteTodo={handleDeleteTodo}
            />
          </div>
        );
      case 'memories':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Memories</h1>
              <p className="text-muted-foreground mt-1">Capture moments to remember</p>
            </div>
            <MemoryGallery
              memories={memories}
              selectedDate={selectedDate}
              onAddMemory={handleAddMemory}
              onDeleteMemory={handleDeleteMemory}
            />
          </div>
        );
      case 'journal':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Journal</h1>
              <p className="text-muted-foreground mt-1">Write your thoughts and reflections</p>
            </div>
            <Journal
              journals={journals}
              selectedDate={selectedDate}
              onSaveJournal={handleSaveJournal}
            />
          </div>
        );
      case 'collections':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Collections</h1>
              <p className="text-muted-foreground mt-1">Organize your important files</p>
            </div>
            <Collections
              collections={collections}
              onAddCollection={handleAddCollection}
              onDeleteCollection={handleDeleteCollection}
              onAddFile={handleAddFile}
              onDeleteFile={handleDeleteFile}
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 checkered-pattern dark:hidden" />
        <div className="absolute inset-0 lightning-effect hidden dark:block" />
        <div className="absolute inset-0 bg-gradient-water dark:bg-gradient-lightning" />
      </div>

      {/* Sidebar */}
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {/* Main Content */}
      <main className="ml-64 min-h-screen p-8 relative">
        <div className="max-w-6xl mx-auto">
          {renderView()}
        </div>
      </main>

      {/* Floating Todo Widget - Always visible */}
      <FloatingTodoWidget 
        todos={todos} 
        onToggleTodo={handleToggleTodo} 
      />
    </div>
  );
};

export default Index;
