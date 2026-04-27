import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, FlaskConical, Calculator, Globe2, ArrowRight, Sparkles, Upload } from 'lucide-react';
import { Subject } from '@/types';
import { motion } from 'motion/react';

const subjects: { name: Subject; icon: any; color: string; progress: number; topics: string[] }[] = [
  { 
    name: 'Science', 
    icon: FlaskConical, 
    color: 'bg-blue-500', 
    progress: 45,
    topics: ['Light Reflection', 'Chemical Reactions', 'Life Processes']
  },
  { 
    name: 'Mathematics', 
    icon: Calculator, 
    color: 'bg-emerald-500', 
    progress: 30,
    topics: ['Quadratic Equations', 'Trigonometry', 'Arithmetic Progression']
  },
  { 
    name: 'Social Science', 
    icon: Globe2, 
    color: 'bg-amber-500', 
    progress: 60,
    topics: ['Heritage of India', 'Natural Resources', 'Economic Development']
  },
  { 
    name: 'English', 
    icon: BookOpen, 
    color: 'bg-indigo-500', 
    progress: 75,
    topics: ['Where the Mind is Without Fear', 'A Letter to God', 'Nelson Mandela']
  },
];

export function Dashboard({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Welcome back, Student!</h2>
          <p className="text-slate-500 mt-1">You have 45 days left until your first Board Exam.</p>
        </div>
        <Button variant="outline" className="hidden md:flex gap-2 bg-white" onClick={() => setActiveTab('assistant')}>
          <Upload className="w-4 h-4" /> Upload Blueprint / Paper
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subjects.map((subject, idx) => (
          <motion.div
            key={subject.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="study-card overflow-hidden border-none shadow-sm bg-white">
              <CardHeader className="pb-2">
                <div className={`${subject.color} w-10 h-10 rounded-lg flex items-center justify-center mb-4`}>
                  <subject.icon className="text-white w-6 h-6" />
                </div>
                <CardTitle className="text-lg">{subject.name}</CardTitle>
                <CardDescription>Syllabus Mastery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">{subject.progress}%</span>
                      <span className="text-slate-400">Target: 100%</span>
                    </div>
                    <Progress value={subject.progress} className="h-2" />
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {subject.topics.slice(0, 2).map(topic => (
                      <Badge key={topic} variant="secondary" className="bg-slate-100 text-slate-600 font-normal">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* High Weightage Topics Section */}
      <Card className="border-none shadow-sm bg-white border border-brand-100">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2 text-brand-700">
                <Sparkles className="w-5 h-5" /> High Weightage Topics (GSEB Blueprint)
              </CardTitle>
              <CardDescription>Focus on these topics to maximize your score</CardDescription>
            </div>
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">Score Booster</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-blue-500" /> Science (16 Marks)
              </h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex justify-between items-center bg-slate-50 p-2 rounded-md">
                  <span>Light Reflection & Refraction</span>
                  <Badge variant="outline" className="text-xs">6 Marks</Badge>
                </li>
                <li className="flex justify-between items-center bg-slate-50 p-2 rounded-md">
                  <span>Life Processes</span>
                  <Badge variant="outline" className="text-xs">6 Marks</Badge>
                </li>
                <li className="flex justify-between items-center bg-slate-50 p-2 rounded-md">
                  <span>Metals and Non-Metals</span>
                  <Badge variant="outline" className="text-xs">4 Marks</Badge>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-500" /> Mathematics (18 Marks)
              </h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex justify-between items-center bg-slate-50 p-2 rounded-md">
                  <span>Trigonometry</span>
                  <Badge variant="outline" className="text-xs">8 Marks</Badge>
                </li>
                <li className="flex justify-between items-center bg-slate-50 p-2 rounded-md">
                  <span>Triangles</span>
                  <Badge variant="outline" className="text-xs">6 Marks</Badge>
                </li>
                <li className="flex justify-between items-center bg-slate-50 p-2 rounded-md">
                  <span>Statistics</span>
                  <Badge variant="outline" className="text-xs">4 Marks</Badge>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-amber-500" /> Social Science (15 Marks)
              </h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex justify-between items-center bg-slate-50 p-2 rounded-md">
                  <span>Heritage of India</span>
                  <Badge variant="outline" className="text-xs">5 Marks</Badge>
                </li>
                <li className="flex justify-between items-center bg-slate-50 p-2 rounded-md">
                  <span>Manufacturing Industries</span>
                  <Badge variant="outline" className="text-xs">5 Marks</Badge>
                </li>
                <li className="flex justify-between items-center bg-slate-50 p-2 rounded-md">
                  <span>Economic Development</span>
                  <Badge variant="outline" className="text-xs">5 Marks</Badge>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest study sessions and AI interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { title: 'Quiz: Light Reflection', type: 'Quiz', score: '4/5', date: '2 hours ago' },
                { title: 'Notes: Indian National Movement', type: 'Notebook', date: 'Yesterday' },
                { title: 'Socratic Session: Quadratic Equations', type: 'AI Assistant', date: 'Yesterday' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-brand-500" />
                    <div>
                      <h4 className="font-semibold text-slate-800">{activity.title}</h4>
                      <p className="text-xs text-slate-500">{activity.type} • {activity.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-brand-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    View <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="border-none shadow-sm bg-brand-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 rounded-full -mr-16 -mt-16 blur-3xl" />
            <CardHeader>
              <CardTitle className="text-white">Daily Goal</CardTitle>
              <CardDescription className="text-brand-200">Keep the streak alive!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-4">
                <span className="text-5xl font-bold">12</span>
                <p className="text-brand-300 text-sm mt-1">Day Streak</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-brand-400 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-brand-400" />
                  </div>
                  <span className="text-sm">Complete 1 Science Quiz</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-brand-400" />
                  <span className="text-sm">Review 10 Math Formulas</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white border border-brand-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-brand-700">
                <Upload className="w-5 h-5" /> Upload Study Material
              </CardTitle>
              <CardDescription>Upload your own PDFs or Images of Board Papers, Textbooks, or Notes to get AI solutions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-between h-10 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200" onClick={() => setActiveTab('assistant')}>
                  <span className="font-medium">Go to AI Assistant to Upload</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
