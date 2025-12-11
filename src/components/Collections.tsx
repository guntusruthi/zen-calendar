import { useState } from 'react';
import { Plus, FolderOpen, File, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Collection, CollectionFile } from '@/types';

interface CollectionsProps {
  collections: Collection[];
  onAddCollection: (collection: Omit<Collection, 'id' | 'files'>) => void;
  onDeleteCollection: (id: string) => void;
  onAddFile: (collectionId: string, file: Omit<CollectionFile, 'id' | 'uploadedAt'>) => void;
  onDeleteFile: (collectionId: string, fileId: string) => void;
}

const collectionColors = [
  'bg-primary',
  'bg-secondary',
  'bg-accent',
  'bg-destructive',
  'bg-muted-foreground',
];

export function Collections({ 
  collections, 
  onAddCollection, 
  onDeleteCollection, 
  onAddFile, 
  onDeleteFile 
}: CollectionsProps) {
  const [isAddingCollection, setIsAddingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileUrl, setNewFileUrl] = useState('');

  const handleAddCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    onAddCollection({
      name: newCollectionName,
      color: collectionColors[collections.length % collectionColors.length],
    });

    setNewCollectionName('');
    setIsAddingCollection(false);
  };

  const handleAddFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim() || !newFileUrl.trim() || !selectedCollection) return;

    onAddFile(selectedCollection.id, {
      name: newFileName,
      type: getFileType(newFileUrl),
      url: newFileUrl,
    });

    setNewFileName('');
    setNewFileUrl('');
    setIsAddingFile(false);
  };

  const getFileType = (url: string): string => {
    const extension = url.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
    if (['pdf'].includes(extension)) return 'pdf';
    if (['doc', 'docx'].includes(extension)) return 'document';
    return 'file';
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 card-hover">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground">Collections</h2>
          <p className="text-muted-foreground text-sm">{collections.length} collections</p>
        </div>
        <Button onClick={() => setIsAddingCollection(true)} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Collection
        </Button>
      </div>

      {/* Add Collection Form */}
      {isAddingCollection && (
        <div className="mb-6 p-4 rounded-lg bg-muted/50 border border-border animate-fade-in-up">
          <form onSubmit={handleAddCollection} className="flex gap-2">
            <Input
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="Collection name..."
              className="flex-1 bg-background"
              autoFocus
            />
            <Button type="submit">Create</Button>
            <Button type="button" variant="ghost" onClick={() => setIsAddingCollection(false)}>
              <X className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}

      {/* Collections Grid */}
      {collections.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {collections.map((collection, index) => (
            <div
              key={collection.id}
              className={cn(
                "p-4 rounded-lg bg-muted/50 cursor-pointer transition-all",
                "hover:bg-muted group animate-fade-in-up",
                selectedCollection?.id === collection.id && "ring-2 ring-primary"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => setSelectedCollection(
                selectedCollection?.id === collection.id ? null : collection
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", collection.color)}>
                  <FolderOpen className="w-5 h-5 text-white" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCollection(collection.id);
                    if (selectedCollection?.id === collection.id) {
                      setSelectedCollection(null);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
              <h3 className="font-medium text-foreground truncate">{collection.name}</h3>
              <p className="text-sm text-muted-foreground">{collection.files.length} files</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No collections yet</p>
          <p className="text-sm">Create a collection to organize your files</p>
        </div>
      )}

      {/* Selected Collection Files */}
      {selectedCollection && (
        <div className="mt-6 pt-6 border-t border-border animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">{selectedCollection.name}</h3>
            <Button onClick={() => setIsAddingFile(true)} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add File
            </Button>
          </div>

          {/* Add File Form */}
          {isAddingFile && (
            <div className="mb-4 p-4 rounded-lg bg-muted/50 border border-border">
              <form onSubmit={handleAddFile} className="space-y-3">
                <Input
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="File name..."
                  className="bg-background"
                />
                <Input
                  value={newFileUrl}
                  onChange={(e) => setNewFileUrl(e.target.value)}
                  placeholder="File URL..."
                  className="bg-background"
                />
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" onClick={() => setIsAddingFile(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">Add</Button>
                </div>
              </form>
            </div>
          )}

          {/* Files List */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {selectedCollection.files.length > 0 ? (
              selectedCollection.files.map(file => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 group hover:bg-muted transition-colors"
                >
                  <File className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.type}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onDeleteFile(selectedCollection.id, file.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-muted-foreground text-sm">No files in this collection</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
