import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { generateStudySchedule } from '@/services/gemini';
import { Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function StudySchedule() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 13)); // Starting at April 13, 2026
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSchedule, setAiSchedule] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleGenerateAISchedule = async () => {
    setIsGenerating(true);
    setAiSchedule('');
    try {
      const schedule = await generateStudySchedule(['Math', 'Science', 'Social Science'], 45);
      setAiSchedule(schedule);
    } catch (e) {
      console.error(e);
      setAiSchedule("Failed to generate schedule. Check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const weekDates = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    startOfWeek.setDate(diff);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  }, [currentDate]);

  const weekRangeLabel = useMemo(() => {
    const start = weekDates[0];
    const end = weekDates[6];
    const startMonth = start.toLocaleString('default', { month: 'long' });
    const endMonth = end.toLocaleString('default', { month: 'long' });
    
    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
    }
    return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${start.getFullYear()}`;
  }, [weekDates]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const mockSessions = [
    { subject: 'Science', topic: 'Light Reflection', completed: true },
    { subject: 'Mathematics', topic: 'Quadratic Eq.', completed: true },
    { subject: 'Social Science', topic: 'Nationalism', completed: false },
    { subject: 'Science', topic: 'Human Eye', completed: false },
    { subject: 'Mathematics', topic: 'Trigonometry', completed: false },
    { subject: 'English', topic: 'Letter Writing', completed: false },
    { subject: 'Revision', topic: 'Full Mock Test', completed: false },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Study Schedule</h2>
          <p className="text-slate-500 mt-1">Strategic board prep plan for the next 45 days.</p>
        </div>
        <div className="flex gap-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger render={<Button onClick={handleGenerateAISchedule} className="gap-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500"><Sparkles className="w-4 h-4" /> AI Gen</Button>} />
            <DialogContent className="max-w-2xl text-left max-h-[85vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>AI-Optimized GSEB Study Plan</DialogTitle>
                <DialogDescription>Generated based on official GSEB blueprints and your current progress.</DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto mt-4 px-2">
                {isGenerating ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-4 text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
                    <p>Generating personalized schedule...</p>
                  </div>
                ) : (
                  <div className="prose prose-sm prose-slate max-w-none">
                    <ReactMarkdown>{aiSchedule}</ReactMarkdown>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => navigateWeek('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-semibold px-4 min-w-[140px] text-center">{weekRangeLabel}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => navigateWeek('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDates.map((date, i) => {
          const session = mockSessions[i];
          const isToday = new Date().toDateString() === date.toDateString();
          
          return (
            <Card key={i} className={cn(
              "border-none shadow-sm transition-all",
              session.completed ? 'bg-slate-50' : 'bg-white',
              isToday && "ring-2 ring-brand-500"
            )}>
              <CardHeader className="p-4 text-center border-b border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {date.toLocaleString('default', { weekday: 'short' })}
                </p>
                <p className="text-lg font-bold text-slate-800">
                  {date.getDate()} {date.toLocaleString('default', { month: 'short' })}
                </p>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <Badge className={cn(
                    "w-full justify-center",
                    session.subject === 'Science' ? 'bg-blue-100 text-blue-700' :
                    session.subject === 'Mathematics' ? 'bg-emerald-100 text-emerald-700' :
                    session.subject === 'Social Science' ? 'bg-amber-100 text-amber-700' :
                    'bg-indigo-100 text-indigo-700'
                  )}>
                    {session.subject}
                  </Badge>
                  <p className="text-xs font-medium text-slate-600 text-center line-clamp-1">{session.topic}</p>
                </div>
                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold">
                  <Clock className="w-3 h-3" /> 2 Hours
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Today's Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { task: 'Read NCERT Chapter 10: Light', time: '45 min' },
              { task: 'Solve 5 Numerical problems on Mirror Formula', time: '30 min' },
              { task: 'Generate AI Quiz for Light Reflection', time: '15 min' },
              { task: 'Review yesterday\'s Quadratic Equation notes', time: '30 min' },
            ].map((task, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <Checkbox id={`task-${i}`} />
                  <label htmlFor={`task-${i}`} className="text-sm font-medium text-slate-700 cursor-pointer">{task.task}</label>
                </div>
                <Badge variant="secondary" className="text-[10px]">{task.time}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-indigo-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">Exam Countdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white/10 rounded-2xl">
                <p className="text-3xl font-bold">45</p>
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-70">Days</p>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-2xl">
                <p className="text-3xl font-bold">12</p>
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-70">Hours</p>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-sm">Upcoming Deadlines</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Science Practical</span>
                  <span className="font-bold">Apr 25</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Math Pre-Board</span>
                  <span className="font-bold">May 02</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



