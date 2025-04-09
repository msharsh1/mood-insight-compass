
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Calendar, BarChart3, User } from 'lucide-react';

const Header = () => {
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
        </nav>
        
        <div className="md:hidden flex items-center">
          <div className="flex space-x-3">
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
