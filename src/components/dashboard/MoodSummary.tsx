
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMentalHealth } from '@/contexts/MentalHealthContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const moodToScore = {
  'very-sad': 1,
  'sad': 2,
  'neutral': 3,
  'happy': 4,
  'very-happy': 5,
};

const scoreToMood = (score: number) => {
  if (score < 1.5) return 'Very Sad';
  if (score < 2.5) return 'Sad';
  if (score < 3.5) return 'Neutral';
  if (score < 4.5) return 'Happy';
  return 'Very Happy';
};

const MoodSummary = () => {
  const { moods } = useMentalHealth();
  
  // Prepare data for chart
  const chartData = [...moods]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(mood => ({
      date: new Date(mood.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: moodToScore[mood.mood],
    }));
  
  // Calculate average mood
  const averageMood = moods.length > 0
    ? moods.reduce((sum, mood) => sum + moodToScore[mood.mood], 0) / moods.length
    : 0;
  
  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Mood Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-1">Average Mood</p>
          <p className="text-2xl font-bold text-mental-deep-purple">{scoreToMood(averageMood)}</p>
        </div>
        
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.split(' ')[0]}
              />
              <YAxis 
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]} 
                tickFormatter={(value) => ['😢', '😟', '😐', '🙂', '😄'][value - 1]} 
                tick={{ fontSize: 14 }}
              />
              <Tooltip 
                formatter={(value) => [scoreToMood(Number(value)), 'Mood']} 
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#7E69AB" 
                fill="url(#moodGradient)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodSummary;
