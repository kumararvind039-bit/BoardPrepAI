import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Key, Save, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('GEMINI_API_KEY');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('Please enter a valid API key');
      return;
    }
    localStorage.setItem('GEMINI_API_KEY', apiKey.trim());
    setIsSaved(true);
    setError('');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleClear = () => {
    localStorage.removeItem('GEMINI_API_KEY');
    setApiKey('');
    setIsSaved(false);
    setError('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-500 mt-1">Configure your application preferences</p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-brand-600" />
              Gemini API Configuration
            </CardTitle>
            <CardDescription>
              Enter your personal Gemini API key to use the AI features. Your key is stored locally in your browser and never sent to our servers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Gemini API Key</label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Paste your API key here..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="font-mono"
                />
                <Button onClick={handleSave} className="bg-brand-600 hover:bg-brand-700 gap-2">
                  <Save className="w-4 h-4" /> Save
                </Button>
              </div>
              {error && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" /> {error}
                </p>
              )}
              {isSaved && (
                <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3 h-3" /> API Key saved successfully!
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Clear Stored Key</h4>
                  <p className="text-xs text-slate-500">Remove your API key from this browser's local storage.</p>
                </div>
                <Button variant="ghost" onClick={handleClear} className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2">
                  <Trash2 className="w-4 h-4" /> Clear Key
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h4 className="text-sm font-bold text-blue-800 flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4" /> How to get an API Key?
              </h4>
              <p className="text-xs text-blue-700 leading-relaxed">
                You can get a free Gemini API key from the <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="font-bold underline">Google AI Studio</a>. Once you have the key, paste it above and save to enable AI-powered study assistance, quizzes, and flashcards.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
