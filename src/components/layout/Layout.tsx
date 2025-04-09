
import React, { ReactNode } from 'react';
import Header from './Header';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <ScrollArea className="flex-grow">
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </ScrollArea>
    </div>
  );
};

export default Layout;
