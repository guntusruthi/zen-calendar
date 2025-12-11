export interface Event {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
  color?: string;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Memory {
  id: string;
  imageUrl: string;
  caption: string;
  date: string;
}

export interface JournalEntry {
  id: string;
  content: string;
  date: string;
  mood?: 'happy' | 'neutral' | 'sad' | 'excited' | 'calm';
}

export interface Collection {
  id: string;
  name: string;
  files: CollectionFile[];
  color: string;
}

export interface CollectionFile {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export type ViewMode = 'dashboard' | 'calendar' | 'todos' | 'memories' | 'journal' | 'collections';
