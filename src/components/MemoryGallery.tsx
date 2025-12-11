import { useState } from 'react';
import { Plus, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Memory } from '@/types';
import { format } from 'date-fns';

interface MemoryGalleryProps {
  memories: Memory[];
  selectedDate: Date;
  onAddMemory: (memory: Omit<Memory, 'id'>) => void;
  onDeleteMemory: (id: string) => void;
}

export function MemoryGallery({ memories, selectedDate, onAddMemory, onDeleteMemory }: MemoryGalleryProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayMemories = memories.filter(m => m.date === dateStr);

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    onAddMemory({
      imageUrl,
      caption,
      date: dateStr,
    });

    setImageUrl('');
    setCaption('');
    setIsAdding(false);
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 card-hover">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground">Memories</h2>
          <p className="text-muted-foreground text-sm">
            {format(selectedDate, 'MMMM d, yyyy')} • {dayMemories.length} photos
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Photo
        </Button>
      </div>

      {/* Add Memory Form */}
      {isAdding && (
        <div className="mb-6 p-4 rounded-lg bg-muted/50 border border-border animate-fade-in-up">
          <form onSubmit={handleAddMemory} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Image URL</label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="bg-background"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Caption</label>
              <Textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                className="bg-background resize-none"
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsAdding(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Save Memory
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Gallery Grid */}
      {dayMemories.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {dayMemories.map((memory, index) => (
            <div
              key={memory.id}
              className="relative group aspect-square rounded-lg overflow-hidden cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setSelectedMemory(memory)}
            >
              <img
                src={memory.imageUrl}
                alt={memory.caption}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm line-clamp-2">{memory.caption}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteMemory(memory.id);
                }}
              >
                <X className="w-4 h-4 text-white" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No memories for this day</p>
          <p className="text-sm">Capture a moment to remember</p>
        </div>
      )}

      {/* Lightbox */}
      {selectedMemory && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMemory(null)}
        >
          <div className="relative max-w-4xl w-full animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70"
              onClick={() => setSelectedMemory(null)}
            >
              <X className="w-5 h-5 text-white" />
            </Button>
            <img
              src={selectedMemory.imageUrl}
              alt={selectedMemory.caption}
              className="w-full rounded-lg"
            />
            {selectedMemory.caption && (
              <p className="text-white text-center mt-4 text-lg">{selectedMemory.caption}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
