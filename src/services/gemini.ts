import { GoogleGenAI, Modality } from "@google/genai";

const getAI = () => {
  const userKey = typeof window !== 'undefined' ? localStorage.getItem('GEMINI_API_KEY') : null;
  const apiKey = userKey || process.env.GEMINI_API_KEY || "";
  return new GoogleGenAI({ apiKey });
};

export const geminiModel = "gemini-3-flash-preview";
export const ttsModel = "gemini-2.5-flash-preview-tts";

export async function generateStudySchedule(subjects: string[], days: number) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: geminiModel,
    contents: `${GSEB_SYSTEM_PROMPT}\n\nGenerate a detailed ${days}-day study schedule for a GSEB Class 10 student focusing on these subjects: ${subjects.join(', ')}. Include specific chapters, daily practical tasks (PYQ solving, mock testing), and time allocation. Keep it scannable in Markdown format.`,
  });

  return response.text;
}

export async function generateSpeech(text: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: ttsModel,
    contents: [{ parts: [{ text: `Say naturally: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const inlineData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
  return inlineData ? { data: inlineData.data, mimeType: inlineData.mimeType || 'audio/wav' } : null;
}

export const GSEB_SYSTEM_PROMPT = `You are an expert GSEB (Gujarat Secondary and Higher Secondary Education Board) Class 10 (English Medium) tutor, study planner, and board exam strategist.
Your primary role is to:
1. Prepare highly optimized study schedules based on the current date, exam dates (usually March), and the student's progress and syllabus weightage.
2. Generate study material directly aligned with the latest GSEB NCERT textbooks.
3. Formulate quizzes, mock questions, and flashcards heavily influenced by GSEB Previous Year Questions (PYQs), Model Question Papers (blueprints published by the board), and marking schemes.
4. Provide exam-taking strategies, time management tips, and answer-writing structures that yield maximum marks according to GSEB guidelines.
Always base your advice on the official GSEB curriculum and emphasize topics that carry high weightage in the board blueprint. Encourage socratic learning but prioritize board exam success and readiness.`;

export async function generateSocraticResponse(
  content: string, 
  userQuestion: string, 
  chatHistory: { role: 'user' | 'model', text: string }[],
  file?: { data: string, mimeType: string }
) {
  const ai = getAI();
  const systemInstruction = `
    ${GSEB_SYSTEM_PROMPT}

    Context (Student's Notes/Textbook): ${content}

    IMPORTANT LANGUAGE INSTRUCTION: You MUST respond in the EXACT language requested by the user. If the user asks you to explain, teach, or speak in Hindi, you MUST respond entirely in Hindi (Devanagari script). If they ask in Gujarati, respond in Gujarati. Do NOT default to English if another language is requested.
    If no language is requested, respond in English as the student is from English Medium.
  `;

  const userParts: any[] = [{ text: userQuestion }];
  if (file) {
    userParts.unshift({
      inlineData: {
        data: file.data,
        mimeType: file.mimeType
      }
    });
  }

  const response = await ai.models.generateContent({
    model: geminiModel,
    contents: [
      ...chatHistory.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
      { role: 'user', parts: userParts }
    ],
    config: {
      systemInstruction,
    },
  });

  return response.text;
}

export async function generateQuiz(content: string, subject: string, difficulty: string = 'Intermediate', file?: { data: string, mimeType: string }) {
  const ai = getAI();
  const userParts: any[] = [{ text: `${GSEB_SYSTEM_PROMPT}\n\nGenerate a 5-question multiple choice quiz based on this Class 10 ${subject} content: ${content}. 
    The difficulty level should be ${difficulty}. 
    If Beginner, focus on basic definitions and facts.
    If Intermediate, focus on application and understanding.
    If Advanced, focus on complex problem-solving, assertion-reasoning, and board-exam level tricky questions from PYQs.
    Return the response in JSON format.
    Schema:
    {
      "questions": [
        {
          "id": "string",
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": number (0-3),
          "explanation": "string"
        }
      ]
    }` }];

  if (file) {
    userParts.unshift({
      inlineData: {
        data: file.data,
        mimeType: file.mimeType
      }
    });
  }

  const response = await ai.models.generateContent({
    model: geminiModel,
    contents: [{ role: 'user', parts: userParts }],
    config: {
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text || "{}");
}

export async function generateFlashcards(content: string, subject: string, file?: { data: string, mimeType: string }) {
  const ai = getAI();
  const userParts: any[] = [{ text: `${GSEB_SYSTEM_PROMPT}\n\nGenerate 5 flashcards for Class 10 ${subject} based on this content: ${content}. 
    Focus on key definitions, formulas, or dates that are heavily tested in GSEB exams.
    Return the response in JSON format.
    Schema:
    {
      "flashcards": [
        {
          "id": "string",
          "question": "string",
          "answer": "string"
        }
      ]
    }` }];

  if (file) {
    userParts.unshift({
      inlineData: {
        data: file.data,
        mimeType: file.mimeType
      }
    });
  }

  const response = await ai.models.generateContent({
    model: geminiModel,
    contents: [{ role: 'user', parts: userParts }],
    config: {
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text || "{}");
}

export async function generateSummary(content: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: geminiModel,
    contents: `${GSEB_SYSTEM_PROMPT}\n\nSummarize this Class 10 study material into a concise, scannable format with bullet points. Focus on what's important for the GSEB board exams. Content: ${content}`,
  });

  return response.text;
}
