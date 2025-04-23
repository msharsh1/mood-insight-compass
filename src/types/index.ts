
export interface Mood {
  id: string;
  date: string;
  mood: 'very-sad' | 'sad' | 'neutral' | 'happy' | 'very-happy';
  notes?: string;
  factors?: {
    sleep?: number;
    stress?: number;
    exercise?: number;
    social?: number;
    nutrition?: number;
  };
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: {
    value: number;
    label: string;
  }[];
  factor: 'depression' | 'anxiety' | 'both';
}

export interface AssessmentResult {
  date: string;
  depression: {
    score: number;
    risk: 'low' | 'moderate' | 'high';
    probability: number;
  };
  anxiety: {
    score: number;
    risk: 'low' | 'moderate' | 'high';
    probability: number;
  };
}

export type User = {
  id: string;
  name: string;
  email: string;
};
