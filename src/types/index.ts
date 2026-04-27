export type Subject = 'Science' | 'Mathematics' | 'Social Science' | 'English' | 'Hindi' | 'Gujarati' | 'Sanskrit';

export interface Chapter {
  id: string;
  title: string;
  subject: Subject;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subject: Subject;
  createdAt: number;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  subject: Subject;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface StudySession {
  id: string;
  date: string;
  subject: Subject;
  topic: string;
  duration: number; // in minutes
  completed: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
