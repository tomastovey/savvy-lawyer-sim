
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4 px-6 md:px-10",
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <span className="font-bold text-xl text-primary">BriefCounsel</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-x-8">
          <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
          <a href="#upload" className="text-sm font-medium hover:text-primary transition-colors">Upload Case</a>
          <a href="#simulation" className="text-sm font-medium hover:text-primary transition-colors">Simulation</a>
        </nav>
        
        <div className="flex items-center gap-x-4">
          <Button variant="outline" size="sm" className="hidden md:inline-flex">Sign In</Button>
          <Button size="sm">Get Started</Button>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
