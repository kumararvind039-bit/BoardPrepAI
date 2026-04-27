/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { Notebook } from '@/components/study/Notebook';
import { AIAssistant } from '@/components/study/AIAssistant';
import { StudySchedule } from '@/components/schedule/StudySchedule';
import { Settings } from '@/components/settings/Settings';
import { BoardLibrary } from '@/components/library/BoardLibrary';
import { motion, AnimatePresence } from 'motion/react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/ui/Logo';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'notebook':
        return <Notebook />;
      case 'assistant':
        return <AIAssistant />;
      case 'schedule':
        return <StudySchedule />;
      case 'library':
        return <BoardLibrary />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Logo className="text-brand-600 w-8 h-8" />
          <div>
            <h1 className="font-bold text-lg tracking-tight text-slate-800 leading-none">BoardPrep AI</h1>
          </div>
        </div>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger render={
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6 text-slate-600" />
            </Button>
          } />
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar activeTab={activeTab} setActiveTab={(tab) => {
              setActiveTab(tab);
              setTimeout(() => setIsMobileMenuOpen(false), 200);
            }} />
            {/* Override Sidebar fixed positioning inside Sheet */}
            <style dangerouslySetInnerHTML={{ __html: `
              [data-slot="sheet-content"] .lg\\:flex { display: flex !important; position: relative !important; width: 100% !important; height: 100% !important; }
            `}} />
          </SheetContent>
        </Sheet>
      </header>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 lg:ml-64 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

