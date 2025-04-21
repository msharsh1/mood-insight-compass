
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockMoods, mockAssessmentResults } from '../data/mockData';
import { Mood, AssessmentResult } from '../types';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

type MentalHealthContextType = {
  moods: Mood[];
  assessmentResults: AssessmentResult[];
  addMood: (mood: Omit<Mood, 'id'>) => void;
  addAssessmentResult: (result: Omit<AssessmentResult, 'id'>) => void;
  getMoodsByDateRange: (startDate: string, endDate: string) => Mood[];
  getLatestAssessmentResult: () => AssessmentResult | undefined;
};

const MentalHealthContext = createContext<MentalHealthContextType | undefined>(undefined);

export const MentalHealthProvider = ({ children }: { children: ReactNode }) => {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);

  useEffect(() => {
    // Load initial data
    setMoods(mockMoods);
    setAssessmentResults(mockAssessmentResults);
  }, []);

  const addMood = (newMood: Omit<Mood, 'id'>) => {
    const moodWithId = { ...newMood, id: uuidv4() };
    setMoods([...moods, moodWithId]);
    toast({
      title: "Mood logged",
      description: "Your mood has been saved successfully",
    });
  };

  const addAssessmentResult = (result: Omit<AssessmentResult, 'id'>) => {
    setAssessmentResults([...assessmentResults, result]);
    toast({
      title: "Assessment completed",
      description: "Your mental health assessment has been saved",
    });
  };

  const getMoodsByDateRange = (startDate: string, endDate: string) => {
    return moods.filter(
      (mood) => mood.date >= startDate && mood.date <= endDate
    );
  };

  const getLatestAssessmentResult = () => {
    if (assessmentResults.length === 0) return undefined;
    
    // Sort by date (newest first) and return the first item
    const sortedResults = [...assessmentResults].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return sortedResults[0];
  };

  const value = {
    moods,
    assessmentResults,
    addMood,
    addAssessmentResult,
    getMoodsByDateRange,
    getLatestAssessmentResult,
  };

  return (
    <MentalHealthContext.Provider value={value}>
      {children}
    </MentalHealthContext.Provider>
  );
};

export const useMentalHealth = () => {
  const context = useContext(MentalHealthContext);
  if (context === undefined) {
    throw new Error('useMentalHealth must be used within a MentalHealthProvider');
  }
  return context;
};
