import { useState } from 'react';
import { Save, Smile, Meh, Frown, Sparkles, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { JournalEntry } from '@/types';
import { format } from 'date-fns';

interface JournalProps {
  journals: JournalEntry[];
  selectedDate: Date;
  onSaveJournal: (entry: Omit<JournalEntry, 'id'>) => void;
}

const moods = [
  { id: 'happy', icon: Smile, label: 'Happy', color: 'text-yellow-500' },
  { id: 'neutral', icon: Meh, label: 'Neutral', color: 'text-muted-foreground' },
  { id: 'sad', icon: Frown, label: 'Sad', color: 'text-blue-400' },
  { id: 'excited', icon: Sparkles, label: 'Excited', color: 'text-primary' },
  { id: 'calm', icon: Cloud, label: 'Calm', color: 'text-accent' },
] as const;

export function Journal({ journals, selectedDate, onSaveJournal }: JournalProps) {
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const existingEntry = journals.find(j => j.date === dateStr);

  const [content, setContent] = useState(existingEntry?.content || '');
  const [mood, setMood] = useState<JournalEntry['mood']>(existingEntry?.mood || 'neutral');
  const [isSaved, setIsSaved] = useState(!!existingEntry);

  const handleSave = () => {
    if (!content.trim()) return;

    onSaveJournal({
      content,
      date: dateStr,
      mood,
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 card-hover">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground">Journal</h2>
          <p className="text-muted-foreground text-sm">{format(selectedDate, 'MMMM d, yyyy')}</p>
        </div>
        <Button
          onClick={handleSave}
          variant={isSaved ? "outline" : "default"}
          disabled={!content.trim()}
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaved ? 'Saved!' : 'Save Entry'}
        </Button>
      </div>

      {/* Mood Selector */}
      <div className="mb-6">
        <label className="text-sm font-medium text-foreground mb-3 block">How are you feeling?</label>
        <div className="flex gap-3">
          {moods.map(({ id, icon: Icon, label, color }) => (
            <button
              key={id}
              onClick={() => setMood(id as JournalEntry['mood'])}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-lg transition-all",
                "hover:bg-muted",
                mood === id && "bg-primary/10 ring-2 ring-primary"
              )}
            >
              <Icon className={cn("w-6 h-6", color)} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Journal Content */}
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write about your day... What happened? How did you feel? What are you grateful for?"
        className="min-h-[300px] bg-muted/30 resize-none text-base leading-relaxed"
      />

      {/* Word Count */}
      <div className="mt-3 text-sm text-muted-foreground text-right">
        {content.split(/\s+/).filter(Boolean).length} words
      </div>

      {/* Previous Entries Preview */}
      {journals.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="font-medium text-foreground mb-3">Recent Entries</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {journals
              .filter(j => j.date !== dateStr)
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map(entry => (
                <div key={entry.id} className="p-3 rounded-lg bg-muted/30 text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{format(new Date(entry.date), 'MMM d, yyyy')}</span>
                    {entry.mood && (
                      <span className="text-muted-foreground capitalize">{entry.mood}</span>
                    )}
                  </div>
                  <p className="text-muted-foreground line-clamp-2">{entry.content}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
