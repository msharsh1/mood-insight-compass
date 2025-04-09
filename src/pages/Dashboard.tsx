
import React from 'react';
import Layout from '@/components/layout/Layout';
import MoodSummary from '@/components/dashboard/MoodSummary';
import AssessmentSummary from '@/components/dashboard/AssessmentSummary';
import DailyMood from '@/components/dashboard/DailyMood';
import WellnessTips from '@/components/dashboard/WellnessTips';

const Dashboard = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-mental-purple to-mental-deep-purple bg-clip-text text-transparent">
          Mental Health Dashboard
        </h1>
        <p className="text-muted-foreground mt-2 animate-fade-in">
          Track your mental health, log your moods, and gain insights into your wellbeing
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <MoodSummary />
        <AssessmentSummary />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <DailyMood />
        </div>
        <div>
          <WellnessTips />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
