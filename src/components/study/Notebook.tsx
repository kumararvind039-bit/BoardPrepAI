import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, FileText, Trash2, BookOpen, Volume2 } from 'lucide-react';
import { Note, Subject } from '@/types';
import { generateSpeech } from '@/services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export function Notebook() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Laws of Reflection',
      content: '1. The angle of incidence is equal to the angle of reflection.\n2. The incident ray, the reflected ray and the normal to the mirror at the point of incidence all lie in the same plane.',
      subject: 'Science',
      createdAt: Date.now()
    },
    {
      id: '2',
      title: 'Non-Cooperation Movement',
      content: 'Launched in 1920 by Mahatma Gandhi. Aimed to resist British rule in India through non-violent means.',
      subject: 'Social Science',
      createdAt: Date.now() - 86400000
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', subject: 'Science' as Subject });
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const audioResult = await generateSpeech(text);
      if (audioResult && audioResult.data) {
        // Create an audio blob from the base64 data to avoid potential data URI size limits or formatting issues
        const binaryString = window.atob(audioResult.data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: audioResult.mimeType || 'audio/wav' });
        const url = URL.createObjectURL(blob);
        
        const audio = new Audio(url);
        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(url);
        };
        audio.onerror = (e) => {
          console.error("Audio playback error", e);
          setIsSpeaking(false);
          URL.revokeObjectURL(url);
        };
        await audio.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("Speech generation failed", error);
      setIsSpeaking(false);
    }
  };

  const handleAddNote = () => {
    if (newNote.title && newNote.content) {
      const note: Note = {
        id: Math.random().toString(36).substr(2, 9),
        ...newNote,
        createdAt: Date.now()
      };
      setNotes([note, ...notes]);
      setNewNote({ title: '', content: '', subject: 'Science' });
      setIsAdding(false);
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    if (selectedNote?.id === id) setSelectedNote(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
      <div className="lg:col-span-1 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800">My Notes</h3>
          <Button onClick={() => setIsAdding(true)} size="sm" className="bg-brand-600 hover:bg-brand-700">
            <Plus className="w-4 h-4 mr-2" /> New Note
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search notes..." className="pl-10 bg-white border-slate-200" />
        </div>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-3">
            {notes.map((note) => (
              <Card 
                key={note.id} 
                className={cn(
                  "cursor-pointer transition-all border-none shadow-sm hover:shadow-md",
                  selectedNote?.id === note.id ? "ring-2 ring-brand-500 bg-brand-50/50" : "bg-white"
                )}
                onClick={() => setSelectedNote(note)}
              >
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-2">
                      {note.subject}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-slate-300 hover:text-red-500"
                      onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <CardTitle className="text-sm font-bold text-slate-800 line-clamp-1">{note.title}</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-slate-300 hover:text-brand-500 shrink-0"
                      onClick={(e) => { e.stopPropagation(); handleSpeak(note.content); }}
                      disabled={isSpeaking}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {isAdding ? (
            <motion.div 
              key="add-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-800">Create New Note</h3>
                <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Subject</label>
                  <div className="flex flex-wrap gap-2">
                    {['Science', 'Mathematics', 'Social Science', 'English', 'Hindi', 'Gujarati', 'Sanskrit'].map((s) => (
                      <Badge
                        key={s}
                        variant={newNote.subject === s ? 'default' : 'outline'}
                        className="cursor-pointer px-4 py-1.5"
                        onClick={() => setNewNote({ ...newNote, subject: s as Subject })}
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Title</label>
                  <Input 
                    placeholder="e.g. Newton's Third Law" 
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">Content</label>
                  <Textarea 
                    placeholder="Paste your textbook content or write your notes here..." 
                    className="min-h-[300px]"
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  />
                </div>
                <Button className="w-full bg-brand-600 hover:bg-brand-700 h-12 text-lg" onClick={handleAddNote}>
                  Save Note
                </Button>
              </div>
            </motion.div>
          ) : selectedNote ? (
            <motion.div 
              key="view-note"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col h-full"
            >
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
                <div>
                  <Badge className="mb-4 bg-brand-100 text-brand-700 hover:bg-brand-100">{selectedNote.subject}</Badge>
                  <h3 className="text-3xl font-bold text-slate-900">{selectedNote.title}</h3>
                  <p className="text-slate-400 text-sm mt-2">Last updated: {new Date(selectedNote.createdAt).toLocaleDateString()}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={cn("h-10 w-10 rounded-full", isSpeaking && "animate-pulse text-brand-600 border-brand-200")}
                  onClick={() => handleSpeak(selectedNote.content)}
                  disabled={isSpeaking}
                >
                  <Volume2 className="w-5 h-5" />
                </Button>
              </div>
              <ScrollArea className="flex-1 p-8">
                <div className="prose prose-slate max-w-none">
                  {selectedNote.content.split('\n').map((para, i) => (
                    <p key={i} className="text-slate-700 leading-relaxed mb-4">{para}</p>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
                <Button variant="outline" className="flex-1 gap-2">
                  <FileText className="w-4 h-4" /> Export as PDF
                </Button>
                <Button className="flex-1 gap-2 bg-brand-600 hover:bg-brand-700">
                  <BookOpen className="w-4 h-4" /> Study with AI
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-lg font-semibold text-slate-600">No Note Selected</h3>
              <p className="max-w-xs mt-2">Select a note from the sidebar or create a new one to start studying.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


