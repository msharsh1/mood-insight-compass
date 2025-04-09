
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Mood } from '@/types';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface MoodCalendarViewProps {
  moods: Mood[];
}

const MoodCalendarView = ({ moods }: MoodCalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Creates a lookup of dates to moods for faster access
  const moodsByDate = moods.reduce<Record<string, Mood>>((acc, mood) => {
    acc[mood.date] = mood;
    return acc;
  }, {});

  // For showing selected mood details
  const selectedDateStr = selectedDate?.toISOString().split('T')[0];
  const selectedMood = selectedDateStr ? moodsByDate[selectedDateStr] : undefined;
  
  // Custom day renderer for the calendar
  const dayRenderer = (day: Date) => {
    const dateStr = day.toISOString().split('T')[0];
    const mood = moodsByDate[dateStr];
    
    if (!mood) return null;
    
    const moodColors = {
      'very-sad': 'bg-red-200',
      'sad': 'bg-orange-200',
      'neutral': 'bg-yellow-200',
      'happy': 'bg-green-200',
      'very-happy': 'bg-emerald-200',
    };
    
    const moodEmojis = {
      'very-sad': '😢',
      'sad': '😟',
      'neutral': '😐',
      'happy': '🙂',
      'very-happy': '😄',
    };
    
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium",
          moodColors[mood.mood]
        )}>
          {moodEmojis[mood.mood]}
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
          components={{
            DayContent: ({ day }) => dayRenderer(day),
          }}
        />
      </div>
      
      {selectedMood ? (
        <Card className="bg-card/50 shadow-sm">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">
                  {new Date(selectedMood.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h3>
                <div className="flex items-center mt-1">
                  <span className="text-lg mr-2">
                    {selectedMood.mood === 'very-happy' && '😄'}
                    {selectedMood.mood === 'happy' && '🙂'}
                    {selectedMood.mood === 'neutral' && '😐'}
                    {selectedMood.mood === 'sad' && '😟'}
                    {selectedMood.mood === 'very-sad' && '😢'}
                  </span>
                  <span className="capitalize">{selectedMood.mood.replace('-', ' ')}</span>
                </div>
              </div>
              
              {selectedMood.notes && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
                  <p className="mt-1 text-sm">{selectedMood.notes}</p>
                </div>
              )}
              
              {selectedMood.factors && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Factors</h4>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {Object.entries(selectedMood.factors).map(([factor, rating]) => (
                      <div key={factor} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{factor}</span>
                        <span className="text-sm font-medium">{rating}/10</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : selectedDate ? (
        <p className="text-center text-muted-foreground">No mood recorded for this date</p>
      ) : null}
    </div>
  );
};

export default MoodCalendarView;
