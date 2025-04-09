
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeartPulse, ArrowRight } from 'lucide-react';

const wellnessTips = [
  {
    title: "Practice Deep Breathing",
    content: "Take 5 minutes to practice deep breathing. Inhale for 4 counts, hold for 4, and exhale for 6 counts.",
    category: "stress-relief"
  },
  {
    title: "Mindful Walking",
    content: "Take a 10-minute walk focusing on each step and your surroundings. Notice the sights, sounds, and sensations.",
    category: "mindfulness"
  },
  {
    title: "Gratitude Journaling",
    content: "Write down three things you're grateful for today, no matter how small they might seem.",
    category: "positivity"
  },
  {
    title: "Digital Detox",
    content: "Take a 30-minute break from all screens and digital devices. Use this time for yourself.",
    category: "self-care"
  },
  {
    title: "Connect with Someone",
    content: "Reach out to a friend or family member you haven't spoken to in a while.",
    category: "social"
  },
  {
    title: "Progressive Muscle Relaxation",
    content: "Tense and then release each muscle group in your body from head to toe.",
    category: "stress-relief"
  },
  {
    title: "Try the 5-4-3-2-1 Grounding Exercise",
    content: "Notice 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
    category: "anxiety-relief"
  },
  {
    title: "Practice Self-Compassion",
    content: "Speak to yourself as you would to a good friend going through a difficult time.",
    category: "self-care"
  }
];

const WellnessTips = () => {
  const [currentTip, setCurrentTip] = useState(0);
  
  useEffect(() => {
    // Select a random tip on initial load
    const randomIndex = Math.floor(Math.random() * wellnessTips.length);
    setCurrentTip(randomIndex);
  }, []);
  
  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % wellnessTips.length);
  };
  
  return (
    <Card className="card-gradient h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <HeartPulse className="h-5 w-5 text-mental-purple" />
          <CardTitle className="text-lg font-semibold">Wellness Tip</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-medium mb-2">{wellnessTips[currentTip].title}</h3>
        <p className="text-sm text-muted-foreground">{wellnessTips[currentTip].content}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="ghost" size="sm" className="ml-auto text-mental-deep-purple hover:bg-mental-deep-purple/10 hover:text-mental-deep-purple flex items-center gap-1" onClick={nextTip}>
          Next Tip <ArrowRight className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WellnessTips;
