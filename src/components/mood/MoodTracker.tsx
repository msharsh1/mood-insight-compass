
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMentalHealth } from '@/contexts/MentalHealthContext';
import { Calendar as CalendarIcon, List, BarChart } from 'lucide-react';
import MoodCalendarView from './MoodCalendarView';
import MoodListView from './MoodListView';
import MoodFactorsView from './MoodFactorsView';

const MoodTracker = () => {
  const [view, setView] = useState<'calendar' | 'list' | 'factors'>('calendar');
  const { moods } = useMentalHealth();
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Mood Tracker</CardTitle>
          <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-full sm:w-auto">
            <TabsList className="grid grid-cols-3 w-full sm:w-auto">
              <TabsTrigger value="calendar" className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Calendar</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-1">
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">List</span>
              </TabsTrigger>
              <TabsTrigger value="factors" className="flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                <span className="hidden sm:inline">Factors</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <TabsContent value="calendar" className="mt-0">
          <MoodCalendarView moods={moods} />
        </TabsContent>
        <TabsContent value="list" className="mt-0">
          <MoodListView moods={moods} />
        </TabsContent>
        <TabsContent value="factors" className="mt-0">
          <MoodFactorsView moods={moods} />
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default MoodTracker;
