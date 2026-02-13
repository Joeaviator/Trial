
export interface MoodLog {
  id: string;
  mood: string;
  timestamp: number;
}

export interface Subtopic {
  title: string;
  description: string;
}

export interface TopicStructure {
  topic: string;
  summary: string;
  subtopics: Subtopic[];
  fullReport?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizResult {
  topic: string;
  score: number;
  total: number;
  timestamp: number;
}

export interface EcoShift {
  id: string;
  activity: string;
  shift: string;
  personalWin: string;
  ecoWin: string;
  timestamp: number;
}

export interface SubStep {
  id: string;
  label: string;
  description: string;
}

export interface ActivityStep {
  stepNumber: number;
  instruction: string;
  detail: string;
  imagePrompt: string;
  visual?: string;
  subSteps: SubStep[];
}

export interface ActivityGuide {
  overview: string;
  steps: ActivityStep[];
}

export interface UserState {
  impactScore: number;
  moodHistory: MoodLog[];
  exploredTopics: TopicStructure[];
  quizHistory: QuizResult[];
  ecoHistory: EcoShift[];
  lastActionTimestamp: number;
  dailyActionCount: number;
}
