
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Mood } from '@/types';

interface MoodSummaryReportProps {
  moods: Mood[];
}

const MoodSummaryReport = ({ moods }: MoodSummaryReportProps) => {
  if (moods.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No mood data available for the selected period.</p>
      </div>
    );
  }
  
  // Count occurrences of each mood
  const moodCounts = moods.reduce((counts, mood) => {
    const moodType = mood.mood;
    counts[moodType] = (counts[moodType] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
  
  // Prepare data for pie chart
  const pieData = Object.entries(moodCounts).map(([mood, count]) => ({
    name: mood.replace('-', ' '),
    value: count,
  }));
  
  // Colors for pie chart
  const COLORS = {
    'very sad': '#f87171',   // red
    'sad': '#fb923c',        // orange
    'neutral': '#facc15',    // yellow
    'happy': '#4ade80',      // green
    'very happy': '#10b981', // emerald
  };
  
  // Calculate average values for factors if they exist
  const factorsData: { name: string, value: number }[] = [];
  let totalEntriesWithFactors = 0;
  
  const factorsTotals: Record<string, { total: number, count: number }> = {};
  
  moods.forEach(mood => {
    if (!mood.factors) return;
    
    totalEntriesWithFactors++;
    
    Object.entries(mood.factors).forEach(([factor, value]) => {
      if (!factorsTotals[factor]) {
        factorsTotals[factor] = { total: 0, count: 0 };
      }
      
      factorsTotals[factor].total += value;
      factorsTotals[factor].count += 1;
    });
  });
  
  // Calculate averages and prepare data for bar chart
  if (totalEntriesWithFactors > 0) {
    Object.entries(factorsTotals).forEach(([factor, { total, count }]) => {
      factorsData.push({
        name: factor.charAt(0).toUpperCase() + factor.slice(1),
        value: Math.round((total / count) * 10) / 10,
      });
    });
  }
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium">Mood Distribution</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Based on {moods.length} mood entries
        </p>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name as keyof typeof COLORS]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip formatter={(value) => [value, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {factorsData.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">Average Factor Ratings</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={factorsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 10]} />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#9b87f5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Average rating on a scale from 1-10
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MoodSummaryReport;
