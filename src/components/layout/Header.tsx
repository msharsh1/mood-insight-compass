
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Calendar, BarChart3, User, BookOpen, Settings, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Header = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    let mounted = true;
    const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setUserEmail(session?.user?.email ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) setUserEmail(session?.user?.email ?? null);
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, [location]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserEmail(null);
    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-mental-purple" />
          <h1 className="text-xl font-semibold bg-gradient-to-r from-mental-purple to-mental-deep-purple bg-clip-text text-transparent">MindTrack</h1>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-foreground/80 hover:text-mental-purple transition-colors">Dashboard</Link>
          <Link to="/mood-log" className="text-foreground/80 hover:text-mental-purple transition-colors">Mood Tracker</Link>
          <Link to="/assessment" className="text-foreground/80 hover:text-mental-purple transition-colors">Assessment</Link>
          <Link to="/reports" className="text-foreground/80 hover:text-mental-purple transition-colors">Reports</Link>
          <Link to="/resources" className="text-foreground/80 hover:text-mental-purple transition-colors">Resources</Link>
          <Link to="/settings" className="text-foreground/80 hover:text-mental-purple transition-colors">Settings</Link>
          {userEmail ? (
            <div className="flex items-center gap-3 ml-6">
              <span className="text-foreground/70">{userEmail}</span>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Log out">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Link to="/auth" className="text-mental-purple underline ml-6">
              Login / Sign Up
            </Link>
          )}
        </nav>
        
        <div className="md:hidden flex items-center">
          <div className="flex space-x-2">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <BarChart3 className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/mood-log">
              <Button variant="ghost" size="icon">
                <Calendar className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/assessment">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/reports">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/resources">
              <Button variant="ghost" size="icon">
                <BookOpen className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
            {!userEmail && (
              <Link to="/auth">
                <Button variant="ghost" size="icon" title="Login / Sign Up">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
            {userEmail && (
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Log out">
                <LogOut className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
