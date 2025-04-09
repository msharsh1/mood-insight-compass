
import React from 'react';
import Layout from '@/components/layout/Layout';
import MoodTracker from '@/components/mood/MoodTracker';

const MoodPage = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-mental-purple to-mental-deep-purple bg-clip-text text-transparent">
          Mood Tracker
        </h1>
        <p className="text-muted-foreground mt-2 animate-fade-in">
          Track and visualize your mood patterns over time
        </p>
      </div>
      
      <MoodTracker />
    </Layout>
  );
};

export default MoodPage;
