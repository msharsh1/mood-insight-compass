
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockMoods, mockAssessmentResults } from '../data/mockData';
import { Mood, AssessmentResult } from '../types';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

type MentalHealthContextType = {
  moods: Mood[];
  assessmentResults: AssessmentResult[];
  addMood: (mood: Omit<Mood, 'id'>) => Promise<void>;
  addAssessmentResult: (result: Omit<AssessmentResult, 'id'>) => Promise<void>;
  getMoodsByDateRange: (startDate: string, endDate: string) => Promise<Mood[]>;
  getLatestAssessmentResult: () => Promise<AssessmentResult | undefined>;
  loading: boolean;
};

const MentalHealthContext = createContext<MentalHealthContextType | undefined>(undefined);

export const MentalHealthProvider = ({ children }: { children: ReactNode }) => {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data when authentication state changes
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await Promise.all([
          fetchUserMoods(),
          fetchUserAssessments()
        ]);
      } else {
        // Use mock data when not authenticated
        setMoods(mockMoods);
        setAssessmentResults(mockAssessmentResults);
      }
      
      setLoading(false);
    };

    fetchUserData();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        await Promise.all([
          fetchUserMoods(),
          fetchUserAssessments()
        ]);
      } else if (event === 'SIGNED_OUT') {
        // Reset to mock data when signed out
        setMoods(mockMoods);
        setAssessmentResults(mockAssessmentResults);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user's mood entries from database
  const fetchUserMoods = async () => {
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching moods:', error);
      toast({ 
        title: "Failed to load mood data",
        description: error.message,
        variant: "destructive" 
      });
      return;
    }

    if (data) {
      // Convert Supabase data to app's Mood format
      const formattedMoods: Mood[] = data.map(entry => ({
        id: entry.id,
        date: entry.date,
        mood: mapMoodRatingToType(entry.mood_rating),
        notes: entry.notes || undefined,
        factors: entry.mood_factors ? mapMoodFactorsToObject(entry.mood_factors) : undefined
      }));
      
      setMoods(formattedMoods);
    }
  };

  // Helper to convert numeric mood rating to the app's mood type
  const mapMoodRatingToType = (rating: number): Mood['mood'] => {
    if (rating <= 1) return 'very-sad';
    if (rating <= 2) return 'sad';
    if (rating <= 3) return 'neutral';
    if (rating <= 4) return 'happy';
    return 'very-happy';
  };

  // Helper to convert numeric mood type to rating
  const mapMoodTypeToRating = (moodType: Mood['mood']): number => {
    switch (moodType) {
      case 'very-sad': return 1;
      case 'sad': return 2;
      case 'neutral': return 3;
      case 'happy': return 4;
      case 'very-happy': return 5;
    }
  };

  // Helper to map string array to factors object
  const mapMoodFactorsToObject = (factors: string[]): Mood['factors'] => {
    const result: Partial<NonNullable<Mood['factors']>> = {};
    
    factors.forEach(factor => {
      const [key, value] = factor.split(':');
      if (key && value && ['sleep', 'stress', 'exercise', 'social', 'nutrition'].includes(key)) {
        result[key as keyof NonNullable<Mood['factors']>] = parseInt(value);
      }
    });
    
    return Object.keys(result).length ? result : undefined;
  };

  // Helper to map factors object to string array
  const mapFactorsToStringArray = (factors?: Mood['factors']): string[] => {
    if (!factors) return [];
    
    return Object.entries(factors).map(([key, value]) => `${key}:${value}`);
  };

  // Fetch user's assessment results from database
  const fetchUserAssessments = async () => {
    const { data, error } = await supabase
      .from('assessment_results')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching assessments:', error);
      toast({ 
        title: "Failed to load assessment data",
        description: error.message,
        variant: "destructive" 
      });
      return;
    }

    if (data) {
      // Convert Supabase data to app's AssessmentResult format
      const formattedResults: AssessmentResult[] = data.map(result => ({
        date: result.date,
        depression: {
          score: result.depression_score,
          risk: result.depression_risk as 'low' | 'moderate' | 'high',
          probability: result.depression_probability
        },
        anxiety: {
          score: result.anxiety_score,
          risk: result.anxiety_risk as 'low' | 'moderate' | 'high',
          probability: result.anxiety_probability
        }
      }));
      
      setAssessmentResults(formattedResults);
    }
  };

  const addMood = async (newMood: Omit<Mood, 'id'>) => {
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        // If not authenticated, just add to local state
        const moodWithId = { ...newMood, id: uuidv4() };
        setMoods([moodWithId, ...moods]);
        toast({
          title: "Mood logged (offline mode)",
          description: "Sign in to save your data to your account",
        });
        return;
      }

      // Add to database
      const { data, error } = await supabase
        .from('mood_entries')
        .insert({
          mood_rating: mapMoodTypeToRating(newMood.mood),
          notes: newMood.notes || null,
          date: newMood.date,
          mood_factors: mapFactorsToStringArray(newMood.factors)
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving mood:', error);
        toast({
          title: "Failed to save mood",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Add new mood to state
      const moodWithId: Mood = {
        id: data.id,
        date: data.date,
        mood: newMood.mood,
        notes: newMood.notes,
        factors: newMood.factors
      };
      setMoods([moodWithId, ...moods]);

      toast({
        title: "Mood logged",
        description: "Your mood has been saved successfully",
      });
    } catch (err: any) {
      console.error('Error in addMood:', err);
      toast({
        title: "Error saving mood",
        description: err.message || "An unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const addAssessmentResult = async (result: Omit<AssessmentResult, 'id'>) => {
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        // If not authenticated, just add to local state
        setAssessmentResults([result, ...assessmentResults]);
        toast({
          title: "Assessment completed (offline mode)",
          description: "Sign in to save your data to your account",
        });
        return;
      }

      // Add to database
      const { data, error } = await supabase
        .from('assessment_results')
        .insert({
          date: result.date,
          depression_score: result.depression.score,
          depression_probability: result.depression.probability,
          depression_risk: result.depression.risk,
          anxiety_score: result.anxiety.score,
          anxiety_probability: result.anxiety.probability,
          anxiety_risk: result.anxiety.risk
        })
        .select();

      if (error) {
        console.error('Error saving assessment:', error);
        toast({
          title: "Failed to save assessment",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // Add new assessment to state
      setAssessmentResults([result, ...assessmentResults]);

      toast({
        title: "Assessment completed",
        description: "Your mental health assessment has been saved",
      });
    } catch (err: any) {
      console.error('Error in addAssessmentResult:', err);
      toast({
        title: "Error saving assessment",
        description: err.message || "An unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const getMoodsByDateRange = async (startDate: string, endDate: string): Promise<Mood[]> => {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      // Get from database
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });
      
      if (error) {
        console.error('Error fetching moods by date range:', error);
        return [];
      }

      if (data) {
        // Convert Supabase data to app's Mood format
        return data.map(entry => ({
          id: entry.id,
          date: entry.date,
          mood: mapMoodRatingToType(entry.mood_rating),
          notes: entry.notes || undefined,
          factors: entry.mood_factors ? mapMoodFactorsToObject(entry.mood_factors) : undefined
        }));
      }
    }
    
    // Fallback to local state filtering if not authenticated or if database query fails
    return moods.filter(
      (mood) => mood.date >= startDate && mood.date <= endDate
    );
  };

  const getLatestAssessmentResult = async (): Promise<AssessmentResult | undefined> => {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      // Get from database
      const { data, error } = await supabase
        .from('assessment_results')
        .select('*')
        .order('date', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is fine
        console.error('Error fetching latest assessment:', error);
        return undefined;
      }

      if (data) {
        // Convert Supabase data to app's AssessmentResult format
        return {
          date: data.date,
          depression: {
            score: data.depression_score,
            risk: data.depression_risk as 'low' | 'moderate' | 'high',
            probability: data.depression_probability
          },
          anxiety: {
            score: data.anxiety_score,
            risk: data.anxiety_risk as 'low' | 'moderate' | 'high',
            probability: data.anxiety_probability
          }
        };
      }
    }
    
    // Fallback to local state if not authenticated or if database query fails
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
    loading
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
