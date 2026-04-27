import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { BrainCircuit, Send, Sparkles, HelpCircle, FileQuestion, BookMarked, FileText, ChevronRight, Volume2, Upload, Trash2, FileCheck } from 'lucide-react';
import { generateSocraticResponse, generateQuiz, generateFlashcards, generateSpeech } from '@/services/gemini';
import { ChatMessage, QuizQuestion, Flashcard, Subject, Chapter } from '@/types';
import { CHAPTERS } from '@/constants/chapters';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  data: string; // base64
  size: string;
}

export function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi! I'm your Board Exam Assistant. Which topic should we master today? Select a subject and chapter, or upload your own study material (PDF/Image) to get started!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState('chat');
  
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Science');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [difficulty, setDifficulty] = useState('Beginner');
  const [score, setScore] = useState(0);
  
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  
  const [selectedText, setSelectedText] = useState('');
  const [selectionPos, setSelectionPos] = useState<{x: number, y: number} | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const activeFile = uploadedFiles.find(f => f.id === selectedFileId);
      let context = selectedChapter 
        ? `Topic: ${selectedChapter.title} in ${selectedSubject} (GSEB English Medium Syllabus).` 
        : "Class 10 Board Exam Preparation (GSEB English Medium).";
      
      if (activeFile) {
        context += ` Also using content from uploaded file: ${activeFile.name}.`;
      }

      const response = await generateSocraticResponse(context, userMessage, messages, activeFile ? { data: activeFile.data, mimeType: activeFile.type } : undefined);
      setMessages(prev => [...prev, { role: 'model', text: response || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Error connecting to AI. Please check your API key." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        data: base64String,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      };
      setUploadedFiles(prev => [...prev, newFile]);
      setSelectedFileId(newFile.id);
      setMessages(prev => [...prev, { role: 'model', text: `I've received your file: ${file.name}. I'll use it as context for our session. What would you like to learn from it?` }]);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
    if (selectedFileId === id) setSelectedFileId(null);
  };

  const handleGenerateQuiz = async (newDifficulty?: string) => {
    if (!selectedChapter && uploadedFiles.length === 0) return;
    setIsLoading(true);
    const targetDifficulty = newDifficulty || difficulty;
    try {
      const activeFile = uploadedFiles.find(f => f.id === selectedFileId);
      const context = selectedChapter 
        ? `Chapter: ${selectedChapter.title} for Class 10 ${selectedSubject} (GSEB English Medium Syllabus).` 
        : "Class 10 Board Exam Preparation (GSEB English Medium).";
      
      const data = await generateQuiz(
        context, 
        selectedSubject, 
        targetDifficulty, 
        activeFile ? { data: activeFile.data, mimeType: activeFile.type } : undefined
      );
      setQuiz(data.questions || []);
      setUserAnswers({});
      setQuizSubmitted(false);
      setDifficulty(targetDifficulty);
      setActiveMode('quiz');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    let currentScore = 0;
    quiz.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setQuizSubmitted(true);
  };

  const handleAdaptiveNextStep = () => {
    const percentage = (score / quiz.length) * 100;
    if (percentage >= 80) {
      if (difficulty === 'Beginner') handleGenerateQuiz('Intermediate');
      else if (difficulty === 'Intermediate') handleGenerateQuiz('Advanced');
      else handleGenerateQuiz('Advanced');
    } else if (percentage < 50) {
      if (difficulty === 'Advanced') handleGenerateQuiz('Intermediate');
      else if (difficulty === 'Intermediate') handleGenerateQuiz('Beginner');
      else handleGenerateQuiz('Beginner');
    } else {
      handleGenerateQuiz(difficulty);
    }
  };

  const handleGenerateBoardQuestion = async () => {
    if (!selectedChapter) return;
    setIsLoading(true);
    try {
      const context = `Chapter: ${selectedChapter.title} for Class 10 ${selectedSubject} (GSEB English Medium Syllabus).`;
      const prompt = `Generate a high-weightage, long-answer question (3 or 4 marks) typical of the GSEB Class 10 Board Exams based on this context: ${context}. 
      Do not provide the answer immediately. Ask the student to attempt it first.`;
      
      const response = await generateSocraticResponse(context, prompt, messages);
      setMessages(prev => [...prev, { role: 'model', text: response || "I'm sorry, I couldn't process that." }]);
      setActiveMode('chat');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!selectedChapter && uploadedFiles.length === 0) return;
    setIsLoading(true);
    try {
      const activeFile = uploadedFiles.find(f => f.id === selectedFileId);
      const context = selectedChapter 
        ? `Chapter: ${selectedChapter.title} for Class 10 ${selectedSubject} (GSEB English Medium Syllabus).` 
        : "Class 10 Board Exam Preparation (GSEB English Medium).";
        
      const data = await generateFlashcards(
        context, 
        selectedSubject,
        activeFile ? { data: activeFile.data, mimeType: activeFile.type } : undefined
      );
      setFlashcards(data.flashcards || []);
      setActiveMode('flashcards');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const audioResult = await generateSpeech(text);
      if (audioResult && audioResult.data) {
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

  const handleMouseUp = () => {
    setTimeout(() => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      if (text && text.length > 0 && text.length < 150) {
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();
        if (rect) {
          setSelectionPos({ x: rect.left + (rect.width / 2), y: rect.top - 45 });
          setSelectedText(text);
        }
      } else {
        setSelectionPos(null);
        setSelectedText('');
      }
    }, 10);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-12rem)] relative" onMouseUp={handleMouseUp}>
      <AnimatePresence>
        {selectionPos && selectedText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-50 flex items-center gap-2 bg-slate-800 text-white px-3 py-1.5 rounded-lg shadow-xl pointer-events-auto"
            style={{ left: selectionPos.x, top: selectionPos.y, transform: 'translateX(-50%)' }}
          >
            <span className="text-xs font-medium max-w-[150px] truncate">Pronounce</span>
            <Button
              size="icon"
              variant="ghost"
              className={cn("h-6 w-6 text-white hover:text-brand-300 hover:bg-white/20", isSpeaking && "animate-pulse text-brand-300")}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSpeak(selectedText);
              }}
              disabled={isSpeaking}
            >
              <Volume2 className="w-3.5 h-3.5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-2">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-500" /> Study Kits
            </CardTitle>
            <CardDescription>Select subject & chapter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Subject</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(CHAPTERS) as Subject[]).map((sub) => (
                  <Button 
                    key={sub}
                    variant={selectedSubject === sub ? 'default' : 'outline'}
                    size="sm"
                    className="text-[10px] h-8"
                    onClick={() => {
                      setSelectedSubject(sub);
                      setSelectedChapter(null);
                    }}
                  >
                    {sub}
                  </Button>
                ))}
              </div>
            </div>

            {selectedSubject && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Chapters</label>
                <div className="space-y-1">
                  {CHAPTERS[selectedSubject].map((chap) => (
                    <Button
                      key={chap.id}
                      variant={selectedChapter?.id === chap.id ? 'secondary' : 'ghost'}
                      size="sm"
                      className="w-full justify-start text-left text-[11px] h-auto py-2 px-3"
                      onClick={() => setSelectedChapter(chap)}
                    >
                      <ChevronRight className={cn("w-3 h-3 mr-2 shrink-0", selectedChapter?.id === chap.id ? "text-brand-600" : "text-slate-300")} />
                      <span className="line-clamp-2">{chap.title}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 space-y-2">
              <Button 
                className="w-full justify-start gap-3 h-10 bg-brand-600 hover:bg-brand-700"
                onClick={() => handleGenerateQuiz()}
                disabled={isLoading || !selectedChapter}
              >
                <FileQuestion className="w-4 h-4" /> Generate Quiz
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-10"
                onClick={handleGenerateFlashcards}
                disabled={isLoading || !selectedChapter}
              >
                <BookMarked className="w-4 h-4 text-emerald-500" /> Flashcards
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-10 border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                onClick={handleGenerateBoardQuestion}
                disabled={isLoading || !selectedChapter}
              >
                <Sparkles className="w-4 h-4 text-brand-500" /> Board Question
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Upload className="w-4 h-4 text-brand-500" /> Study Materials
            </CardTitle>
            <CardDescription>Upload PDFs or Images</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,image/*"
                onChange={handleFileUpload}
              />
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 h-9 text-xs border-dashed border-brand-200 hover:bg-brand-50"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Upload className="w-3 h-3" /> Upload New File
              </Button>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Your Uploads</label>
                <div className="space-y-1">
                  {uploadedFiles.map(file => (
                    <div 
                      key={file.id} 
                      className={cn(
                        "flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer",
                        selectedFileId === file.id ? "bg-brand-50 border-brand-200" : "bg-white border-slate-100 hover:border-slate-200"
                      )}
                      onClick={() => setSelectedFileId(file.id === selectedFileId ? null : file.id)}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        {selectedFileId === file.id ? <FileCheck className="w-3 h-3 text-brand-600 shrink-0" /> : <FileText className="w-3 h-3 text-slate-400 shrink-0" />}
                        <div className="overflow-hidden">
                          <p className="text-[10px] font-bold truncate text-slate-700">{file.name}</p>
                          <p className="text-[8px] text-slate-400">{file.size}</p>
                        </div>
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6 text-slate-300 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100">
              <Sheet>
                <SheetTrigger render={<Button variant="ghost" className="w-full justify-start gap-2 h-8 text-[10px] text-slate-500" />}>
                  <BookMarked className="w-3 h-3" /> GSEB Textbook Library
                </SheetTrigger>
                <SheetContent side="right" className="w-[400px] sm:w-[540px] flex flex-col">
                  <SheetHeader>
                    <SheetTitle>Textbook Library</SheetTitle>
                    <SheetDescription>
                      Access PDF versions of all Class 10 textbooks.
                    </SheetDescription>
                  </SheetHeader>
                  <ScrollArea className="flex-1 mt-6 pr-4">
                    <div className="space-y-6 pb-8">
                      {(Object.keys(CHAPTERS) as Subject[]).map((sub) => (
                        <div key={sub} className="space-y-3">
                          <h4 className="font-bold text-slate-800 flex items-center gap-2">
                            <Badge variant="outline">{sub}</Badge>
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            <Button 
                              variant="ghost" 
                              className="justify-start h-12 border border-dashed border-slate-200 hover:bg-brand-50 hover:border-brand-200"
                              onClick={() => window.open('https://www.gseb.org/', '_blank')}
                            >
                              <FileText className="w-4 h-4 mr-3 text-red-500" />
                              <div className="text-left">
                                <p className="text-xs font-bold">GSEB {sub} Textbook</p>
                                <p className="text-[10px] text-slate-400">PDF • External Link</p>
                              </div>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-3 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
        {/* Floating AI Tutor Avatar */}
        <div className="absolute bottom-24 right-6 z-40 flex flex-col items-end gap-2 pointer-events-none">
          <AnimatePresence>
            {isSpeaking && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="bg-slate-800 text-white text-xs px-4 py-2 rounded-2xl rounded-br-none shadow-lg pointer-events-auto flex items-center gap-2"
              >
                <Volume2 className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                <span>Speaking...</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative pointer-events-auto cursor-pointer group">
            <div className={cn(
              "w-16 h-16 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 p-1 shadow-xl transition-all duration-300",
              isSpeaking ? "ring-4 ring-brand-500/40 scale-110" : "hover:scale-105 hover:shadow-2xl ring-2 ring-transparent"
            )}>
              <div className="w-full h-full bg-white rounded-full overflow-hidden p-0.5">
                <img
                  src="https://api.dicebear.com/7.x/bottts/svg?seed=Professor&backgroundColor=ffffff"
                  alt="AI Tutor"
                  className={cn(
                    "w-full h-full rounded-full object-cover",
                    isSpeaking && "animate-pulse"
                  )}
                />
              </div>
            </div>
            {isSpeaking ? (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
              </span>
            ) : (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-400 border-2 border-white"></span>
              </span>
            )}
          </div>
        </div>

        <Tabs value={activeMode} onValueChange={setActiveMode} className="flex-1 flex flex-col">
          <div className="px-8 pt-6 border-b border-slate-100">
            <TabsList className="bg-slate-100/50 p-1">
              <TabsTrigger value="chat" className="gap-2"><BrainCircuit className="w-4 h-4" /> Socratic Chat</TabsTrigger>
              <TabsTrigger value="quiz" className="gap-2"><FileQuestion className="w-4 h-4" /> Quiz</TabsTrigger>
              <TabsTrigger value="flashcards" className="gap-2"><BookMarked className="w-4 h-4" /> Flashcards</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="chat" className="flex-1 flex flex-col m-0 p-0">
            <ScrollArea className="flex-1 p-8" ref={scrollRef}>
              <div className="space-y-6 max-w-3xl mx-auto">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-4 rounded-2xl relative group ${
                      msg.role === 'user' 
                        ? 'bg-brand-600 text-white rounded-tr-none' 
                        : 'bg-slate-100 text-slate-800 rounded-tl-none'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      {msg.role === 'model' && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute -right-10 top-0 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-slate-400 hover:text-brand-600"
                          onClick={() => handleSpeak(msg.text)}
                        >
                          <Volume2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none animate-pulse">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
              <div className="max-w-3xl mx-auto flex gap-3">
                <Input 
                  placeholder={selectedChapter ? `Ask about ${selectedChapter.title}...` : "Ask a question about your syllabus..."}
                  className="h-12 bg-white border-slate-200 shadow-sm"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button 
                  className="h-12 w-12 rounded-xl bg-brand-600 hover:bg-brand-700"
                  onClick={handleSendMessage}
                  disabled={isLoading}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="quiz" className="flex-1 p-8 m-0 overflow-y-auto">
            <div className="max-w-2xl mx-auto space-y-8">
              {quiz.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-slate-800">Adaptive Quiz</h3>
                    <Badge variant="outline" className="bg-brand-50 text-brand-700 border-brand-200">
                      Level: {difficulty}
                    </Badge>
                  </div>
                  {quiz.map((q, i) => (
                    <Card key={q.id} className="border-slate-100 shadow-sm">
                      <CardHeader>
                        <Badge className="w-fit mb-2">Question {i + 1}</Badge>
                        <CardTitle className="text-lg">{q.question}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = userAnswers[q.id] === optIdx;
                          const isCorrect = q.correctAnswer === optIdx;
                          const isWrongSelected = quizSubmitted && isSelected && !isCorrect;
                          const showCorrect = quizSubmitted && isCorrect;
                          
                          return (
                            <Button 
                              key={optIdx} 
                              variant="outline" 
                              className={cn(
                                "w-full justify-start h-auto py-4 px-6 text-left whitespace-normal transition-all",
                                isSelected && !quizSubmitted && "border-brand-500 bg-brand-50 ring-1 ring-brand-500",
                                showCorrect && "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500",
                                isWrongSelected && "border-red-500 bg-red-50 ring-1 ring-red-500",
                                !quizSubmitted && "hover:bg-brand-50 hover:border-brand-200"
                              )}
                              onClick={() => handleOptionSelect(q.id, optIdx)}
                              disabled={quizSubmitted}
                            >
                              <span className={cn(
                                "w-6 h-6 rounded-full border flex items-center justify-center mr-4 text-xs font-bold shrink-0",
                                isSelected && !quizSubmitted ? "border-brand-500 text-brand-600" : "border-slate-200 text-slate-400",
                                showCorrect && "border-emerald-500 text-emerald-600",
                                isWrongSelected && "border-red-500 text-red-600"
                              )}>
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              {opt}
                            </Button>
                          );
                        })}
                        {quizSubmitted && (
                          <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-700">
                            <strong>Explanation:</strong> {q.explanation}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  
                  <div className="pt-6 pb-12">
                    {!quizSubmitted ? (
                      <Button 
                        className="w-full h-12 text-lg bg-brand-600 hover:bg-brand-700"
                        onClick={handleSubmitQuiz}
                        disabled={Object.keys(userAnswers).length !== quiz.length}
                      >
                        Submit Quiz
                      </Button>
                    ) : (
                      <Card className="bg-brand-50 border-brand-200 shadow-sm">
                        <CardContent className="p-6 text-center space-y-4">
                          <h3 className="text-2xl font-bold text-slate-800">
                            Score: {score} / {quiz.length}
                          </h3>
                          <p className="text-slate-600">
                            {score / quiz.length >= 0.8 ? "Great job! You're ready for a harder challenge." : 
                             score / quiz.length < 0.5 ? "Let's review the basics and try an easier level." : 
                             "Good effort! Let's keep practicing at this level."}
                          </p>
                          <Button 
                            className="w-full h-12 text-lg bg-brand-600 hover:bg-brand-700 mt-4"
                            onClick={handleAdaptiveNextStep}
                            disabled={isLoading}
                          >
                            {isLoading ? "Generating..." : "Adaptive Next Step"}
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-20 text-slate-400">
                  <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Select a chapter and generate a quiz to test your knowledge!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="flashcards" className="flex-1 p-8 m-0 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {flashcards.length > 0 ? (
                flashcards.map((card) => (
                  <FlashcardItem key={card.id} card={card} />
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-slate-400">
                  <BookMarked className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Select a chapter and generate flashcards for active recall!</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function FlashcardItem({ card }: { card: Flashcard; key?: string }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="h-64 cursor-pointer [perspective:1000px]"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full transition-all duration-500 [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front */}
        <div className="absolute inset-0 [backface-visibility:hidden] bg-white border-2 border-slate-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
          <Badge variant="secondary" className="mb-4">Question</Badge>
          <p className="text-lg font-bold text-slate-800">{card.question}</p>
          <p className="text-xs text-slate-400 mt-6">Click to flip</p>
        </div>
        
        {/* Back */}
        <div className="absolute inset-0 [backface-visibility:hidden] bg-brand-600 text-white rounded-2xl p-8 flex flex-col items-center justify-center text-center [transform:rotateY(180deg)] shadow-lg">
          <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-none">Answer</Badge>
          <p className="text-lg font-medium">{card.answer}</p>
        </div>
      </motion.div>
    </div>
  );
}

