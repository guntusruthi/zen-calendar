import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Event } from '@/types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, 'id'>) => void;
  selectedDate: Date;
}

const timeSlots = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
];

export function EventModal({ isOpen, onClose, onSave, selectedDate }: EventModalProps) {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title,
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime,
      endTime,
      description,
    });

    setTitle('');
    setStartTime('09:00');
    setEndTime('10:00');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-foreground">New Event</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              className="bg-muted/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Date</label>
            <Input
              value={format(selectedDate, 'MMMM d, yyyy')}
              readOnly
              className="bg-muted/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Start Time</label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-muted/50 text-foreground"
              >
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">End Time</label>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-muted/50 text-foreground"
              >
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description (optional)"
              className="bg-muted/50 resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="breathing" className="flex-1">
              Save Event
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
