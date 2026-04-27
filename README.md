# BoardPrep AI - GSEB Study Companion

BoardPrep AI is an advanced, AI-powered study companion specifically designed for **GSEB (Gujarat Secondary and Higher Secondary Education Board) Class 10 (English Medium)** students. 

The application helps students prepare for their board exams by providing an AI tutor, an intelligent study scheduler, a dedicated study notebook system, and easy access to an extensive Board Library (Textbooks, PYQs, Model Papers, and Guidelines).

## Features

- 🧠 **AI Assistant**: A Socratic tutor powered by Google Gemini that answers doubts, explains concepts according to the GSEB syllabus, generates flashcards, quizzes, and helps formulate answer-writing strategies. Supports multi-language output (English, Gujarati, Hindi) based on user prompt.
- 📅 **Study Schedule**: Automatically generatable 45-day AI study plans tailored to specific subjects using GSEB blueprints and guidelines.
- 📓 **My Notebooks**: A place to organize notes, formulas, and important topics by subject.
- 📚 **Board Library**: Easy access to officially recommended text books, previous year question papers (PYQs), mock test model papers, and GSEB exam weightage guidelines.
- 📱 **Cross-Platform**: Designed for the Web and Android (powered by Capacitor).

## Tech Stack

- **Framework:** React 18, Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **AI Integration:** Google GenAI SDK (Gemini API)
- **Mobile Runtime:** Capacitor (Android)
- **Icons:** Lucide React

## Prerequisites

Before you begin, ensure you have met the following requirements:
* You have installed Node.js (v18+)
* You have a [Google Gemini API Key](https://aistudio.google.com/app/apikey)

## Setup and Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/gseb-boardprep-ai.git
   cd gseb-boardprep-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```
   *Note: In production, since this uses a client-side architecture, avoid hardcoding keys or deploy behind a backend proxy if needed. But for development, follow the above.*

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Build for Production:**
   ```bash
   npm run build
   ```

## Mobile (Android) Setup

This project uses Capacitor to generate an Android app. 

1. Build the web project:
   ```bash
   npm run build
   ```

2. Sync the project with Capacitor tools:
   ```bash
   npx cap sync
   ```

3. Open in Android Studio (if installed):
   ```bash
   npx cap open android
   ```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
