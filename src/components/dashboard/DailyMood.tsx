
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useMentalHealth } from '@/contexts/MentalHealthContext';
import { Smile, Frown, Meh, Smile as VeryHappyIcon, CloudRain } from 'lucide-react';
import { cn } from '@/lib/utils';

const moods = [
  {
    value: 'very-sad',
    icon: CloudRain,
    label: 'Very Sad',
    color: 'bg-red-100 text-red-800 hover:bg-red-200 data-[state=active]:bg-red-200 data-[state=active]:ring-2 data-[state=active]:ring-red-600',
  },
  {
    value: 'sad',
    icon: Frown,
    label: 'Sad',
    color: 'bg-orange-100 text-orange-800 hover:bg-orange-200 data-[state=active]:bg-orange-200 data-[state=active]:ring-2 data-[state=active]:ring-orange-600',
  },
  {
    value: 'neutral',
    icon: Meh,
    label: 'Neutral',
    color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 data-[state=active]:bg-yellow-200 data-[state=active]:ring-2 data-[state=active]:ring-yellow-600',
  },
  {
    value: 'happy',
    icon: Smile,
    label: 'Happy',
    color: 'bg-green-100 text-green-800 hover:bg-green-200 data-[state=active]:bg-green-200 data-[state=active]:ring-2 data-[state=active]:ring-green-600',
  },
  {
    value: 'very-happy',
    icon: VeryHappyIcon,
    label: 'Very Happy',
    color: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 data-[state=active]:bg-emerald-200 data-[state=active]:ring-2 data-[state=active]:ring-emerald-600',
  },
];

const DailyMood = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const { addMood } = useMentalHealth();

  const handleSubmit = () => {
    if (!selectedMood) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    addMood({
      date: today,
      mood: selectedMood as any,
      notes: notes.trim() || undefined,
    });
    
    // Reset form
    setSelectedMood(null);
    setNotes('');
  };

  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">How are you feeling today?</CardTitle>
        <CardDescription>Track your mood to gain insights</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {moods.map((mood) => {
            const Icon = mood.icon;
            return (
              <button
                key={mood.value}
                className={cn(
                  'p-3 rounded-lg flex flex-col items-center justify-center gap-1 transition-all',
                  selectedMood === mood.value ? 'ring-2 ring-offset-2 ring-mental-purple' : '',
                  mood.color
                )}
                onClick={() => setSelectedMood(mood.value)}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs font-medium">{mood.label}</span>
              </button>
            );
          })}
        </div>
        
        <Textarea
          placeholder="Add notes about how you're feeling (optional)"
          className="min-h-[80px] mb-4 input-gradient"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        
        <Button 
          onClick={handleSubmit}
          disabled={!selectedMood}
          className="w-full btn-gradient text-white"
        >
          Log Today's Mood
        </Button>
      </CardContent>
    </Card>
  );
};

export default DailyMood;
