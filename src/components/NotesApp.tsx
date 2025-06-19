
import { useState } from 'react';
import { Plus, Search, FileText, Folder, Tag, Trash2, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const NotesApp = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Project Ideas',
      content: 'Ideas for upcoming projects:\n1. Mobile app for task management\n2. AI-powered note-taking tool\n3. Team collaboration platform',
      category: 'Work',
      tags: ['ideas', 'projects', 'development'],
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10'
    },
    {
      id: '2',
      title: 'Meeting Notes - Q4 Planning',
      content: 'Key points from Q4 planning meeting:\n- Focus on user retention\n- Implement new features\n- Budget allocation for marketing',
      category: 'Work',
      tags: ['meeting', 'planning', 'q4'],
      createdAt: '2024-01-12',
      updatedAt: '2024-01-12'
    },
    {
      id: '3',
      title: 'Book Recommendations',
      content: 'Books to read:\n- "Atomic Habits" by James Clear\n- "The Psychology of Money" by Morgan Housel\n- "Designing Data-Intensive Applications"',
      category: 'Personal',
      tags: ['books', 'reading', 'learning'],
      createdAt: '2024-01-08',
      updatedAt: '2024-01-13'
    }
  ]);

  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: 'Personal',
    tags: ''
  });

  const categories = ['Work', 'Personal', 'Learning', 'Ideas', 'Archive'];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || note.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const addNote = () => {
    if (!newNote.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a note title",
        variant: "destructive"
      });
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      category: newNote.category,
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const updatedNotes = [note, ...notes];
    setNotes(updatedNotes);
    setSelectedNote(note);
    setNewNote({
      title: '',
      content: '',
      category: 'Personal',
      tags: ''
    });
    setIsDialogOpen(false);
    toast({
      title: "Success",
      description: "Note created successfully"
    });
  };

  const startEdit = () => {
    if (selectedNote) {
      setEditTitle(selectedNote.title);
      setEditContent(selectedNote.content);
      setIsEditing(true);
    }
  };

  const saveEdit = () => {
    if (selectedNote) {
      const updatedNotes = notes.map(note =>
        note.id === selectedNote.id
          ? {
              ...note,
              title: editTitle,
              content: editContent,
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : note
      );
      setNotes(updatedNotes);
      const updatedNote = updatedNotes.find(n => n.id === selectedNote.id);
      if (updatedNote) {
        setSelectedNote(updatedNote);
      }
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Note updated successfully"
      });
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditTitle('');
    setEditContent('');
  };

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    if (selectedNote?.id === noteId) {
      setSelectedNote(updatedNotes[0] || null);
    }
    toast({
      title: "Note deleted",
      description: "Note has been removed successfully"
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Notes</h2>
          <p className="text-slate-600 dark:text-slate-300">Capture and organize your thoughts</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="hover:scale-105 transition-transform">
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                  placeholder="Enter note title"
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  rows={6}
                  value={newNote.content}
                  onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                  placeholder="Start writing your note..."
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newNote.category} onValueChange={(value) => setNewNote({...newNote, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={newNote.tags}
                  onChange={(e) => setNewNote({...newNote, tags: e.target.value})}
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              <Button onClick={addNote} className="w-full">
                Create Note
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Notes List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search and Filter */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Notes List */}
          <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-350px)]">
            {filteredNotes.length === 0 ? (
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300">No notes found</h3>
                  <p className="text-slate-500">Try adjusting your search or create a new note</p>
                </CardContent>
              </Card>
            ) : (
              filteredNotes.map((note) => (
                <Card
                  key={note.id}
                  className={`border-0 shadow-md cursor-pointer transition-all hover:shadow-lg ${
                    selectedNote?.id === note.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedNote(note)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-slate-900 dark:text-white truncate flex-1">
                        {note.title}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
                      {note.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {note.category}
                        </Badge>
                        {note.tags.length > 0 && (
                          <div className="flex gap-1">
                            {note.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {note.tags.length > 2 && (
                              <span className="text-xs text-slate-500">+{note.tags.length - 2}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                      {formatDate(note.updatedAt)}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Note Editor */}
        <div className="lg:col-span-2">
          {selectedNote ? (
            <Card className="border-0 shadow-md h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {isEditing ? (
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="text-xl font-bold border-0 p-0 focus:ring-0"
                        placeholder="Note title"
                      />
                    ) : (
                      <CardTitle className="text-xl">{selectedNote.title}</CardTitle>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{selectedNote.category}</Badge>
                      {selectedNote.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button variant="outline" size="sm" onClick={cancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                        <Button size="sm" onClick={saveEdit}>
                          <Save className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" size="sm" onClick={startEdit}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <CardDescription>
                  Created: {formatDate(selectedNote.createdAt)} • 
                  Updated: {formatDate(selectedNote.updatedAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {isEditing ? (
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[400px] resize-none border-0 focus:ring-0 p-0"
                    placeholder="Start writing..."
                  />
                ) : (
                  <div className="min-h-[400px] whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedNote.content}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-md h-full">
              <CardContent className="p-8 text-center flex items-center justify-center h-full">
                <div>
                  <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-slate-600 dark:text-slate-300 mb-2">
                    Select a note to view
                  </h3>
                  <p className="text-slate-500">
                    Choose a note from the list or create a new one to get started
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesApp;
