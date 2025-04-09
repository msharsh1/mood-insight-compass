
import React from 'react';
import { MentalHealthProvider } from '@/contexts/MentalHealthContext';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import MoodPage from './MoodPage';
import AssessmentPage from './AssessmentPage';
import ReportsPage from './ReportsPage';
import ResourcesPage from './ResourcesPage';
import SettingsPage from './SettingsPage';
import NotFound from './NotFound';

const Index = () => {
  return (
    <MentalHealthProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/mood-log" element={<MoodPage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MentalHealthProvider>
  );
};

export default Index;
