import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookText, FileText, Download, FileArchive, Bookmark, Search, Link2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

const TEXTBOOKS = [
  { id: 1, title: 'Mathematics (Part 1 & 2)', subject: 'Math', size: '15 MB', year: '2025-26' },
  { id: 2, title: 'Science', subject: 'Science', size: '18 MB', year: '2025-26' },
  { id: 3, title: 'Social Science', subject: 'Social Science', size: '20 MB', year: '2025-26' },
  { id: 4, title: 'First Language (Gujarati)', subject: 'Gujarati', size: '12 MB', year: '2025-26' },
  { id: 5, title: 'Second Language (English)', subject: 'English', size: '10 MB', year: '2025-26' },
];

const PYQS = [
  { id: 1, title: 'March 2024 - Math & Science', year: '2024', type: 'Question + Solution' },
  { id: 2, title: 'March 2023 - All Subjects', year: '2023', type: 'Question Papers' },
  { id: 3, title: 'July 2023 (Supplementary) - Math, Science', year: '2023', type: 'Question Papers' },
  { id: 4, title: 'March 2022 - All Subjects', year: '2022', type: 'Question Papers' },
  { id: 5, title: 'March 2020 - All Subjects', year: '2020', type: 'Question + Solution' },
];

const MODEL_PAPERS = [
  { id: 1, title: 'GSEB Model Paper Set 1 - Math (Standard)', subject: 'Math', level: 'Standard' },
  { id: 2, title: 'GSEB Model Paper Set 1 - Math (Basic)', subject: 'Math', level: 'Basic' },
  { id: 3, title: 'GSEB Model Paper Set 1 - Science', subject: 'Science', level: 'Standard' },
  { id: 4, title: 'GSEB Model Paper Set 2 - Social Science', subject: 'Social Science', level: 'Standard' },
];

const GUIDELINES = [
  { id: 1, title: 'Math Blueprint & Chapter Weightage', subject: 'Math', format: 'PDF' },
  { id: 2, title: 'Science Blueprint & Chapter Weightage', subject: 'Science', format: 'PDF' },
  { id: 3, title: 'Social Science Blueprint & Chapter Weightage', subject: 'Social Science', format: 'PDF' },
  { id: 4, title: 'Languages Marks Distribution & Paper Style', subject: 'Languages', format: 'PDF' },
];

export function BoardLibrary() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Board Library</h2>
          <p className="text-slate-500">Official GSEB textbooks, previous year papers, and blueprints.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search resources..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="textbooks" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px] mb-6">
          <TabsTrigger value="textbooks">Textbooks</TabsTrigger>
          <TabsTrigger value="pyq">PYQs</TabsTrigger>
          <TabsTrigger value="model">Model Papers</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
        </TabsList>

        <TabsContent value="textbooks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEXTBOOKS.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())).map((book) => (
              <Card key={book.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <BookText className="w-8 h-8 text-brand-600 p-1.5 bg-brand-50 rounded-lg" />
                    <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{book.year}</span>
                  </div>
                  <CardTitle className="text-base mt-4">{book.title}</CardTitle>
                  <CardDescription>{book.subject} • {book.size}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full gap-2">
                    <Download className="w-4 h-4" /> Download PDF
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pyq" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PYQS.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).map((pyq) => (
              <Card key={pyq.id} className="hover:shadow-md transition-shadow border-orange-100">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <FileArchive className="w-8 h-8 text-orange-600 p-1.5 bg-orange-50 rounded-lg" />
                    <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">{pyq.type}</span>
                  </div>
                  <CardTitle className="text-base mt-4">{pyq.title}</CardTitle>
                  <CardDescription>GSEB Class 10 • {pyq.year}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full gap-2 hover:text-orange-600 hover:border-orange-200">
                    <Download className="w-4 h-4" /> Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="model" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODEL_PAPERS.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase())).map((model) => (
              <Card key={model.id} className="hover:shadow-md transition-shadow border-blue-100">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <FileText className="w-8 h-8 text-blue-600 p-1.5 bg-blue-50 rounded-lg" />
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{model.level}</span>
                  </div>
                  <CardTitle className="text-base mt-4">{model.title}</CardTitle>
                  <CardDescription>{model.subject} • Official Mock Paper</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full gap-2 hover:text-blue-600 hover:border-blue-200">
                    <Download className="w-4 h-4" /> Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="guidelines" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {GUIDELINES.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase())).map((guide) => (
              <Card key={guide.id} className="hover:shadow-md transition-shadow border-emerald-100">
                <CardHeader className="pb-3">
                  <div className="flex gap-4 items-center">
                    <Bookmark className="w-10 h-10 text-emerald-600 p-2 bg-emerald-50 rounded-lg flex-shrink-0" />
                    <div>
                      <CardTitle className="text-base">{guide.title}</CardTitle>
                      <CardDescription className="mt-1">Official board syllabus and marking scheme for {guide.subject}.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="secondary" className="w-full gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                    <Link2 className="w-4 h-4" /> View Blueprint
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
