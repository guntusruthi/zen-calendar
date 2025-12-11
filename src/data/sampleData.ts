import { Event, Todo, Memory, JournalEntry, Collection } from '@/types';
import { format, addDays, subDays } from 'date-fns';

const today = new Date();
const todayStr = format(today, 'yyyy-MM-dd');
const tomorrowStr = format(addDays(today, 1), 'yyyy-MM-dd');
const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd');
const nextWeekStr = format(addDays(today, 7), 'yyyy-MM-dd');

export const sampleEvents: Event[] = [
  {
    id: 'event-1',
    title: 'Morning Training',
    date: todayStr,
    startTime: '06:00',
    endTime: '07:30',
    description: 'Total Concentration Breathing practice',
  },
  {
    id: 'event-2',
    title: 'Team Meeting',
    date: todayStr,
    startTime: '10:00',
    endTime: '11:00',
    description: 'Discuss upcoming missions',
  },
  {
    id: 'event-3',
    title: 'Sword Maintenance',
    date: tomorrowStr,
    startTime: '14:00',
    endTime: '15:00',
    description: 'Polish and sharpen the Nichirin blade',
  },
  {
    id: 'event-4',
    title: 'Village Patrol',
    date: nextWeekStr,
    startTime: '20:00',
    endTime: '23:00',
    description: 'Night patrol duty',
  },
];

export const sampleTodos: Todo[] = [
  {
    id: 'todo-1',
    text: 'Practice Water Breathing - First Form',
    completed: true,
    date: todayStr,
    priority: 'high',
  },
  {
    id: 'todo-2',
    text: 'Meditate for 30 minutes',
    completed: false,
    date: todayStr,
    priority: 'medium',
  },
  {
    id: 'todo-3',
    text: 'Write in journal',
    completed: false,
    date: todayStr,
    priority: 'low',
  },
  {
    id: 'todo-4',
    text: 'Review mission briefing',
    completed: false,
    date: tomorrowStr,
    priority: 'high',
  },
];

export const sampleMemories: Memory[] = [
  {
    id: 'memory-1',
    imageUrl: 'https://images.unsplash.com/photo-1492571350019-22de08371f02?w=400&h=300&fit=crop',
    caption: 'Beautiful sunrise during morning training',
    date: yesterdayStr,
  },
  {
    id: 'memory-2',
    imageUrl: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&h=300&fit=crop',
    caption: 'Cherry blossoms in the garden',
    date: todayStr,
  },
];

export const sampleJournals: JournalEntry[] = [
  {
    id: 'journal-1',
    content: 'Today was a challenging but rewarding day. I managed to complete my breathing exercises and made progress with my training. The sunrise was particularly beautiful this morning, reminding me why I continue to push forward. Tomorrow I will work on improving my reaction time.',
    date: yesterdayStr,
    mood: 'calm',
  },
];

export const sampleCollections: Collection[] = [
  {
    id: 'collection-1',
    name: 'Training Notes',
    color: 'bg-primary',
    files: [
      {
        id: 'file-1',
        name: 'Breathing Techniques Guide',
        type: 'pdf',
        url: '#',
        uploadedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'collection-2',
    name: 'Mission Reports',
    color: 'bg-secondary',
    files: [],
  },
];
