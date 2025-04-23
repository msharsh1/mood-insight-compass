
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
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage instead of Supabase session
    const checkLocalUser = () => {
      const storedUser = localStorage.getItem('currentUser');
      setUser(storedUser ? JSON.parse(storedUser) : null);
      setLoading(false);
    };

    checkLocalUser();

    // Still listen to Supabase auth changes for logout handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        // User logged out from Supabase
        localStorage.removeItem('currentUser');
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
    if (loading) return <div>Loading...</div>;
    
    if (!user) {
      return <Navigate to="/auth" replace />;
    }
    
    // For admin routes, check if user is admin
    if (adminOnly && !user.isAdmin) {
      return <Navigate to="/" replace />;
    }
    
    return <>{children}</>;
  };

  return (
    <MentalHealthProvider>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminPage /></ProtectedRoute>} />
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
