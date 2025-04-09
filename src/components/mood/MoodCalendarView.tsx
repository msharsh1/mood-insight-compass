
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { addDays } from 'date-fns';

// Mock data for mood entries
const moodData = [
  { date: new Date(), value: 'happy' },
  { date: addDays(new Date(), -2), value: 'sad' },
  { date: addDays(new Date(), -5), value: 'neutral' },
  { date: addDays(new Date(), -7), value: 'anxious' },
  { date: addDays(new Date(), -10), value: 'happy' },
];

// Function to get mood for a specific date
const getMoodForDate = (date: Date) => {
  return moodData.find(
    mood => mood.date.toDateString() === date.toDateString()
  )?.value;
};

// Function to get class based on mood
const getMoodClass = (mood: string | undefined) => {
  switch (mood) {
    case 'happy':
      return 'bg-green-500';
    case 'neutral':
      return 'bg-blue-500';
    case 'sad':
      return 'bg-amber-500';
    case 'anxious':
      return 'bg-red-500';
    default:
      return '';
  }
};

const MoodCalendarView = () => {
  const today = new Date();
  
  // Custom day rendering for Calendar
  const renderDay = () => {
    return (props: any) => {
      const date = props.date;
      const mood = date ? getMoodForDate(date) : undefined;
      const moodClass = getMoodClass(mood);
      
      return (
        <div className="relative">
          {mood && (
            <div
              className={`absolute w-3 h-3 rounded-full ${moodClass} top-0 right-0`}
            />
          )}
          {props.children}
        </div>
      );
    };
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="font-semibold mb-4">Mood Calendar</h2>
        <Calendar
          mode="single"
          selected={today}
          className="rounded-md border"
          components={{
            Day: renderDay()
          }}
        />
        <div className="flex justify-around mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
            <span className="text-xs">Happy</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
            <span className="text-xs">Neutral</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-amber-500 rounded-full mr-1"></div>
            <span className="text-xs">Sad</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
            <span className="text-xs">Anxious</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodCalendarView;
