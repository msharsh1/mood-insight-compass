
import React from 'react';
import { Mood } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

interface MoodListViewProps {
  moods: Mood[];
}

const MoodListView = ({ moods }: MoodListViewProps) => {
  // Sort moods by date, newest first
  const sortedMoods = [...moods].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'very-happy': return '😄';
      case 'happy': return '🙂';
      case 'neutral': return '😐';
      case 'sad': return '😟';
      case 'very-sad': return '😢';
      default: return '❓';
    }
  };
  
  const getMoodColorClass = (mood: string) => {
    switch (mood) {
      case 'very-happy': return 'bg-emerald-100 text-emerald-800';
      case 'happy': return 'bg-green-100 text-green-800';
      case 'neutral': return 'bg-yellow-100 text-yellow-800';
      case 'sad': return 'bg-orange-100 text-orange-800';
      case 'very-sad': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <ScrollArea className="h-[500px] pr-4">
      {sortedMoods.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No mood entries yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedMoods.map((mood) => (
            <div 
              key={mood.id} 
              className="border rounded-lg p-4 hover:bg-accent/20 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getMoodColorClass(mood.mood)}`}>
                    {getMoodEmoji(mood.mood)}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium capitalize">{mood.mood.replace('-', ' ')}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(mood.date)}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(mood.date), { addSuffix: true })}
                </span>
              </div>
              
              {mood.notes && (
                <div className="mt-2 text-sm">
                  <p className="text-muted-foreground">Notes:</p>
                  <p className="mt-1">{mood.notes}</p>
                </div>
              )}
              
              {mood.factors && Object.keys(mood.factors).length > 0 && (
                <div className="mt-3 text-sm">
                  <p className="text-xs text-muted-foreground mb-1">Factors:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                    {Object.entries(mood.factors).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="capitalize">{key}:</span>
                        <span className="font-medium">{value}/10</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );
};

export default MoodListView;
