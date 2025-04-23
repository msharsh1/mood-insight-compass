
import React, { useState, useEffect } from 'react';
import { MentalHealthProvider } from '@/contexts/MentalHealthContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Dashboard from './Dashboard';
import MoodPage from './MoodPage';
import AssessmentPage from './AssessmentPage';
import ReportsPage from './ReportsPage';
import ResourcesPage from './ResourcesPage';
import SettingsPage from './SettingsPage';
import NotFound from './NotFound';
import AuthPage from './AuthPage';
import AdminPage from './AdminPage';

const Index = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) return <div>Loading...</div>;
    return session ? <>{children}</> : <Navigate to="/auth" replace />;
  };

  return (
    <MentalHealthProvider>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/mood-log" element={<ProtectedRoute><MoodPage /></ProtectedRoute>} />
        <Route path="/assessment" element={<ProtectedRoute><AssessmentPage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="/resources" element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MentalHealthProvider>
  );
};

export default Index;
