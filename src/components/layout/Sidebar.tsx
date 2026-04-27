import React from 'react';
import { BookOpen, Calendar, LayoutDashboard, Settings, BrainCircuit, Library } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'notebook', label: 'My Notebooks', icon: BookOpen },
    { id: 'assistant', label: 'AI Assistant', icon: BrainCircuit },
    { id: 'schedule', label: 'Study Schedule', icon: Calendar },
    { id: 'library', label: 'Board Library', icon: Library },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="hidden lg:flex w-64 h-screen bg-white border-r border-slate-200 flex-col fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3">
        <Logo className="text-brand-600 w-10 h-10" />
        <div>
          <h1 className="font-bold text-xl tracking-tight text-slate-800 leading-none">BoardPrep AI</h1>
          <p className="text-[10px] font-bold text-brand-600 mt-1 uppercase tracking-wider">GSEB English Medium</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? 'secondary' : 'ghost'}
            className={cn(
              "w-full justify-start gap-3 h-11 transition-all",
              activeTab === item.id ? "bg-brand-50 text-brand-700 font-semibold" : "text-slate-600"
            )}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-brand-600" : "text-slate-400")} />
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <Button variant="ghost" className="w-full justify-start gap-3 text-slate-500">
          <Settings className="w-5 h-5" />
          Settings
        </Button>
      </div>
    </div>
  );
}
