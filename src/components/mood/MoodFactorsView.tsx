
import React from 'react';
import { Mood } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface MoodFactorsViewProps {
  moods: Mood[];
}

const MoodFactorsView = ({ moods }: MoodFactorsViewProps) => {
  // Only consider moods that have factors
  const moodsWithFactors = moods.filter(mood => mood.factors);
  
  if (moodsWithFactors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-muted-foreground text-center">
          No mood factors data available. Start logging moods with factors to see insights.
        </p>
      </div>
    );
  }
  
  // Calculate average factor ratings by mood
  const factorsByMood: Record<string, Record<string, number>> = {
    'very-sad': {},
    'sad': {},
    'neutral': {},
    'happy': {},
    'very-happy': {},
  };
  
  const factorCounts: Record<string, Record<string, number>> = {
    'very-sad': {},
    'sad': {},
    'neutral': {},
    'happy': {},
    'very-happy': {},
  };
  
  // Collect all possible factors
  const allFactors = new Set<string>();
  
  // Sum up factors by mood
  moodsWithFactors.forEach(mood => {
    if (!mood.factors) return;
    
    Object.entries(mood.factors).forEach(([factor, rating]) => {
      allFactors.add(factor);
      
      if (!factorsByMood[mood.mood][factor]) {
        factorsByMood[mood.mood][factor] = 0;
        factorCounts[mood.mood][factor] = 0;
      }
      
      factorsByMood[mood.mood][factor] += rating;
      factorCounts[mood.mood][factor]++;
    });
  });
  
  // Calculate averages
  Object.keys(factorsByMood).forEach(mood => {
    Object.keys(factorsByMood[mood]).forEach(factor => {
      if (factorCounts[mood][factor]) {
        factorsByMood[mood][factor] /= factorCounts[mood][factor];
        // Round to 1 decimal place
        factorsByMood[mood][factor] = Math.round(factorsByMood[mood][factor] * 10) / 10;
      }
    });
  });
  
  // Create chart data - one entry per factor
  const chartData = Array.from(allFactors).map(factor => {
    return {
      name: factor.charAt(0).toUpperCase() + factor.slice(1),
      "Very Sad": factorsByMood['very-sad'][factor] || 0,
      "Sad": factorsByMood['sad'][factor] || 0,
      "Neutral": factorsByMood['neutral'][factor] || 0,
      "Happy": factorsByMood['happy'][factor] || 0,
      "Very Happy": factorsByMood['very-happy'][factor] || 0,
    };
  });
  
  return (
    <div className="py-4">
      <h3 className="text-lg font-medium mb-4">Average Factor Ratings by Mood</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              top: 5,
              right: 30,
              left: 50,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 10]} />
            <YAxis dataKey="name" type="category" width={80} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Very Sad" fill="#f87171" />
            <Bar dataKey="Sad" fill="#fb923c" />
            <Bar dataKey="Neutral" fill="#facc15" />
            <Bar dataKey="Happy" fill="#4ade80" />
            <Bar dataKey="Very Happy" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-muted-foreground mt-4 text-center">
        This chart shows how different factors relate to your mood states.
      </p>
    </div>
  );
};

export default MoodFactorsView;
